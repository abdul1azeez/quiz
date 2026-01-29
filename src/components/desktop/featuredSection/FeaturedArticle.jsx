// import featuredCards from './featuredCards';



// const FeaturedArticle = () => {
//     return (

//         <div className="tabs flex gap-4 overflow-x-scroll pb-2 py-4 ">
//             {featuredCards.map((featuredCard) => (
//                 <div
//                     key={featuredCard.id}
//                     className="tab relative bg-gray-300 p-3 flex rounded-xl text-xs font-semibold cursor-pointer aspect-video hover:underline shrink-0 w-xs"
//                     style={{
//                         backgroundImage: `url(${featuredCard.thumbnail})`,
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center'
//                     }}
//                 >
//                     <div className="text relative z-10  text-surface-base flex flex-col justify-end">
//                         <p className='text-lg line-clamp-3'>{featuredCard.title}</p>
//                         <p className='opacity-60'>{featuredCard.readTime}m read</p>
//                     </div>

//                     <div class="absolute rounded-xl inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
//                 </div>
//             ))}
//         </div>
//     )
// }

// export default FeaturedArticle

// import featuredCards from './featuredCards';



// const FeaturedArticle = () => {
//     return (
//         <div className="tabs flex gap-4 overflow-x-auto pb-2 py-4 scrollbar-hide">
//             {featuredCards.map((featuredCard) => (
//                 <a
//                     key={featuredCard.id}
//                     href={featuredCard.link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="tab relative bg-gray-300 p-3 flex rounded-xl text-xs font-semibold cursor-pointer aspect-video hover:underline shrink-0 w-72 md:w-80 overflow-hidden group"
//                     style={{
//                         backgroundImage: `url(${featuredCard.thumbnail})`,
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center',
//                         backgroundRepeat: 'no-repeat'
//                     }}
//                 >
//                     {/* Dark Gradient Overlay */}
//                     <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent rounded-xl transition-opacity group-hover:from-black/95"></div>

//                     {/* Text Content */}
//                     <div className="relative z-10 text-white flex flex-col justify-end h-full w-full">
//                         <p className="text-lg leading-tight line-clamp-3 mb-1 shadow-black drop-shadow-md">
//                             {featuredCard.title}
//                         </p>
//                         <p className="opacity-80 font-normal text-[10px] uppercase tracking-wider">
//                             {featuredCard.readTime}m read
//                         </p>
//                     </div>
//                 </a>
//             ))}
//         </div>
//     );
// };

// export default FeaturedArticle;
import { useState, useEffect } from 'react';
import featuredCards from './featuredCards';
import { ExternalLink } from 'lucide-react';

/**
 * Helper: Calculate Reading Time
 * (Copied from Post.jsx for consistency)
 */
const getReadingTime = (htmlContent) => {
  if (!htmlContent) return "2 min"; // Default if no content

  const text = htmlContent.replace(/<[^>]*>?/gm, '');
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  
  return `${minutes} min`;
};

const FeaturedArticle = () => {
    // Load data from LocalStorage, fallback to INITIAL_CARDS
    const [articles, setArticles] = useState(() => {
        const saved = localStorage.getItem('featuredArticlesData');
        return saved ? JSON.parse(saved) : featuredCards;
    });

    // Optional: Listen for updates if you use multiple tabs
    useEffect(() => {
        const handleStorageChange = () => {
            const saved = localStorage.getItem('featuredArticlesData');
            if (saved) setArticles(JSON.parse(saved));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <div className="w-full py-4 ">
            {/* <div className="logo w-full h-24 justify-center items-center px-4 hidden lg:block"></div> */}
            <h2 className="top-0 sticky bg-[#f9fafb] lg:z-50 text-xl font-bold mb-4 px-4 md:px-0">Top Posts</h2>
            <div className="tabs flex lg:flex-col lg:justify-center gap-4 overflow-x-auto pb-4 px-4 md:px-0 scrollbar-hide snap-x">
                {articles.map((card, index) => {
                    
                    // 1. CALCULATE TIME HERE
                    // If the card has a manual 'readTime', use it. 
                    // Otherwise, try to calculate from 'body' or 'description'.
                    const calculatedTime = card.readTime 
                        ? `${card.readTime} min` 
                        : getReadingTime(card.body || card.description);

                    return (
                        <a
                            key={card.id}
                            href={card.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tab snap-start relative bg-gray-200 p-3 flex rounded-xl text-xs font-semibold cursor-pointer aspect-video hover:underline shrink-0 lg:w-auto w-72 md:w-80 overflow-hidden group transition-transform hover:-translate-y-1"
                            style={{
                                backgroundImage: `url(${card.thumbnail})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        >
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent rounded-xl transition-opacity group-hover:from-black/95"></div>

                            {/* Content */}
                            <div className="relative z-10 text-white flex flex-col justify-end h-full w-full">
                                {/* 'Latest' Badge for the very first item */}
                                {index === 0 && (
                                    <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold shadow-md">
                                        LATEST
                                    </span>
                                )}

                                <p className="text-lg leading-tight line-clamp-3 mb-1 shadow-black drop-shadow-md">
                                    {card.title}
                                </p>
                                <p className="opacity-80 font-normal text-[10px] uppercase tracking-wider flex items-center gap-2">
                                    {/* 2. USE THE CALCULATED TIME */}
                                    {calculatedTime} read <ExternalLink size={10} />
                                </p>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default FeaturedArticle;