import { useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";

import { StreakInfo } from "../../components/mini_components";
import { Post, FeaturedArticle } from "../../components/desktop";
import { useProfileDetails } from "../../hooks/useProfileDetails";

const BASE_URL =
  "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content";

const Home = () => {
  const auth = useAuth();
  const { profile, loading: profileLoading } = useProfileDetails();

  // --- User ID ---
  const userId =
    profile?.userId || localStorage.getItem("userId") || null;

  // --- Feed state ---
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // --- Infinite scroll target ---
  const loadMoreRef = useRef(null);

  // --- Fetch posts (append) ---
  useEffect(() => {
    const fetchPosts = async () => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}?sections=AI&publishedOnly=true&page=${page}&size=20&sort=id`
        );
        const data = await res.json();

        const newPosts = data.content || [];

        setPosts((prev) => [...prev, ...newPosts]);

        if (newPosts.length === 0) {
          setHasMore(false); // no more pages
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  // --- Intersection Observer (THE FIX) ---
  useEffect(() => {
    if (!loadMoreRef.current || loading || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      {
        root: null, // auto-detects scroll container
        rootMargin: "200px",
      }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [loading, hasMore]);

  // --- Insert topics every 5 posts ---
  const feedItems = [];
  posts.forEach((post, index) => {
    feedItems.push({ type: "post", data: post });
    if ((index + 1) % 5 === 0) {
      feedItems.push({ type: "topics" });
    }
  });

  // --- Update comment count locally ---
  const handleCommentAdded = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, commentCount: (p.commentCount || 0) + 1 }
          : p
      )
    );
  };

  if (profileLoading) {
    return <div className="p-6">Loading feed...</div>;
  }

  return (
    <div className="flex flex-col px-[min(3em,3.5%)] items-center gap-4">
      {/* --- Header --- */}
      <div className="container flex flex-col gap-4 w-full max-w-5xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {profile?.picture && (
              <img
                src={profile.picture}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <h1 className="text-3xl font-bold">
              {profile?.name || "Guest"}
            </h1>
          </div>

          <StreakInfo />
        </div>

        <FeaturedArticle />
      </div>

      {/* --- Feed --- */}
      <div className="divide-y divide-surface-stroke flex flex-col w-full max-w-5xl">
        {feedItems.map((item, idx) =>
          item.type === "post" ? (
            <div key={item.data.id} className="pb-4">
              <Post
                post={{
                  ...item.data,
                  authorDisplay: `@${item.data.authorId}`,
                }}
                currentUserId={userId}
                onCommentAdded={() =>
                  handleCommentAdded(item.data.id)
                }
              />
            </div>
          ) : (
            <div key={`topics-${idx}`} className="pb-4" />
          )
        )}

        {/* 👇 Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-10" />

        {loading && (
          <div className="py-6 text-center text-sm text-gray-500">
            Loading more posts...
          </div>
        )}

        {!hasMore && (
          <div className="py-6 text-center text-sm text-gray-400">
            You’re all caught up 🎉
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;