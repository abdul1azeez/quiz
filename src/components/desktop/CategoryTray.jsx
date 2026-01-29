import React from 'react';
import { Plus, Check } from 'lucide-react'; // Import icons

const CategoryTray = ({ categories, selectedId, onSelect, followedIds = [], onToggleFollow, canFollow }) => {
  return (
    <div className="w-full bg-white border-b border-surface-stroke sticky top-0 z-10">
      <div className="flex overflow-x-auto py-3 px-4 gap-3 no-scrollbar items-center">
        
        {/* "For you" Button (No follow logic needed here) */}
        <button
          onClick={() => onSelect(null)} 
          className={`whitespace-nowrap px-4 py-1.5 text-sm font-medium rounded-full transition-colors cursor-pointer border
             ${selectedId === null 
               ? "bg-black text-white border-black" 
               : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
             }`}
        >
          For you
        </button>

        {/* Dynamic List */}
        {categories.map((category) => {
          const label = category.name; 
          const id = category.id;
          const isActive = selectedId === id;
          
          // Check if this specific section ID is in our list of followed IDs
          const isFollowed = followedIds.includes(id);

          return (
            <div key={id} className="relative flex items-center group">
              {/* Main Button */}
              <button
                onClick={() => onSelect(id)}
                className={`whitespace-nowrap pl-4 pr-8 py-1.5 text-sm font-medium rounded-full transition-colors cursor-pointer border
                  ${isActive 
                    ? "bg-black text-white border-black" 
                    : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
                  }
                `}
              >
                {label}
              </button>

              {/* ACTION BUTTON - Only render if auth is ready! */}
              {canFollow && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFollow(id, isFollowed);
                  }}
                  className={`absolute right-1 p-1 rounded-full transition-all 
                    ${isActive ? "text-white hover:bg-gray-700" : "text-gray-500 hover:bg-gray-300"}
                  `}
                >
                  {isFollowed ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
                </button>
              )}
            </div>
          );
        })}
        
      </div>
    </div>
  );
};

export default CategoryTray;