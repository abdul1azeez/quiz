// import { MessageSquare } from "lucide-react";
// import { EmptyState } from "./ActivityHelpers";
// import { Link } from "react-router";
// import { createSlug } from "../../../utils/linkFormat";

// const CommentsView = ({ data }) => {
//   if (!data || data.length === 0) return <EmptyState label="comments" />;

//   return (
//     <div className="flex flex-col gap-2 p-2">
//       {data.map((item, idx) => (
//         <Link
//           to={`/post/${createSlug(item.postTitle)}-${item.id}`} // ✅ Added Link wrapper here
//           className="block mx-2" 
//         >
//           <div
//             key={item.id}
//             className="p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 cursor-pointer group border border-transparent hover:border-gray-100 animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards"
//             style={{ animationDelay: `${idx * 50}ms` }}
//           >
//             <div className="flex items-center gap-2 text-xs text-[#5C6261] mb-3 uppercase tracking-wide">
//               <MessageSquare size={14} className="text-[#04644C]" />
//               <span>
//                 Commented on <span className="font-bold text-black group-hover:text-[#04644C] transition-colors">{item.postTitle}</span>
//               </span>
//               <span className="opacity-50">• {item.date}</span>
//             </div>
//             <div className="pl-4 border-l-2 border-[#04644C]/10 group-hover:border-[#04644C] transition-all duration-300">
//               <p className="text-[#323E3A] italic text-base leading-relaxed">"{item.comment}"</p>
//             </div>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default CommentsView;



import { MessageSquare } from "lucide-react";
import { EmptyState } from "./ActivityHelpers";
import { Link } from "react-router-dom"; // Standard import
import { createSlug } from "../../../utils/linkFormat";

const CommentsView = ({ data }) => {
  if (!data || data.length === 0) return <EmptyState label="comments" />;

  return (
    <div className="flex flex-col gap-2 p-2">
      {data.map((item, idx) => (
        <Link
          // ✅ FIX 1: Key must be on the outermost element
          key={item.id} 
          to={`/post/${createSlug(item.postTitle || "untitled")}-${item.postId || item.id}`} 
          
          className="block mx-2"
        >
          <div
            className="p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 cursor-pointer group border border-transparent hover:border-gray-100 animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-center gap-2 text-xs text-[#5C6261] mb-3 uppercase tracking-wide">
              <MessageSquare size={14} className="text-[#04644C]" />
              <span>
                Commented on <span className="font-bold text-black group-hover:text-[#04644C] transition-colors">{item.postTitle || "Unknown Post"}</span>
              </span>
              <span className="opacity-50">• {item.date}</span>
            </div>
            <div className="pl-4 border-l-2 border-[#04644C]/10 group-hover:border-[#04644C] transition-all duration-300">
              <p className="text-[#323E3A] italic text-base leading-relaxed">"{item.comment}"</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CommentsView;