// import { useState, useRef, useEffect } from 'react';
// import { PostMoreOptionsCard } from '../../mini_components';
// import { MoreVertical } from 'lucide-react';
// import {
//     ContributorBadgeIcon, LikedHeart, CommentBubble, ShareIcon, ReadTimeIcon,
// } from '../../../assets';
// import { useNavigate } from 'react-router';
// import { useScroll } from "../../../context/ScrollContext";

// // Interaction Trails
// import { CommentButton, LikeButton, RepostButton } from './postInteractions';

// const BASE_URL = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content";

// const Post = ({ post, currentUserId }) => {

//     const [open, setOpen] = useState(false);
//     const menuRef = useRef(null);
//     const navigate = useNavigate();

//     const [showCommentPopup, setShowCommentPopup] = useState(false);

//     // Close menu when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (menuRef.current && !menuRef.current.contains(event.target)) {
//                 setOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     const { scrollY, setScrollY } = useScroll();
//     const containerRef = useRef();

//     // Restore scroll on mount
//     useEffect(() => {
//         window.scrollTo(0, scrollY);
//     }, []); // run once

//     // Save scroll on unmount
//     useEffect(() => {
//         return () => {
//             setScrollY(window.scrollY);
//         };
//     }, []);

//     return (
//         <div className="w-[clamp(19rem,90vw,42rem)] flex flex-col gap-3" ref={containerRef}>
//             {/* ---------- TOP BAR ---------- */}
//             <div className="topPart flex justify-between items-center">
//                 <div className="rightPart">
//                     <div className="userInfo flex gap-2 items-center">
//                         {post.profilePicture && (
//                             <img className="profilePicture w-12" src={post.profilePicture} alt="profile" />
//                         )}
//                         {/* ---------- made change to include author id after @ ---------- */}
//                         <div className="personName">
//     <div className='flex gap-1 items-center'>
//         <div className="displayName text-xs font-bold">{post.displayName || "Unknown"}</div>
//         {post.verifiedBadge && <img src={ContributorBadgeIcon} alt="ContributorBadgeIcon" />}
//     </div>
//     <div className="userName -mt-1.5 text-secondary">
//         {post.authorDisplay ? post.authorDisplay : `@${post.username || post.authorId}`}
//     </div>
// </div>
//                     </div>
//                 </div>

//                 <div className="leftPart flex gap-2 items-center">
//                     {!post.subscription && (
//                         <button className="subscribeButton text-sm hover:bg-gray-200 cursor-pointer rounded-full flex w-fit p-2 px-4 items-center justify-center text-link">Subscribe</button>
//                     )}
//                     <div className="postTime text-sm font-light text-secondary">{post.postDate}</div>
//                     <div className="relative" ref={menuRef}>
//                         <button onClick={() => setOpen(!open)} className="hover:bg-gray-200 cursor-pointer rounded-full flex w-fit p-2 items-center justify-center">
//                             <MoreVertical size={18} />
//                         </button>
//                         {open && <PostMoreOptionsCard />}
//                     </div>
//                 </div>
//             </div>

//             {/* ---------- POST CONTENT ---------- */}
//             <div
//                 className="postDetails flex flex-col gap-1 cursor-pointer"
//                 onClick={(e) => {
//                     // Only navigate if the click didn't happen on an action button
//                     if (!e.target.closest(".actions")) {
//                         navigate(`/post/${post.id}`, { state: { post } });
//                     }
//                 }}
//             >
//                 {/* ---------- POST THUMBNAIL ---------- */}
//                 {post.thumbnail && (
//                     <div className="h-[clamp(12rem,40vw,24rem)] overflow-hidden rounded-2xl">
//                         <img
//                             src={post.thumbnail}
//                             alt="thumbnail"
//                             className="w-full h-full object-cover"
//                         />
//                     </div>
//                 )}

//                 {/* ---------- META INFO ---------- */}
//                 <div className="metaOne flex justify-between items-center text-secondary">
//                     <div className="subject uppercase font-bold text-category1 text-xs">
//                         {post.subject}
//                     </div>
//                     <div className="readTime text-xs flex gap-1 items-center">
//                         <img src={ReadTimeIcon} alt="ReadTimeIcon" /> {post.readTime} read
//                     </div>
//                 </div>

//                 <div className="metaTwo">
//                     <div className="title text-[clamp(0.875rem,0.842rem+0.175vw,1rem)] font-bold">
//                         {post.title}
//                     </div>
//                     <div className="description text-xs line-clamp-2 lg:line-clamp-3">
//                         {post.description}
//                     </div>
//                 </div>

//                 {/* ---------- ACTION BUTTONS ---------- */}
//                 <div className="actions metaThree flex gap-4 items-center text-sm select-none">
//                     {/* Like Button */}
//                     <LikeButton
//                         BASE_URL={BASE_URL}
//                         post={post}
//                         currentUserId={currentUserId}
//                     />

//                     {/* Comment Button */}
//                     <CommentButton
//                         BASE_URL={BASE_URL}
//                         post={post}
//                         currentUserId={currentUserId}
//                     />

//                     {/* Repost Button */}
//                     <RepostButton
//                         BASE_URL={BASE_URL}
//                         post={post}
//                         currentUserId={currentUserId}
//                     />

//                     {/* Share Button */}
//                     <div
//                         className="shareCount cursor-pointer flex items-center gap-1"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <img src={ShareIcon} alt="ShareIcon" />
//                         {post.shares}
//                     </div>
//                 </div>

//                 {/* ---------- COMMENT POPUP ---------- */}
//                 {/* {showCommentPopup && (
//                     <CommentButton
//                         BASE_URL="https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content"
//                         postId={post.id}
//                         currentUserId={currentUserId}
//                         onClose={() => setShowCommentPopup(false)}
//                     />
//                 )} */}
//             </div>
//         </div>
//     );
// }

// export default Post;
//------------------------------------- Hassan's Code Below ---------------------------------------------------------------------------

// import { useState, useRef, useEffect, useMemo } from "react";
// import { PostMoreOptionsCard } from "../../mini_components";
// import { MoreVertical } from "lucide-react";
// import {
//   ContributorBadgeIcon,
//   LikedHeart,
//   CommentBubble,
//   ShareIcon,
//   ReadTimeIcon,
// } from "../../../assets";
// import { useNavigate } from "react-router";
// import { useScroll } from "../../../context/ScrollContext";
// import DOMPurify from "dompurify";
// import { PlayCircle } from "lucide-react";

// // Interaction buttons
// import { CommentButton, LikeButton, RepostButton } from "./postInteractions";

// // Base API URL
// const BASE_URL = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content";

// // --- SAFE front-end cache for author info ---
// const authorCache = {};
// const getAuthorInfo = (authorId) => {
//   if (!authorId || typeof authorId !== "string") {
//     return {
//       name: "Unknown Author",
//       picture: "https://api.dicebear.com/8.x/initials/svg?seed=unknown",
//     };
//   }
//   if (!authorCache[authorId]) {
//     const name = `${authorId.slice(0, 18)}`;
//     const picture = `https://api.dicebear.com/8.x/initials/svg?seed=${authorId}`;
//     authorCache[authorId] = { name, picture };
//   }
//   return authorCache[authorId];
// };

// /**
//  * Helper: Extract first image or YouTube thumbnail from HTML string
//  */
// const extractMediaFromHtml = (html) => {
//   if (!html) return null;
//   const doc = new DOMParser().parseFromString(html, "text/html");

//   // 1. Try to find the first <img>
//   const img = doc.querySelector("img");
//   if (img) return { type: "image", src: img.src };

//   // 2. Try to find a YouTube iframe
//   const iframe = doc.querySelector("iframe");
//   if (iframe && iframe.src.includes("youtube")) {
//     const match = iframe.src.match(/\/embed\/([^/?]+)/);
//     if (match && match[1]) {
//       return {
//         type: "video",
//         src: `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`,
//       };
//     }
//   }

//   return null;
// };

// /**
//  * Post component
//  * @param {Object} post - Post object
//  * @param {String} currentUserId - Logged-in user ID
//  * @param {Function} onCommentAdded - Callback for comment added
//  */

// const Post = ({ post, currentUserId, onCommentAdded }) => {
//   const [open, setOpen] = useState(false);
//   const menuRef = useRef(null);
//   const navigate = useNavigate();
//   const { scrollY, setScrollY } = useScroll();
//   const containerRef = useRef();

//   // Close menu if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Restore scroll on mount
//   useEffect(() => {
//     window.scrollTo(0, scrollY);
//   }, []);

//   // Save scroll on unmount
//   useEffect(() => {
//     return () => setScrollY(window.scrollY);
//   }, []);

//   // Author info (now always safe)
//   const { name: userName, picture: userPic } = getAuthorInfo(
//     post.author.handle
//   );

//   // --- Media Logic ---
//   const mediaContent = useMemo(() => {
//     if (post.thumbnail) return { type: "image", src: post.thumbnail };
//     return extractMediaFromHtml(post.body || post.description);
//   }, [post.thumbnail, post.body, post.description]);

//   return (
//     <div
//       className="w-full max-w-2xl mx-auto border-b border-gray-100 py-8 px-4 md:px-0"
//       ref={containerRef}
//     >
//       {/* ---------- TOP HEADER (Author) ---------- */}
//       <div className="topPart flex justify-between items-center">
//         <div className="rightPart">
//           {/* Author Info */}
//           <div className="flex items-center gap-3 mb-2">
//             {userPic && (
//               <img
//                 className="w-10 h-10 rounded-full object-cover"
//                 src={userPic}
//                 alt="author"
//               />
//             )}
//             <div>
//               <p className="text-sm font-semibold text-primary">{userName}</p>
//               <p className="text-xs text-tertiary">
//                 {new Date(post.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Right Actions */}
//         <div className="leftPart flex gap-2 items-center">
//           {post.author.id !== currentUserId && !post.subscription && (
//             <button className="subscribeButton text-sm rounded-full flex w-fit p-2 px-4 items-center justify-center text-link hover:bg-gray-200 active:bg-gray-300 transition-colors select-none">
//               Subscribe
//             </button>
//           )}

//           <div className="postTime text-sm font-light text-secondary">
//             {post.postDate}
//           </div>

//           <div className="relative" ref={menuRef}>
//             <button
//               onClick={() => setOpen(!open)}
//               className="hover:bg-gray-200 cursor-pointer rounded-full flex w-fit p-2 items-center justify-center"
//             >
//               <MoreVertical size={18} />
//             </button>
//             {open && <PostMoreOptionsCard />}
//           </div>
//         </div>
//       </div>

//       {/* ---------- MAIN CONTENT (Vertical Layout) ---------- */}
//       <div
//         className="group cursor-pointer flex flex-col gap-3"
//         onClick={(e) => {
//           if (!e.target.closest(".actions-bar")) {
//             navigate(`/post/${post.id}`, { state: { post } });
//           }
//         }}
//       >
//         {/* 1. TEXT CONTENT (Top) */}
//         <div className="flex flex-col gap-1">
//           <h2 className="text-xl font-bold text-gray-900 leading-tight">
//             {post.title}
//           </h2>

//           {/* Render Rich Text Preview with CSS overrides for H1 sizes */}
//           <div
//             className="text-md text-gray-600 font-serif leading-relaxed line-clamp-3 
//                         prose max-w-none 
//                         prose-p:my-0 prose-headings:my-0 
//                         [&_h1]:text-base [&_h1]:font-bold [&_h1]:m-0
//                         [&_h2]:text-sm [&_h2]:font-bold [&_h2]:m-0
//                         [&_h3]:text-sm [&_h3]:font-bold [&_h3]:m-0
//                         [&_img]:hidden [&_iframe]:hidden [&_video]:hidden"
//             dangerouslySetInnerHTML={{
//               __html: DOMPurify.sanitize(post.description || post.body),
//             }}
//           />
//         </div>

//         {/* 2. MEDIA CONTENT (Bottom) */}
//         {mediaContent && (
//           <div className="mt-2 w-full max-h-[500px] bg-gray-50 rounded-lg overflow-hidden border border-gray-100 relative flex justify-center items-center">
//             <img
//               src={mediaContent.src}
//               alt="Post content"
//               className="w-full h-full object-cover max-h-[500px]"
//             />

//             {/* Video Overlay */}
//             {mediaContent.type === "video" && (
//               <div className="absolute inset-0 flex items-center justify-center bg-black/20">
//                 <PlayCircle className="text-white fill-black/50" size={48} />
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ---------- BOTTOM BAR: Actions ---------- */}
//       <div className="actions-bar flex items-center justify-between mt-4 pt-2">
//         <div className="flex items-center gap-6">
//           <LikeButton
//             BASE_URL={BASE_URL}
//             post={post}
//             currentUserId={currentUserId}
//           />

//           <CommentButton
//             BASE_URL={BASE_URL}
//             post={post}
//             currentUserId={currentUserId}
//             onCommentAdded={() => {
//               if (typeof onCommentAdded === "function") onCommentAdded();
//             }}
//           />

//           <RepostButton
//             BASE_URL={BASE_URL}
//             post={post}
//             currentUserId={currentUserId}
//           />

//           <button className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
//             <img src={ShareIcon} alt="Share" className="w-4 h-4 opacity-60" />
//           </button>
//         </div>

//         <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
//           {post.readTime || "3 min"} read
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Post;
import SubscribeButton from "./postInteractions/SubscribeButton";
import { useState, useRef, useEffect, useMemo } from "react";
import { PostMoreOptionsCard } from "../../mini_components";
import { MoreVertical, PlayCircle } from "lucide-react";
import { ShareIcon } from "../../../assets";
import { Link, useNavigate } from "react-router";
import { useScroll } from "../../../context/ScrollContext";
import DOMPurify from "dompurify";
import { createSlug } from "../../../utils/linkFormat"

// Interaction buttons
import { CommentButton, LikeButton, RepostButton, BookmarkButton, ShareButton } from "./postInteractions";

// Base API URL
const BASE_URL =
  "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content";

/**
 * 1. NEW HELPER: Calculate Reading Time
 * Logic: Strip HTML tags -> Count words -> Divide by 200 (Avg reading speed)
 */
const getReadingTime = (htmlContent) => {
  if (!htmlContent) return "1 min";

  // Strip HTML tags using regex (fast and sufficient for counting)
  const text = htmlContent.replace(/<[^>]*>?/gm, '');
  
  // Split by spaces to get word count
  const wordCount = text.trim().split(/\s+/).length;
  
  // Calculate minutes (rounding up)
  const minutes = Math.ceil(wordCount / 200);
  
  return `${minutes} min`;
};

/**
 * Helper: Extract first image or YouTube thumbnail from HTML string
 */
const extractMediaFromHtml = (html) => {
  if (!html) return null;

  const doc = new DOMParser().parseFromString(html, "text/html");

  const img = doc.querySelector("img");
  if (img) return { type: "image", src: img.src };

  const iframe = doc.querySelector("iframe");
  if (iframe && iframe.src.includes("youtube")) {
    const match = iframe.src.match(/\/embed\/([^/?]+)/);
    if (match?.[1]) {
      return {
        type: "video",
        src: `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`,
      };
    }
  }

  return null;
};

const Post = ({ post, currentUserId, onCommentAdded }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { scrollY, setScrollY } = useScroll();
  const containerRef = useRef();

  // --------------------------------------------------
  // Close menu on outside click
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Restore scroll
  useEffect(() => {
    window.scrollTo(0, scrollY);
  }, []);

  // Save scroll
  useEffect(() => {
    return () => setScrollY(window.scrollY);
  }, []);

  // --------------------------------------------------
  // Author (REAL backend data)
  // --------------------------------------------------
  const authorName =
    post.author?.displayName ||
    post.author?.handle ||
    "Unknown Author";

  const validAuthorId = post.authorId || post.author?.id;
  const validHandle = post.authorHandle || post.author?.handle || post.author?.username;

  const profileUrl = validHandle
    ? `/profile/${validHandle}`
    : `/u/${validAuthorId}`;


  const authorPic =
    post.author?.avatarUrl ||
    "https://api.dicebear.com/8.x/initials/svg?seed=unknown";

  // --------------------------------------------------
  // Media & Reading Time
  // --------------------------------------------------
  const mediaContent = useMemo(() => {
    if (post.thumbnail) {
      return { type: "image", src: post.thumbnail };
    }
    return extractMediaFromHtml(post.body || post.description);
  }, [post.thumbnail, post.body, post.description]);

  // 2. USE THE CALCULATION
  const readingTime = useMemo(() => {
    // We prefer post.body (full content) if available, otherwise description
    return getReadingTime(post.body || post.description);
  }, [post.body, post.description]);


  // ==================================================
  // Render
  // ==================================================
  const isOwnPost = post.author?.id === currentUserId;

  return (
    <div
      ref={containerRef}
      className="w-full max-w-2xl mx-auto py-4 px-4 md:px-0"
    >
      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <img
              src={authorPic} 
              alt="author"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-primary">
                <Link to={profileUrl} className="hover:underline">
                  {authorName}
                </Link>
              </p>
              <p className="text-xs text-tertiary">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              className="hover:bg-gray-200 rounded-full p-2"
            >
              <MoreVertical size={18} />
            </button>
            {open && <PostMoreOptionsCard />}
          </div>
        </div>
      </div>

      {/* ---------- CONTENT ---------- */}
      <Link to={`/post/${createSlug(post.title)}-${post.id}`}>
        <div className="group cursor-pointer flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h2>

            <div
              className="text-md text-gray-600 font-serif leading-relaxed line-clamp-3
                        prose max-w-none
                        prose-p:my-0 prose-headings:my-0
                        [&_img]:hidden [&_iframe]:hidden"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.description || post.body),
              }}
            />
          </div>

          {mediaContent && (
            <div className="mt-2 w-full max-h-[500px] bg-gray-50 rounded-lg overflow-hidden border relative">
              <img
                src={mediaContent.src}
                alt="media"
                className="w-full h-full object-cover"
              />

              {mediaContent.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <PlayCircle size={48} className="text-white" />
                </div>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* ---------- ACTIONS ---------- */}
      <div className="actions-bar flex items-center justify-between mt-4 pt-2">
        <div className="flex items-center gap-6">
          <LikeButton
            BASE_URL={BASE_URL}
            post={post}
            currentUserId={currentUserId}
          />

          <CommentButton
            BASE_URL={BASE_URL}
            post={post}
            currentUserId={currentUserId}
            onCommentAdded={onCommentAdded}
          />

          <BookmarkButton
            BASE_URL={BASE_URL}
            post={post}
            currentUserId={currentUserId}
          />

          <ShareButton post={post} />
        </div>

        {/* 3. DISPLAY THE CALCULATED TIME */}
        <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
          {readingTime} read
        </div>
      </div>
    </div>
  );
};

export default Post;