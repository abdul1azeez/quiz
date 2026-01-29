import { ArrowRight, SearchX, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createSlug } from "../../../utils/linkFormat";


// Reusable List Item for Bookmarks & Likes
export const ArticleCard = ({ item, index }) => (
  <Link 
    to={`/post/${createSlug(item.title)}-${item.id}`} // ✅ Added Link wrapper here
    className="block mx-2" // Ensures the link behaves like a block element
  >
    <div 
      className="p-5 rounded-2xl flex items-center justify-between group hover:bg-[#FDFDFD] hover:shadow-sm border border-transparent hover:border-gray-100 transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-col gap-1.5 pr-4">
        <span className="text-[10px] font-bold tracking-widest text-[#04644C] uppercase bg-[#04644C]/5 px-2 py-0.5 rounded-md w-fit">
          {item.category}
        </span>
        <h3 className="font-bold text-lg text-[#000A07] group-hover:text-[#04644C] transition-colors duration-300 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-xs text-[#5C6261] flex items-center gap-2">
          {/* If you have an author avatar URL, use an <img> here instead of the span */}
          {item.showAvatar && item.avatar && (
  <img
    src={item.avatar}
    alt={item.author}
    className="w-5 h-5 rounded-full object-cover"
  />
)}
          <span className="text-black font-medium">{item.author}</span> 
          <span className="opacity-50">• {item.date}</span>
        </p>
      </div>
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#04644C] group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1 shadow-sm">
        <ArrowRight size={18} />
      </div>
    </div>
  </Link>
);

// Reusable Empty State (Unchanged)
export const EmptyState = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-500">
    <div className="bg-gray-50 p-6 rounded-full mb-6 relative">
      <SearchX size={40} className="text-gray-300" />
      <Sparkles size={20} className="text-[#04644C] absolute top-2 right-2 animate-bounce" />
    </div>
    <h3 className="text-lg font-bold text-[#000A07] mb-2">It's quiet here...</h3>
    <p className="text-[#5C6261] font-medium mb-6">
      You haven't {label === 'subscriptions' ? 'followed anyone' : `added any ${label}`} yet.
    </p>
    <Link to="/">
      <button className="px-6 py-2.5 bg-[#000A07] text-white text-sm font-bold rounded-full hover:bg-[#323E3A] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
        Start Exploring
      </button>
    </Link>
  </div>
);