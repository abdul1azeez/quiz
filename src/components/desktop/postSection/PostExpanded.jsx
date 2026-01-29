import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Trash2, Globe, Archive, PenLine } from "lucide-react";
import { useAuth } from "react-oidc-context";
import CommentsSection from "./CommentsSection";
import { useProfileDetails } from "../../../hooks/useProfileDetails";
import PostExpandedNavbar from "../Navbar/PostExpandedNavbar";

// ======================================================
// Utils
// ======================================================

const getFormattedDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  const base = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  if (diff < 300) return `${base} | Just now`;
  if (diff < 3600) return `${base} | ${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${base} | ${Math.floor(diff / 3600)} hrs ago`;
  return base;
};

// ======================================================
// Component
// ======================================================

const BASE_URL = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content";

const PostExpanded = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { profile } = useProfileDetails();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const userID = profile?.userId || localStorage.getItem("userId");

  // 1. Get Slug from URL
  const { slug } = useParams();

  // 2. Extract ID (Defensive check included)
  // Ensure we grab the last 36 chars (UUID length) regardless of title length
  const id = slug?.slice(-36);

  // Publishing state or Unpublishing state
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Failed to load post:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  useEffect(() => {
    if (auth.isAuthenticated && profile?.userId) {
      localStorage.setItem("userId", profile.userId);
    }
  }, [auth.isAuthenticated, profile?.userId]);


  // --------------------------------------------------
  // Delete post
  // --------------------------------------------------
  // --------------------------------------------------
  // Delete post
  // --------------------------------------------------
  // const handleDelete = async () => {
  //   if (!window.confirm("Delete this post permanently?")) return;

  //   const token = localStorage.getItem("cognito_jwt");

  //   try {
  //     await axios.delete(`${BASE_URL}/${post.id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     alert("Post deleted");
  //     navigate("/");
  //   } catch (err) {
  //     console.error("Delete failed:", err);

  //     // ✅ FIX: Handle the 409 Conflict specifically
  //     if (err.response && err.response.status === 409) {
  //       alert("Cannot delete this post because it has comments or interactions. Please delete the comments first.");
  //     } else {
  //       alert("Delete failed. Please try again later.");
  //     }
  //   }
  // };

  // --------------------------------------------------
  // CASCADE DELETE LOGIC
  // --------------------------------------------------
  const [isDeleting, setIsDeleting] = useState(false); // New state for delete loading

  // Helper: Recursively find and destroy a comment and all its descendants
  const deleteCommentTree = async (commentId, token) => {
    try {
      // 1. Fetch replies for this specific comment
      // We must know if it has children before we can kill it
      const res = await axios.get(`${API_ROOT}/comments/${commentId}/replies`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const replies = res.data?.content || [];

      // 2. If replies exist, delete them FIRST (Recursion)
      if (replies.length > 0) {
        await Promise.all(replies.map(reply => deleteCommentTree(reply.id, token)));
      }

      // 3. Once all children are deleted, safe to delete the parent
      await axios.delete(`${API_ROOT}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

    } catch (err) {
      // Ignore 404s (if it's already gone, good!)
      if (err.response?.status !== 404) {
        console.error(`Failed to delete comment tree ${commentId}`, err);
        throw err; // Re-throw real errors to stop the process
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("⚠️ WARNING: This will permanently delete the post AND all its comments. Continue?")) return;

    const token = localStorage.getItem("cognito_jwt");
    setIsDeleting(true);

    try {
      // STEP 1: Fetch Top-Level Comments
      const commentsRes = await axios.get(`${API_ROOT}/comments/content/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const topLevelComments = commentsRes.data?.content || [];

      // STEP 2: Recursively delete every comment tree
      if (topLevelComments.length > 0) {
        console.log(`Processing ${topLevelComments.length} comment threads...`);
        await Promise.all(
          topLevelComments.map(comment => deleteCommentTree(comment.id, token))
        );
      }

      // STEP 3: Now safe to delete the Post
      await axios.delete(`${API_ROOT}/content/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Post and all comments deleted successfully.");
      navigate("/");

    } catch (err) {
      console.error("Cascade delete failed:", err);
      alert("Failed to delete post. Some data might be stuck on the server.");
    } finally {
      setIsDeleting(false);
    }
  };

  /// Handle Publish / Unpublish STATES
  const handleTogglePublish = async () => {
    const token = auth.user?.id_token || localStorage.getItem("cognito_jwt");
    if (!token) return alert("Not authenticated");

    setIsPublishing(true);

    try {
      const endpoint = post.published
        ? `https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/posts/${post.id}/unpublish`
        : `https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/posts/${post.id}/publish`;

      const res = await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPost(res.data); // backend returns updated post
    } catch (err) {
      console.error("Publish/unpublish failed:", err);

      if (err.response?.status === 403) {
        alert("You can only publish/unpublish your own post");
      } else {
        alert("Failed to update post status");
      }
    } finally {
      setIsPublishing(false);
    }
  };


  // --------------------------------------------------
  // States
  // --------------------------------------------------
  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!post) return <p className="text-center py-20">Post not found</p>;

  // --------------------------------------------------
  // Author
  // --------------------------------------------------
  const authorName = post.author?.displayName || post.author?.handle || "Unknown Author";
  const authorPic = post.author?.avatarUrl || "https://api.dicebear.com/8.x/initials/svg?seed=unknown";

  return (
    <div className="w-full flex flex-col items-center">
      <PostExpandedNavbar />

      <div className="w-full max-w-3xl px-6 py-10">
        <p className="text-xs tracking-widest text-secondary uppercase mb-2">
          {authorName}
        </p>

        <h1 className="font-cardo text-4xl font-bold mb-2 text-primary">
          {post.title}
        </h1>

        {/* <div className="mb-4">
          {post.published ? (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
              Published
            </span>
          ) : (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
              Draft
            </span>
          )}
        </div> */}


        {post.subtitle && (
          <p className="text-lg text-tertiary mb-4">{post.subtitle}</p>
        )}

        {/* Author row */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center lg:flex-row lg:items-center justify-between mb-3 lg:mb-8">
          <Link to={`/profile/${post.author?.handle || ""}`}>
            <div className="flex items-center gap-3">
              <img
                src={authorPic}
                alt="author"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-primary">
                  {authorName}
                </p>
                <p className="text-xs text-tertiary">
                  {getFormattedDate(post.createdAt)}
                </p>
              </div>
            </div>
          </Link>

          {/* Edit / Delete */}
          {/* {auth.isAuthenticated && userID === post.author?.id && ( */}
          {userID && post.author?.id && userID === post.author.id && (
            <div className="flex items-center gap-2">

              {/* GROUP 1: CONSTRUCTIVE ACTIONS */}
              <button
                onClick={handleTogglePublish}
                disabled={isPublishing || isDeleting}
                className={`
      flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
      ${post.published
                    ? "text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-200"
                    : "text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 hover:shadow-sm"
                  }
    `}
                title={post.published ? "Unpublish this post" : "Publish this post"}
              >
                {isPublishing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : post.published ? (
                  <>
                    <Archive size={16} />
                    <span>Unpublish</span>
                  </>
                ) : (
                  <>
                    <Globe size={16} />
                    <span>Publish</span>
                  </>
                )}
              </button>

              <button
                onClick={() => navigate(`/edit-post/${post.id}`)}
                disabled={isDeleting}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Edit this post"
              >
                <PenLine size={16} />
                <span>Edit</span>
              </button>

              {/* --- DIVIDER --- */}
              <div className="h-5 w-px bg-gray-300 mx-2" />

              {/* GROUP 2: DESTRUCTIVE ACTION */}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete this post"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-red-600" />
                  </>
                ) : (
                  <Trash2 size={16} />
                )}
                {/* Optional: Hide text on mobile, show on desktop */}
                <span className={isDeleting ? "text-red-600" : ""}>Delete</span>
              </button>
            </div>
          )}
        </div>

        <hr className="border-surface-stroke mb-6" />

        <article
          className="prose prose-lg max-w-none font-mulish text-primary"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        <hr className="border-surface-stroke mt-10 mb-6" />

        <div className="commentSection pb-6">
          <CommentsSection postId={post.id} />
        </div>
      </div>
    </div>
  );
};

export default PostExpanded;