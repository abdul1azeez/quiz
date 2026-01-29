import { Sparkles } from "lucide-react";

const QuizButton = () => {
  return (
    <div className="relative group hidden lg:block">
      {/* BUTTON */}
      <button 
        className="flex items-center gap-2 px-4 py-2 bg-surface-banner text-[#323E3A] font-bold text-sm rounded-full shadow-sm border border-transparent hover:border-[#ffe8c2] hover:shadow-md transition-all duration-200 cursor-not-allowed opacity-90"
      >
        <Sparkles size={16} className="text-category1 group-hover:rotate-12 transition-transform" />
        <span>MINE Quiz</span>
      </button>

      {/* TOOLTIP */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1.5 bg-[#323E3A] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg transform translate-y-1 group-hover:translate-y-0">
        Coming Soon 🚀
        {/* Arrow pointing down */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#323E3A]"></div>
      </div>
    </div>
  );
};

export default QuizButton;