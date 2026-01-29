import React, { useState } from 'react';
import { Plus, X, Link as LinkIcon, Image as ImageIcon, Type } from 'lucide-react';

// 1. Initial Data (The content you provided)
const INITIAL_DATA = [
    {
        id: 1,
        title: "Examining Capitalism: Defense and Critique",
        thumbnail: "https://substackcdn.com/image/fetch/$s_!N8CI!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fcc78b945-890b-4b47-add3-6b87ce144500_1143x725.png",
        link: "https://mineglobal.substack.com/p/examining-capitalism-defense-and",
        readTime: 5
    }
];

const DynamicArticles = () => {
    // State to hold the array of cards
    const [articles, setArticles] = useState(INITIAL_DATA);
    
    // State to hold form inputs
    const [formData, setFormData] = useState({
        title: '',
        thumbnail: '',
        link: '',
        readTime: ''
    });

    const [isFormOpen, setIsFormOpen] = useState(false);

    // Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Form Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate basic fields
        if (!formData.title || !formData.link) return alert("Title and Link are required");

        const newArticle = {
            id: Date.now(), // Unique ID based on timestamp
            title: formData.title,
            thumbnail: formData.thumbnail || "https://placehold.co/600x400/png", // Fallback image
            link: formData.link,
            readTime: formData.readTime || 2
        };

        // ⭐ THE MAGIC: Add new item to the FRONT of the array
        setArticles([newArticle, ...articles]);

        // Reset form
        setFormData({ title: '', thumbnail: '', link: '', readTime: '' });
        setIsFormOpen(false);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            
            {/* --- 1. Header & Add Button --- */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Featured Articles</h2>
                <button 
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    {isFormOpen ? <X size={16}/> : <Plus size={16}/>}
                    {isFormOpen ? "Cancel" : "Add New Article"}
                </button>
            </div>

            {/* --- 2. Input Form (Collapsible) --- */}
            {isFormOpen && (
                <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-200 animate-in fade-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Title Input */}
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title</label>
                            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
                                <Type size={16} className="text-gray-400 mr-2"/>
                                <input 
                                    name="title" value={formData.title} onChange={handleChange}
                                    placeholder="Enter article title" className="w-full outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* Image URL Input */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Image URL</label>
                            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
                                <ImageIcon size={16} className="text-gray-400 mr-2"/>
                                <input 
                                    name="thumbnail" value={formData.thumbnail} onChange={handleChange}
                                    placeholder="https://..." className="w-full outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* Link Input */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Link URL</label>
                            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
                                <LinkIcon size={16} className="text-gray-400 mr-2"/>
                                <input 
                                    name="link" value={formData.link} onChange={handleChange}
                                    placeholder="https://substack.com/..." className="w-full outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" className="mt-4 w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition">
                        Publish Article
                    </button>
                </form>
            )}

            {/* --- 3. The List (Automatically Updates) --- */}
            <div className="tabs flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x">
                {articles.map((featuredCard) => (
                    <a
                        key={featuredCard.id}
                        href={featuredCard.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tab snap-start relative bg-gray-200 p-3 flex rounded-xl text-xs font-semibold cursor-pointer aspect-video hover:underline shrink-0 w-72 md:w-80 overflow-hidden group transition-transform hover:-translate-y-1"
                        style={{
                            backgroundImage: `url(${featuredCard.thumbnail})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent rounded-xl transition-opacity group-hover:from-black/95"></div>

                        {/* Text Content */}
                        <div className="relative z-10 text-white flex flex-col justify-end h-full w-full">
                            {/* New Label if it's the very first item */}
                            {articles.indexOf(featuredCard) === 0 && (
                                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">LATEST</span>
                            )}
                            
                            <p className="text-lg leading-tight line-clamp-3 mb-1 shadow-black drop-shadow-md">
                                {featuredCard.title}
                            </p>
                            <p className="opacity-80 font-normal text-[10px] uppercase tracking-wider">
                                {featuredCard.readTime || 2}m read
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default DynamicArticles;