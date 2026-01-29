// import { useState } from "react";
// import axios from "axios";
// import { CommentBubble } from "../../../../assets";

// const CommentButton = ({ BASE_URL, post, currentUserId }) => {
//     const [commentText, setCommentText] = useState("");
//     const [comments, setComments] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showCommentPopup, setShowCommentPopup] = useState(false);

//     // 🧠 Handle comment submission
//     const handleComment = async (e) => {
//         e.preventDefault();
//         if (!commentText.trim()) return;

//         const newComment = {
//             id: Date.now(),
//             text: commentText,
//             userId: currentUserId,
//             pending: true,
//         };

//         // Optimistically add comment immediately
//         setComments((prev) => [newComment, ...prev]);
//         setLoading(true);

//         try {
//             await axios.post(`${BASE_URL}/${post.id}/comment`, null, {
//                 params: {
//                     userId: currentUserId,
//                     text: commentText,
//                 },
//             });
//         } catch (error) {
//             console.error("Error posting comment:", error);
//             // Rollback on error
//             setComments((prev) => prev.filter((c) => c.id !== newComment.id));
//         } finally {
//             setLoading(false);
//             setCommentText("");
//         }
//     };

//     return (
//         <>
//             {/* 🗨️ Comment button that opens popup */}
//             <div
//                 className="commentCount cursor-pointer flex items-center gap-1"
//                 onClick={(e) => {
//                     e.stopPropagation();
//                     setShowCommentPopup(true);
//                 }}
//             >
//                 <img src={CommentBubble} alt="CommentBubble" />
//                 {post.comments}
//             </div>

//             {/* 💬 Popup with blurred background */}
//             {showCommentPopup && (
//                 <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex justify-center items-center transition-all duration-300">
//                     {/* Popup container */}
//                     <div className="bg-white rounded-2xl w-[clamp(20rem,90vw,36rem)] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">

//                         {/* 🔹 Post Preview Section */}
//                         <div className="relative border-b">
//                             {post.thumbnail && (
//                                 <img
//                                     src={post.thumbnail}
//                                     alt="thumbnail"
//                                     className="w-full h-40 object-cover rounded-t-2xl"
//                                 />
//                             )}
//                             <div className="absolute inset-0 bg-black/30 rounded-t-2xl" />
//                             <div className="absolute bottom-2 left-4 text-white">
//                                 <h3 className="font-semibold text-lg line-clamp-1">{post.title}</h3>
//                                 <p className="text-xs opacity-80 line-clamp-2">
//                                     {post.description}
//                                 </p>
//                             </div>
//                             <button
//                                 onClick={() => setShowCommentPopup(false)}
//                                 className="absolute top-3 right-4 text-white text-xl font-bold hover:text-gray-200"
//                             >
//                                 ✕
//                             </button>
//                         </div>

//                         {/* 💭 Comments List */}
//                         <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
//                             {comments.length === 0 ? (
//                                 <p className="text-sm text-gray-500 text-center">
//                                     No comments yet. Be the first!
//                                 </p>
//                             ) : (
//                                 comments.map((comment) => (
//                                     <div
//                                         key={comment.id}
//                                         className={`border p-2 rounded-lg text-sm ${comment.pending ? "opacity-50 italic" : ""
//                                             }`}
//                                     >
//                                         {comment.text}
//                                     </div>
//                                 ))
//                             )}
//                         </div>

//                         {/* ✏️ Input Section */}
//                         <form
//                             onSubmit={handleComment}
//                             className="border-t flex items-center gap-2 p-4 bg-gray-50"
//                         >
//                             <input
//                                 type="text"
//                                 value={commentText}
//                                 onChange={(e) => setCommentText(e.target.value)}
//                                 placeholder="Write a comment..."
//                                 className="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
//                             />
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="bg-button-primary text-white rounded-lg px-4 py-2 hover:opacity-90 disabled:opacity-50"
//                             >
//                                 {loading ? "..." : "Send"}
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default CommentButton;

// ------------------------------------- Hassan's Code Below ---------------------------------------------------------------------------

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { CommentBubble } from "../../../../assets";
// import { useAuth } from "react-oidc-context";

// /**
//  * CommentButton Component
//  *
//  * Props:
//  * - post: object => Post object containing id, title, commentCount, etc.
//  * - onCommentAdded: function => Callback to update parent post comment count
// */
// const CommentButton = ({ post, onCommentAdded }) => {
//   const auth = useAuth();

//   // ✔ Your correct backend root:
//   const BASE_URL = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content";

//   // 🔐 Determine if user is logged in
//   const currentUserId = localStorage.getItem("userId");
//   const token = auth.user?.id_token;
//   // ✔ Check if user is logged in
//   const isLoggedIn = auth.isAuthenticated && auth.user?.profile?.sub;

//   // --- LOCAL STATE ---
//   const [commentText, setCommentText] = useState("");
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showCommentPopup, setShowCommentPopup] = useState(false);

//   // 📝 Fetch comments when popup opens
//   useEffect(() => {
//     if (!showCommentPopup || !isLoggedIn) return;

//     const fetchComments = async () => {
//   try {
//     const res = await axios.get(`${BASE_URL}/${post.id}/comments`);

//     setComments(
//       Array.isArray(res.data?.content) ? res.data.content : []
//     );
//   } catch (err) {
//     console.error("Error fetching comments:", err);
//     setComments([]);
//   }
// };

//     fetchComments();
//   }, [showCommentPopup, isLoggedIn, post.id]);

//   // ✏️ Submit new comment
//   const handleComment = async (e) => {
//     e.preventDefault();
//     if (!commentText.trim()) return;

//     const newComment = {
//       id: Date.now(),
//       text: commentText,
//       userId: currentUserId,
//       pending: true,
//     };

//     setComments((prev) => [newComment, ...prev]);
//     setLoading(true);

//     try {
//       const res = await axios.post(`${BASE_URL}/${post.id}/comment`, null, {
//         params: { userId: currentUserId, text: commentText },
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },

//       });

//       setComments((prev) =>
//         prev.map((c) => (c.id === newComment.id ? res.data : c))
//       );

//       onCommentAdded?.();

//     } catch (err) {
//       console.error("Error posting comment:", err);
//       setComments((prev) => prev.filter((c) => c.id !== newComment.id));
//     } finally {
//       setLoading(false);
//       setCommentText("");
//     }
//   };

//   return (
//     <>
//       {/* Comment Count Button */}
//       <div
//         className="commentCount cursor-pointer flex items-center gap-1"
//         onClick={(e) => {
//           e.stopPropagation();
//           if (!isLoggedIn) return auth.signinRedirect();
//           setShowCommentPopup(true);
//         }}
//       >
//         <img src={CommentBubble} alt="CommentBubble" />
//         {post.commentCount || 0}
//       </div>

//       {/* Popup */}
//       {showCommentPopup && (
//         <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex justify-center items-center">
//           <div className="bg-white rounded-2xl w-[clamp(20rem,90vw,36rem)] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">

//             <div className="flex items-center justify-between p-4 border-b">
//               <button
//                 onClick={() => setShowCommentPopup(false)}
//                 className="text-blue-600 font-semibold"
//               >
//                 ← Go Back
//               </button>
//               <h3 className="font-semibold text-lg truncate">{post.title}</h3>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
//               {comments.length === 0 ? (
//                 <p className="text-sm text-gray-500 text-center">
//                   No comments yet. Be the first!
//                 </p>
//               ) : (
//                 comments.map((comment) => (
//                   <div
//                     key={comment.id}
//                     className={`border p-2 rounded-lg text-sm ${
//                       comment.pending ? "opacity-50 italic" : ""
//                     }`}
//                   >
//                     {comment.text}
//                   </div>
//                 ))
//               )}
//             </div>

//             <form
//               onSubmit={handleComment}
//               className="border-t flex items-center gap-2 p-4 bg-gray-50"
//             >
//               <input
//                 type="text"
//                 value={commentText}
//                 onChange={(e) => setCommentText(e.target.value)}
//                 placeholder="Write a comment..."
//                 className="flex-1 border rounded-lg p-2 text-sm"
//               />
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-button-primary text-white rounded-lg px-4 py-2 disabled:opacity-50"
//               >
//                 {loading ? "..." : "Send"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CommentButton;

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { CommentBubble } from "../../../../assets";
// import { useAuth } from "react-oidc-context";
// import { useOutletContext } from "react-router-dom";
// const CommentButton = ({ post, BASE_URL, currentUserId, onCommentAdded }) => {
//   const auth = useAuth();
//   const { openSignIn } = useOutletContext();
//   const token = auth.user?.id_token;
//   const isLoggedIn = auth.isAuthenticated && auth.user?.profile?.sub;

//   const [showPopup, setShowPopup] = useState(false);
//   const [commentText, setCommentText] = useState("");
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ⭐ Fetch only MY COMMENTS
//   useEffect(() => {
//     if (!showPopup || !isLoggedIn) return;

//     const fetchMyComments = async () => {
//       try {
//         const res = await axios.get(
//           `${BASE_URL}/${post.id}/comments?userId=${currentUserId}`
//         );

//         const all = Array.isArray(res.data?.content) ? res.data.content : [];

//         // Keep only comments where the user.id matches me
//         const mine = all.filter((c) => c.user?.id === currentUserId);

//         setComments(mine);
//       } catch (err) {
//         console.error("Error loading user comments:", err);
//       }
//     };

//     fetchMyComments();
//   }, [showPopup, post.id, currentUserId, isLoggedIn]);

//   // ⭐ Submit comment
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!commentText.trim()) return;

//     const optimistic = {
//       id: Date.now(),
//       text: commentText,
//       user: {
//         id: currentUserId,
//         username: auth.user?.profile?.name || "You",
//         email: auth.user?.profile?.email,
//       },
//       createdAt: new Date().toISOString(),
//       pending: true,
//     };

//     setComments((prev) => [optimistic, ...prev]);
//     setCommentText("");
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         `${BASE_URL}/${post.id}/comment`,
//         null,
//         {
//           params: { userId: currentUserId, text: commentText },
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setComments((prev) =>
//         prev.map((c) => (c.id === optimistic.id ? res.data : c))
//       );

//       onCommentAdded?.();
//     } catch (err) {
//       console.error("Error posting comment:", err);
//       setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* BUTTON */}
//       <div
//         className="commentCount cursor-pointer flex items-center gap-1"
//         onClick={(e) => {
//           e.stopPropagation();
//           if (!isLoggedIn) return openSignIn();
//           setShowPopup(true);
//         }}
//       >
//         <img src={CommentBubble} alt="CommentBubble" />
//         {post.commentCount || 0}
//       </div>

//       {/* POPUP */}
//       {showPopup && (
//         <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center backdrop-blur-sm">
//           <div className="bg-white w-[clamp(22rem,90vw,40rem)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

//             {/* HEADER */}
//             <div className="p-4 border-b flex items-center justify-between">
//               <button
//                 onClick={() => setShowPopup(false)}
//                 className="text-blue-600 font-semibold"
//               >
//                 ← Back
//               </button>
//               <div className="font-semibold">Your Comment</div>
//             </div>

//             {/* MINI POST */}
//             <div className="p-4 border-b bg-gray-50">
//               <h3 className="font-bold text-lg">{post.title}</h3>
//               <p className="text-sm text-gray-600 mt-1 line-clamp-3">
//                 {post.description || post.body}
//               </p>
//             </div>

//             {/* COMMENTS LIST */}
//             <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
//               {comments.length === 0 ? (
//                 <p className="text-gray-500 text-sm text-center mt-4">
//                   You have not commented yet.
//                 </p>
//               ) : (
//                 comments.map((c) => (
//                   <div
//                     key={c.id}
//                     className={`p-3 border rounded-lg ${
//                       c.pending ? "opacity-60 italic" : ""
//                     }`}
//                   >
//                     {c.text}
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* INPUT */}
//             <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50 flex gap-2">
//               <input
//                 value={commentText}
//                 onChange={(e) => setCommentText(e.target.value)}
//                 placeholder="Write a comment..."
//                 className="flex-1 border rounded-lg p-2 text-sm"
//               />

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//               >
//                 {loading ? "…" : "Send"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CommentButton;

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "react-oidc-context";
import { useOutletContext, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { X, Send, MessageCircle, ExternalLink } from "lucide-react";

const CommentButton = ({ post, BASE_URL, currentUserId, onCommentAdded }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { openSignIn } = useOutletContext();
  const token = auth.user?.id_token;
  const isLoggedIn = auth.isAuthenticated && auth.user?.profile?.sub;

  const [showPopup, setShowPopup] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/${post.id}/comment`, null, {
        params: { userId: currentUserId, text: commentText },
        headers: { Authorization: `Bearer ${token}` },
      });

      setCommentText("");
      setShowPopup(false);
      onCommentAdded?.();
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFullPost = () => {
    setShowPopup(false);
    navigate(`/post/${post.id}`, { state: { post } });
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button
        className="group flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          if (!isLoggedIn) return openSignIn();
          setShowPopup(true);
        }}
      >
        <MessageCircle size={20} className="group-hover:stroke-gray-900" />
        <span className="text-sm">{post.commentCount || 0}</span>
      </button>

      {/* POPUP MODAL */}
      {showPopup && (
        <div className="fixed inset-0 z-100 flex justify-center items-end sm:items-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowPopup(false)}
          />

          {/* Modal Card */}
          <div className="relative bg-white w-full sm:w-[600px] h-[90vh] sm:h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 text-sm">
                  Post Reply
                </span>
                <span className="text-xs text-gray-500">
                  Replying to {post.authorName || "Author"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Open Full Post Button */}
                <button
                  onClick={handleOpenFullPost}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700 rounded-full text-xs font-medium transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>Open Post</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setShowPopup(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Content (Full Post) */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
              {/* Reduced text size using prose-sm and custom prose configurations */}
              <article className="prose prose-sm max-w-none prose-headings:font-bold prose-p:text-gray-600 prose-img:rounded-xl prose-a:text-blue-600">
                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold mb-4 leading-tight text-gray-900">
                  {post.title}
                </h1>

                {/* Rich Text Body */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.body || post.description),
                  }}
                />
              </article>

              <div className="h-20" />
            </div>

            {/* Sticky Input Footer */}
            <div className="border-t border-gray-100 bg-white p-4 pb-6 sm:pb-4">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-2 py-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all shadow-sm"
              >
                {/* User Avatar Placeholder */}
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs ml-1 shrink-0">
                  {auth.user?.profile?.name?.[0] || "U"}
                </div>

                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-400 min-w-0"
                  autoFocus
                />

                <button
                  type="submit"
                  disabled={loading || !commentText.trim()}
                  className={`p-2 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    commentText.trim()
                      ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send
                      size={18}
                      className={commentText.trim() ? "ml-0.5" : ""}
                    />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentButton;
