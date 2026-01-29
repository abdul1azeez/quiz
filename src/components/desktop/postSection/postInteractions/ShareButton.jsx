import { useState, useEffect, useRef } from "react";
import { Share2, Link as LinkIcon, Check, X } from "lucide-react";
import { FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa"; // Make sure to install react-icons if needed
import { ShareIcon } from "../../../../assets";

const ShareButton = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  // Construct the shareable URL
  // const shareUrl = `${window.location.origin}/post/${post.id}`;
  // const shareData = {
  //   title: post.title,
  //   text: `Check out this post: ${post.title}`,
  //   url: shareUrl,
  // };

const shareUrl = post?.id 
    ? `${window.location.origin}/post/${post.id}` 
    : window.location.href;

  const shareData = {
    title: post?.title || "Check this out",
    text: `Read this post: ${post?.title || ""}`,
    url: shareUrl,
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = async () => {
    // 1. Try Native Share (Mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log("Share canceled or failed", err);
      }
    }
    // 2. Fallback to Dropdown (Desktop)
    setIsOpen(!isOpen);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  // Helper for social links
  const socialShare = (platform) => {
    let url = "";
    const text = encodeURIComponent(shareData.text);
    const link = encodeURIComponent(shareUrl);

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${text}&url=${link}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${link}`;
        break;
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${text} ${link}`;
        break;
      default:
        return;
    }
    window.open(url, "_blank", "width=600,height=400");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>

      {/* TRIGGER BUTTON */}
<button
  onClick={handleShare}
  className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
  title="Share"
>
  <img src={ShareIcon} alt="share" className="w-6 h-6" />
</button>

      {/* DROPDOWN MENU (Desktop Fallback) */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">

          <div className="flex justify-between items-center px-3 py-2 border-b border-gray-100 mb-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Share to</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {/* Copy Link */}
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <div className={`p-1.5 rounded-full ${copied ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                {copied ? <Check size={14} /> : <LinkIcon size={14} />}
              </div>
              <span className={copied ? "text-green-600 font-medium" : ""}>
                {copied ? "Copied!" : "Copy link"}
              </span>
            </button>

            {/* Twitter / X */}
            <button
              onClick={() => socialShare("twitter")}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <div className="p-1.5 rounded-full bg-black text-white">
                <FaTwitter size={14} />
              </div>
              <span>Post to X</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => socialShare("linkedin")}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <div className="p-1.5 rounded-full bg-[#0077B5] text-white">
                <FaLinkedin size={14} />
              </div>
              <span>LinkedIn</span>
            </button>

             {/* WhatsApp */}
             <button
              onClick={() => socialShare("whatsapp")}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <div className="p-1.5 rounded-full bg-[#25D366] text-white">
                <FaWhatsapp size={14} />
              </div>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;

// import { useState, useEffect, useRef } from "react";
// import { Share2, Link as LinkIcon, Check, X } from "lucide-react";
// import { ShareIcon } from "../../../../assets"
// import { FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";

// const ShareButton = ({ post, children }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const menuRef = useRef(null);

//   // 1. SAFETY: Handle case where post is not loaded yet
//   // If post is missing, we default to current window URL or empty string to prevent crashes
//   const shareUrl = post?.id
//     ? `${window.location.origin}/post/${post.id}`
//     : window.location.href;

//   const shareData = {
//     title: post?.title || "Check this out",
//     text: `Read this post: ${post?.title || ""}`,
//     url: shareUrl,
//   };

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleShare = async () => {
//     if (!post) return; // Don't do anything if data isn't ready

//     // 2. MOBILE: Try Native Share Sheet
//     if (navigator.share) {
//       try {
//         await navigator.share(shareData);
//         return;
//       } catch (err) {
//         console.log("Share canceled");
//       }
//     }
//     // 3. DESKTOP: Toggle Dropdown
//     setIsOpen(!isOpen);
//   };

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(shareUrl);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error("Failed to copy", err);
//     }
//   };

//   const socialShare = (platform) => {
//     const text = encodeURIComponent(shareData.text);
//     const link = encodeURIComponent(shareUrl);
//     let url = "";

//     switch (platform) {
//       case "twitter": url = `https://twitter.com/intent/tweet?text=${text}&url=${link}`; break;
//       case "linkedin": url = `https://www.linkedin.com/sharing/share-offsite/?url=${link}`; break;
//       case "whatsapp": url = `https://api.whatsapp.com/send?text=${text} ${link}`; break;
//       default: return;
//     }
//     window.open(url, "_blank", "width=600,height=400");
//     setIsOpen(false);
//   };

//   return (
//     <div className="relative inline-block" ref={menuRef}>

//       {/* TRIGGER BUTTON */}
//       <button
//         onClick={handleShare}
//         // disabled={!post} // Disable interactions while loading
//         className={`cursor-pointer hover:bg-gray-200 p-2 rounded-full transition-colors flex items-center justify-center ${!post ? "opacity-50" : ""}`}
//         title="Share"
//       >
//         {/* 4. RENDER LOGIC: Use Custom Icon (children) if provided, else Default */}
//         {children ? (
//           children
//         ) : (
//           <img src={ShareIcon} alt="share" className="w-6 h-6" />
//         )}
//       </button>

//       {/* DROPDOWN MENU (Desktop Fallback) */}
//       {isOpen && (
//         <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">

//           <div className="flex justify-between items-center px-3 py-2 border-b border-gray-100 mb-1">
//             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Share to</span>
//             <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
//           </div>

//           <div className="flex flex-col gap-1">
//             <button onClick={copyToClipboard} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
//               <div className={`p-1.5 rounded-full ${copied ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
//                 {copied ? <Check size={14} /> : <LinkIcon size={14} />}
//               </div>
//               <span className={copied ? "text-green-600 font-medium" : ""}>{copied ? "Copied!" : "Copy link"}</span>
//             </button>

//             <button onClick={() => socialShare("twitter")} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg text-left">
//               <div className="p-1.5 rounded-full bg-black text-white"><FaTwitter size={14} /></div><span>Post to X</span>
//             </button>
//             <button onClick={() => socialShare("linkedin")} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg text-left">
//               <div className="p-1.5 rounded-full bg-[#0077B5] text-white"><FaLinkedin size={14} /></div><span>LinkedIn</span>
//             </button>
//             <button onClick={() => socialShare("whatsapp")} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg text-left">
//               <div className="p-1.5 rounded-full bg-[#25D366] text-white"><FaWhatsapp size={14} /></div><span>WhatsApp</span>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShareButton;