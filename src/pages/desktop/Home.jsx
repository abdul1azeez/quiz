import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
import CategoryTray from "../../components/desktop/CategoryTray";
import { ScrollToTop } from "../../components/mini_components";
import { Post, FeaturedArticle } from "../../components/desktop";
import { useProfileDetails } from "../../hooks/useProfileDetails";
import { 
  getSections, 
  getUserFollowedSections, 
  followSection, 
  unfollowSection 
} from "../../services/sectionService";

const BASE_URL = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content";

const Home = () => {
  const auth = useAuth();
  const { profile } = useProfileDetails();

  // --- Derive userId ---
  const userId = profile?.userId || localStorage.getItem("userId") || null;
  console.log("DEBUG AUTH:", { 
    authStatus: auth.isAuthenticated,
    profileObject: profile,
    localStorageId: localStorage.getItem("userId"),
    computedUserId: userId 
  });
  const isAuthReady = !!userId;
  // --- 1. STATE MANAGEMENT ---
  const [sectionList, setSectionList] = useState([]); 
  const [activeSectionId, setActiveSectionId] = useState(null); 
  
  // 2. NEW STATE: Track which sections the user is following
  const [followedIds, setFollowedIds] = useState([]); 

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // --- Infinite scroll target ---
  const loadMoreRef = useRef(null);

  // --- 3. RESET WHEN CATEGORY CHANGES ---
  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    setLoading(false); 
  }, [activeSectionId]);

  // --- 4. INITIAL FETCH (SECTIONS + USER FOLLOWS) ---
  useEffect(() => {
    const initData = async () => {
      // A. Get All Sections (Menu)
      const allSections = await getSections();
      const list = Array.isArray(allSections) ? allSections : (allSections.content || []);
      setSectionList(list);

      // B. Get User's Followed Sections (If logged in)
      if (userId) {
        const userFollows = await getUserFollowedSections(userId);
        // Extract just the IDs (e.g., ["uuid-1", "uuid-2"]) for easy checking
        // Note: Check if API returns objects or just IDs. Usually objects.
        const ids = Array.isArray(userFollows) ? userFollows.map(sec => sec.id) : [];
        setFollowedIds(ids);
      }
    };

    initData();
  }, [userId]); // Re-run if userId changes (login/logout)

 // --- 5. HANDLE FOLLOW / UNFOLLOW ---
  const handleToggleFollow = async (sectionId, isCurrentlyFollowed) => {
    // 1. SAFETY CHECK: If auth is still loading, just do nothing.
    // This prevents the "Login" alert from appearing during the split-second boot up.
    if (auth.isLoading) {
      console.log("⏳ Auth still loading, click ignored.");
      return;
    }

    const effectiveUserId = userId || localStorage.getItem("userId");
    const token = auth.user?.access_token || localStorage.getItem("token"); 

    // 2. REAL AUTH CHECK: If done loading and still no ID, THEN alert.
    if (!effectiveUserId || !token) {
      alert("Please login to follow topics!"); 
      return;
    }

    // ... (rest of the logic stays the same) ...
    
    // A. Optimistic Update
    setFollowedIds(prev => 
      isCurrentlyFollowed 
        ? prev.filter(id => id !== sectionId) 
        : [...prev, sectionId] 
    );

    // B. API Call
    let success;
    if (isCurrentlyFollowed) {
      success = await unfollowSection(sectionId, effectiveUserId, token);
    } else {
      success = await followSection(sectionId, effectiveUserId, token);
    }

    if (!success) {
      setFollowedIds(prev => 
        isCurrentlyFollowed 
          ? [...prev, sectionId] 
          : prev.filter(id => id !== sectionId)
      );
    }
  };

  // --- 6. MAIN POST FETCH LOGIC ---
  useEffect(() => {
    const fetchPosts = async () => {
      if (loading) return;
      if (!hasMore && page !== 0) return;

      setLoading(true);
      try {
        const sectionParam = activeSectionId ? `&sections=${activeSectionId}` : "";

        const res = await fetch(
          `${BASE_URL}?publishedOnly=true&page=${page}&size=20&sort=createdAt,desc${sectionParam}`
        );
        
        const data = await res.json();
        const newPosts = data.content || [];

        setPosts((prev) => {
          if (page === 0) return newPosts;
          return [...prev, ...newPosts];
        });

        if (newPosts.length === 0) {
          setHasMore(false); 
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

  }, [page, activeSectionId]);

  // --- Intersection Observer ---
  useEffect(() => {
    if (!loadMoreRef.current || loading || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  // --- Feed Helpers ---
  const feedItems = [];
  posts.forEach((post, index) => {
    feedItems.push({ type: "post", data: post });
    if ((index + 1) % 5 === 0) {
      feedItems.push({ type: "topics" });
    }
  });

  const handleCommentAdded = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, commentCount: (p.commentCount || 0) + 1 }
          : p
      )
    );
  };

  const currentSectionName = activeSectionId 
    ? sectionList.find(s => s.id === activeSectionId)?.name || "Unknown"
    : "For you";

  return (
    <div className="flex flex-col px-[min(3em,3.5%)] items-center gap-4">
      
      {/* 7. UPDATED CATEGORY TRAY */}
      <CategoryTray 
        categories={sectionList}  
        selectedId={activeSectionId} 
        onSelect={setActiveSectionId} 
        
        followedIds={followedIds}
        onToggleFollow={handleToggleFollow}

        canFollow={true}
      />

      <div className="text-sm text-gray-500 font-bold">
        Viewing: {currentSectionName}
      </div>

      {/* --- Header & Mobile Featured --- */}
      <div className="container flex flex-col gap-4 w-full max-w-5xl">
        <div className="featuredSection flex flex-col gap-3 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FeaturedArticle />
        </div>
      </div>

      {/* --- Main Feed --- */}
      <div className="divide-y divide-surface-stroke flex flex-col items-center gap-2 w-full max-w-5xl">
        
        {loading && page === 0 && (
           <div className="py-10 text-gray-400">Loading {currentSectionName}...</div>
        )}

        {feedItems.map((item, idx) => {
          if (item.type === "post") {
            return (
              <div className="w-full" key={idx}>
                <Post
                  post={{
                    ...item.data,
                    authorDisplay: `@${item.data.authorId}`,
                  }}
                  currentUserId={userId}
                  onCommentAdded={() => handleCommentAdded(item.data.id)}
                />
              </div>
            );
          } else {
            return (
              <div className="w-full flex flex-col gap-4 pb-4" key={idx}>
                {/* <TopicsCard /> */}
              </div>
            );
          }
        })}

        <div ref={loadMoreRef} className="h-10" />

        {loading && page > 0 && (
          <div className="py-6 text-center text-sm text-gray-500">
            Loading more posts...
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="py-6 text-center text-sm text-gray-400">
            You’re all caught up 🎉
          </div>
        )}
        
        {!hasMore && posts.length === 0 && !loading && (
           <div className="py-10 text-center text-gray-500">
             No posts found for "{currentSectionName}" yet.
           </div>
        )}
      </div>

      <ScrollToTop />
    </div>
  );
};

export default Home;