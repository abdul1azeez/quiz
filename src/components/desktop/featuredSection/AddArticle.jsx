import React, { useState } from 'react';
import featuredCards from './featuredCards';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddArticle = () => {
    const navigate = useNavigate();
    
    // Form State
    const [formData, setFormData] = useState({ title: '', thumbnail: '', link: '' });

    // Load current list to display a preview
    const [currentList, setCurrentList] = useState(() => {
        const saved = localStorage.getItem('featuredArticlesData');
        return saved ? JSON.parse(saved) : featuredCards;
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.thumbnail) return alert("Title and Image are required!");

        const newCard = {
            id: Date.now(),
            title: formData.title,
            thumbnail: formData.thumbnail,
            link: formData.link || '#',
            readTime: Math.floor(Math.random() * 5) + 3 // Random read time for demo
        };

        // Add to front, slice to max 6
        const updatedList = [newCard, ...currentList].slice(0, 6);

        // Save to Storage
        localStorage.setItem('featuredArticlesData', JSON.stringify(updatedList));
        
        // Update local state
        setCurrentList(updatedList);
        setFormData({ title: '', thumbnail: '', link: '' });
        
        alert("Article added successfully!");
    };

    const handleReset = () => {
        if (confirm("Reset to default data? This clears your custom articles.")) {
            localStorage.removeItem('featuredArticlesData');
            setCurrentList(featuredCards);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-gray-50 min-h-screen">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-black">
                <ArrowLeft size={16} /> Back to Home
            </button>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold mb-6">Add Featured Article</h1>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Article Title</label>
                        <input 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full border p-2 rounded-lg outline-none focus:ring-2 ring-blue-500"
                            placeholder="Enter the headline..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Image URL</label>
                        <input 
                            value={formData.thumbnail}
                            onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                            className="w-full border p-2 rounded-lg outline-none focus:ring-2 ring-blue-500"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Link URL</label>
                        <input 
                            value={formData.link}
                            onChange={(e) => setFormData({...formData, link: e.target.value})}
                            className="w-full border p-2 rounded-lg outline-none focus:ring-2 ring-blue-500"
                            placeholder="https://substack.com/..."
                        />
                    </div>

                    <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2">
                        <Save size={18} /> Publish to Feed
                    </button>
                </form>

                <div className="mt-8 border-t pt-6">
                    <h3 className="font-bold mb-4">Current Active Cards ({currentList.length}/6)</h3>
                    <div className="space-y-2">
                        {currentList.map(item => (
                            <div key={item.id} className="flex items-center gap-3 p-2 border rounded-lg bg-gray-50">
                                <img src={item.thumbnail} className="w-10 h-10 rounded object-cover" alt="" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{item.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleReset} className="mt-6 flex items-center gap-2 text-red-500 text-xs hover:underline">
                        <Trash2 size={12} /> Reset to Defaults
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddArticle;