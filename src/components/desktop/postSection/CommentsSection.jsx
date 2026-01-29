/**
 * ⚠️ IMPORTANT FOR UI / CSS TEAM
 *
 * You may safely change:
 * - className values
 * - spacing, colors, fonts
 * - button labels / icons
 * - layout (flex, grid, margins)
 *
 * ❌ DO NOT change:
 * - function names
 * - state variables
 * - props passed to renderComment
 * - recursive render logic
 * - toggleReplies / fetchReplies calls
 *
 * Breaking the above WILL break nested replies.
 */

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";

/**
 * Base API URL
 */
const BASE_URL =
  "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";

/**
 * CommentsSection
 * - Shows top-level comments
 * - Supports replies (infinite nesting)
 * - Replies are lazy-loaded (fetched only when needed)
 */
const CommentsSection = ({ postId }) => {
  const auth = useAuth();
  const token = auth.user?.id_token;

  /**
   * State
   */
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  /**
   * Normalize backend comment object into a UI-friendly shape.
   * This keeps the frontend predictable and easy to maintain.
   */
  const mapComment = (c) => ({
    id: c.id,
    text: c.text,
    createdAt: c.createdAt,
    parentId: c.parentCommentId,
    replyCount: c.replyCount || 0,

    // UI-only fields (not from backend)
    replies: [],          // Holds loaded replies
    repliesLoaded: false, // Prevents refetching
    showReplies: false,   // Toggle visibility

    user: {
      id: c.user?.id,
      username: c.user?.handle || c.user?.displayName || "User",
      avatarUrl: c.user?.avatarUrl || null,
    },
  });

  /**
   * Fetch ONLY top-level comments for the content.
   * Replies are fetched separately when the user clicks "View replies".
   */
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/comments/content/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const mapped = (res.data?.content || []).map(mapComment);
      setComments(mapped);
    } catch (err) {
      console.error("[COMMENTS] Failed to fetch top-level comments", err);
    }
  };

  /**
   * Load comments when content changes
   */
  useEffect(() => {
    fetchComments();
  }, [postId]);

  /**
   * Fetch replies for ANY comment (top-level or nested).
   * This function walks the comment tree and attaches replies
   * to the correct parent comment.
   */
  const fetchReplies = async (parentId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/comments/${parentId}/replies`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const mappedReplies = (res.data?.content || []).map(mapComment);

      /**
       * Recursively find the parent comment and attach replies
       */
      const attachReplies = (list) =>
        list.map((c) => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: mappedReplies,
              repliesLoaded: true,
              showReplies: true,
            };
          }

          if (c.replies.length > 0) {
            return { ...c, replies: attachReplies(c.replies) };
          }

          return c;
        });

      setComments((prev) => attachReplies(prev));
    } catch (err) {
      console.error("[COMMENTS] Failed to fetch replies", err);
    }
  };

  /**
   * Toggle visibility of replies.
   * If replies were never loaded, fetch them first.
   */
  const toggleReplies = (comment) => {
    if (!comment.repliesLoaded) {
      fetchReplies(comment.id);
      return;
    }

    const toggle = (list) =>
      list.map((c) => {
        if (c.id === comment.id) {
          return { ...c, showReplies: !c.showReplies };
        }

        if (c.replies.length > 0) {
          return { ...c, replies: toggle(c.replies) };
        }

        return c;
      });

    setComments((prev) => toggle(prev));
  };

  /**
   * Post a new top-level comment
   */
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await axios.post(
        `${BASE_URL}/comments/content/${postId}`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentText("");
      fetchComments();
    } catch (err) {
      console.error("[COMMENTS] Failed to post comment", err);
    }
  };

  /**
   * Post a reply to ANY comment (nested replies supported)
   */
  const handleReply = async (parent) => {
    if (!replyText.trim()) return;

    try {
      await axios.post(
        `${BASE_URL}/comments/content/${postId}`,
        {
          text: replyText,
          parentCommentId: parent.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReplyText("");
      setReplyTo(null);

      // Reload replies for this comment only
      fetchReplies(parent.id);
    } catch (err) {
      console.error("[COMMENTS] Failed to post reply", err);
    }
  };

  /**
   * Convert ISO timestamp to readable date
   */
  const formatTime = (iso) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(iso));

  /**
   * Recursive comment renderer.
   * Calls itself for nested replies.
   */
  const renderComment = (c, depth = 0) => (
    <div key={c.id} style={{ marginLeft: depth * 28 }}>
      <div className="flex gap-3 py-4">
        <Link to={`/profile/${c.user.username}`}>
          {/* Avatar */}
          {c.user.avatarUrl ? (
            <img
              src={c.user.avatarUrl}
              alt="avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
              {c.user.username[0]?.toUpperCase()}
            </div>
          )}
        </Link>

        {/* Comment body */}
        <div className="flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${c.user.username}`}><span className="font-semibold">{c.user.username}</span> </Link>
            <span className="text-xs text-gray-500">
              {formatTime(c.createdAt)}
            </span>
          </div>

          <p className="mt-1">{c.text}</p>

          <div className="flex gap-4 mt-2 text-sm">
            <button
              onClick={() => setReplyTo(c)}
              className="text-brand-primary cursor-pointer"
            >
              Reply
            </button>

            {c.replyCount > 0 && (
              <button
                onClick={() => toggleReplies(c)}
                className="text-gray-600"
              >
                {c.showReplies ? "Hide" : "View"} replies ({c.replyCount})
              </button>
            )}
          </div>

          {/* Inline reply input */}
          {replyTo?.id === c.id && (
            <div className="mt-3">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply…"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={() => handleReply(c)}
                className="mt-2 px-3 py-1 bg-brand-primary text-white rounded cursor-pointer"
              >
                Send Reply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Render nested replies */}
      {c.showReplies &&
        c.replies.map((r) => renderComment(r, depth + 1))}
    </div>
  );

  /**
   * Component output
   */
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      {/* New comment input */}
      <form onSubmit={handleComment} className="flex gap-3 mb-6">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment…"
          className="flex-1 p-3 border rounded"
        />
        <button className="px-4 bg-brand-primary text-white rounded cursor-pointer hover:opacity-90">
          Send
        </button>
      </form>

      {/* Comments list */}
      {comments.map((c) => renderComment(c))}
    </div>
  );
};

export default CommentsSection;


/**
 * ⚠️ IMPORTANT FOR UI / CSS TEAM
 *
 * You may safely change:
 * - className values
 * - spacing, colors, fonts
 * - button labels / icons
 * - layout (flex, grid, margins)
 *
 * ❌ DO NOT change:
 * - function names
 * - state variables
 * - props passed to renderComment
 * - recursive render logic
 * - toggleReplies / fetchReplies calls
 *
 * Breaking the above WILL break nested replies.
 */

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "react-oidc-context";
// import { Link } from "react-router-dom"; // Fixed import from "react-router" to "react-router-dom"
// import { Trash2 } from "lucide-react"; // Import Trash icon

// /**
//  * Base API URL
//  */
// const BASE_URL =
//   "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";

// /**
//  * CommentsSection
//  * - Shows top-level comments
//  * - Supports replies (infinite nesting)
//  * - Replies are lazy-loaded (fetched only when needed)
//  */
// const CommentsSection = ({ postId }) => {
//   const auth = useAuth();
//   const token = auth.user?.id_token;

//   // ✅ GET CURRENT USER ID (Check both Auth and LocalStorage for safety)
//   const currentUserId = auth.user?.profile?.sub || localStorage.getItem("userId");

//   /**
//    * State
//    */
//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState("");
//   const [replyText, setReplyText] = useState("");
//   const [replyTo, setReplyTo] = useState(null);

//   /**
//    * Normalize backend comment object into a UI-friendly shape.
//    * This keeps the frontend predictable and easy to maintain.
//    */
//   const mapComment = (c) => ({
//     id: c.id,
//     text: c.text,
//     createdAt: c.createdAt,
//     parentId: c.parentCommentId,
//     replyCount: c.replyCount || 0,

//     // UI-only fields (not from backend)
//     replies: [],          // Holds loaded replies
//     repliesLoaded: false, // Prevents refetching
//     showReplies: false,   // Toggle visibility

//     user: {
//       id: c.user?.id,
//       username: c.user?.handle || c.user?.displayName || "User",
//       avatarUrl: c.user?.avatarUrl || null,
//     },
//   });

//   /**
//    * Fetch ONLY top-level comments for the content.
//    * Replies are fetched separately when the user clicks "View replies".
//    */
//   const fetchComments = async () => {
//     try {
//       const res = await axios.get(
//         `${BASE_URL}/comments/content/${postId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const mapped = (res.data?.content || []).map(mapComment);
//       setComments(mapped);
//     } catch (err) {
//       console.error("[COMMENTS] Failed to fetch top-level comments", err);
//     }
//   };

//   /**
//    * Load comments when content changes
//    */
//   useEffect(() => {
//     fetchComments();
//   }, [postId]);

//   /**
//    * Fetch replies for ANY comment (top-level or nested).
//    * This function walks the comment tree and attaches replies
//    * to the correct parent comment.
//    */
//   const fetchReplies = async (parentId) => {
//     try {
//       const res = await axios.get(
//         `${BASE_URL}/comments/${parentId}/replies`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const mappedReplies = (res.data?.content || []).map(mapComment);

//       /**
//        * Recursively find the parent comment and attach replies
//        */
//       const attachReplies = (list) =>
//         list.map((c) => {
//           if (c.id === parentId) {
//             return {
//               ...c,
//               replies: mappedReplies,
//               repliesLoaded: true,
//               showReplies: true,
//             };
//           }

//           if (c.replies.length > 0) {
//             return { ...c, replies: attachReplies(c.replies) };
//           }

//           return c;
//         });

//       setComments((prev) => attachReplies(prev));
//     } catch (err) {
//       console.error("[COMMENTS] Failed to fetch replies", err);
//     }
//   };

//   /**
//    * Toggle visibility of replies.
//    * If replies were never loaded, fetch them first.
//    */
//   const toggleReplies = (comment) => {
//     if (!comment.repliesLoaded) {
//       fetchReplies(comment.id);
//       return;
//     }

//     const toggle = (list) =>
//       list.map((c) => {
//         if (c.id === comment.id) {
//           return { ...c, showReplies: !c.showReplies };
//         }

//         if (c.replies.length > 0) {
//           return { ...c, replies: toggle(c.replies) };
//         }

//         return c;
//       });

//     setComments((prev) => toggle(prev));
//   };

//   /**
//    * Post a new top-level comment
//    */
//   const handleComment = async (e) => {
//     e.preventDefault();
//     if (!commentText.trim()) return;

//     try {
//       await axios.post(
//         `${BASE_URL}/comments/content/${postId}`,
//         { text: commentText },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setCommentText("");
//       fetchComments();
//     } catch (err) {
//       console.error("[COMMENTS] Failed to post comment", err);
//     }
//   };

//   /**
//    * Post a reply to ANY comment (nested replies supported)
//    */
//   const handleReply = async (parent) => {
//     if (!replyText.trim()) return;

//     try {
//       await axios.post(
//         `${BASE_URL}/comments/content/${postId}`,
//         {
//           text: replyText,
//           parentCommentId: parent.id,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setReplyText("");
//       setReplyTo(null);

//       // Reload replies for this comment only
//       fetchReplies(parent.id);
//     } catch (err) {
//       console.error("[COMMENTS] Failed to post reply", err);
//     }
//   };

//   /**
//    * ✅ DELETE COMMENT LOGIC
//    * Recursively filters out the deleted comment from state
//    */
//   const handleDelete = async (commentId) => {
//     if (!window.confirm("Are you sure you want to delete this comment?")) return;

//     try {
//       await axios.delete(`${BASE_URL}/comments/${commentId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Recursive helper to remove comment from tree
//       const removeFromTree = (list) => {
//         return list
//           .filter((c) => c.id !== commentId) // Remove if match found in current list
//           .map((c) => ({
//             ...c,
//             replies: c.replies ? removeFromTree(c.replies) : [], // Recurse down
//           }));
//       };

//       setComments((prev) => removeFromTree(prev));
//     } catch (err) {
//       console.error("[COMMENTS] Failed to delete comment", err);
//       alert("Failed to delete comment");
//     }
//   };


//   /**
//    * Convert ISO timestamp to readable date
//    */
//   const formatTime = (iso) =>
//     new Intl.DateTimeFormat("en-US", {
//       month: "short",
//       day: "numeric",
//       hour: "numeric",
//       minute: "numeric",
//     }).format(new Date(iso));

//   /**
//    * Recursive comment renderer.
//    * Calls itself for nested replies.
//    */
//   const renderComment = (c, depth = 0) => (
//     <div key={c.id} style={{ marginLeft: depth * 28 }}>
//       <div className="flex gap-3 py-4">
//         <Link to={`/profile/${c.user.username}`}>
//           {/* Avatar */}
//           {c.user.avatarUrl ? (
//             <img
//               src={c.user.avatarUrl}
//               alt="avatar"
//               className="h-10 w-10 rounded-full object-cover"
//             />
//           ) : (
//             <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
//               {c.user.username[0]?.toUpperCase()}
//             </div>
//           )}
//         </Link>

//         {/* Comment body */}
//         <div className="flex-1">
//           <div className="flex gap-2 items-center">
//             <Link to={`/profile/${c.user.username}`}><span className="font-semibold">{c.user.username}</span> </Link>
//             <span className="text-xs text-gray-500">
//               {formatTime(c.createdAt)}
//             </span>
//           </div>

//           <p className="mt-1 text-gray-800">{c.text}</p>

//           <div className="flex gap-4 mt-2 text-sm items-center">
//             <button
//               onClick={() => setReplyTo(c)}
//               className="text-brand-primary font-medium hover:underline cursor-pointer"
//             >
//               Reply
//             </button>

//             {c.replyCount > 0 && (
//               <button
//                 onClick={() => toggleReplies(c)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 {c.showReplies ? "Hide" : "View"} replies ({c.replyCount})
//               </button>
//             )}

//             {/* ✅ DELETE BUTTON (Only if owner) */}
//             {currentUserId === c.user.id && (
//               <button
//                 onClick={() => handleDelete(c.id)}
//                 className="text-red-500 hover:text-red-700 flex items-center gap-1 ml-2 opacity-60 hover:opacity-100 transition-opacity"
//                 title="Delete comment"
//               >
//                 <Trash2 size={14} />
//               </button>
//             )}
//           </div>

//           {/* Inline reply input */}
//           {replyTo?.id === c.id && (
//             <div className="mt-3 animate-in fade-in slide-in-from-top-2">
//               <input
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//                 placeholder={`Replying to @${c.user.username}...`}
//                 className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary outline-none"
//                 autoFocus
//               />
//               <div className="flex gap-2 mt-2">
//                 <button
//                   onClick={() => handleReply(c)}
//                   className="px-3 py-1 bg-brand-primary text-white rounded hover:opacity-90 transition-opacity"
//                 >
//                   Send Reply
//                 </button>
//                 <button
//                   onClick={() => setReplyTo(null)}
//                   className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Render nested replies */}
//       {c.showReplies &&
//         c.replies.map((r) => renderComment(r, depth + 1))}
//     </div>
//   );

//   /**
//    * Component output
//    */
//   return (
//     <div className="mt-10">
//       <h2 className="text-xl font-semibold mb-4 text-gray-900">Comments</h2>

//       {/* New comment input */}
//       <form onSubmit={handleComment} className="flex gap-3 mb-6">
//         <input
//           value={commentText}
//           onChange={(e) => setCommentText(e.target.value)}
//           placeholder="Write a comment..."
//           className="flex-1 p-3 border border-gray-300 rounded focus:border-brand-primary outline-none transition-colors"
//         />
//         <button
//           disabled={!commentText.trim()}
//           className="px-6 bg-brand-primary text-white font-medium rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//         >
//           Post
//         </button>
//       </form>

//       {/* Comments list */}
//       {comments.length === 0 ? (
//         <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
//       ) : (
//         comments.map((c) => renderComment(c))
//       )}
//     </div>
//   );
// };

// export default CommentsSection;