import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { 
  Edit2, Trash2, Eye, Search, FileText, 
  Calendar, User, AlertCircle, Loader2 
} from "lucide-react";

const ContentManagement = () => {
  const auth = useAuth();
  const token = auth.user?.id_token;
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // --- 1. FETCH CONTENT ---
  useEffect(() => {
    if (!token) return;
    
    const loadContent = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAllContent(token);
        // Handle pagination object vs array
        setPosts(Array.isArray(data) ? data : data.content || []);
      } catch (err) {
        console.error("Failed to load content", err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [token]);

  // --- 2. ACTIONS ---
  
  // Delete Post
  const handleDelete = async (post) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${post.title}"?`)) return;

    setProcessingId(post.id);
    try {
      await adminService.deleteContent(token, post.id);
      // Remove from UI immediately
      setPosts(prev => prev.filter(p => p.id !== post.id));
    } catch (err) {
      alert("Failed to delete post");
    } finally {
      setProcessingId(null);
    }
  };

  // Edit Post (Redirect to your existing editor)
  const handleEdit = (postId) => {
    // We send them to the normal edit page. 
    // Since you are ADMIN, your backend should allow this update.
    navigate(`/edit-post/${postId}`);
  };

  // --- 3. FILTERING ---
  const filteredPosts = posts.filter(post => {
    const term = searchTerm.toLowerCase();
    const titleMatch = post.title?.toLowerCase().includes(term);
    const authorMatch = (post.author?.displayName || post.author?.handle || "").toLowerCase().includes(term);
    return titleMatch || authorMatch;
  });

  // --- 4. RENDER ---
  if (loading) return (
     <div className="flex justify-center items-center h-64 text-[#04644C]">
        <Loader2 size={40} className="animate-spin" />
     </div>
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-800">Content Manager</h2>
            <p className="text-gray-500 text-sm">Manage, edit, or remove user content</p>
        </div>
        
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search title or author..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04644C] focus:border-transparent outline-none w-full md:w-64 transition-all"
            />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Post Details</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Author</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                
                {/* 1. Post Details */}
                <td className="px-6 py-4 max-w-sm">
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        {post.coverImage || post.thumbnail ? (
                            <img src={post.coverImage || post.thumbnail} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-300"><FileText size={20}/></div>
                        )}
                    </div>
                    {/* Title & Date */}
                    <div className="min-w-0">
                        <Link to={`/post/${post.id}`} className="font-bold text-gray-900 hover:text-[#04644C] truncate block">
                            {post.title || "Untitled Post"}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <Calendar size={10} />
                            {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                  </div>
                </td>

                {/* 2. Author */}
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                            <img src={post.author?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown"} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {post.author?.displayName || post.author?.handle || "Unknown"}
                        </span>
                    </div>
                </td>

                {/* 3. Status */}
                <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide
                        ${post.published 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}>
                        {post.published ? "Published" : "Draft"}
                    </span>
                </td>

                {/* 4. Actions */}
                <td className="px-6 py-4 text-right">
                   {processingId === post.id ? (
                      <Loader2 size={18} className="animate-spin text-gray-400 ml-auto" />
                   ) : (
                      <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        {/* View */}
                        <Link to={`/post/${post.id}`} target="_blank" className="p-2 text-gray-500 hover:bg-gray-100 hover:text-[#04644C] rounded-lg transition" title="View Post">
                            <Eye size={16} />
                        </Link>
                        
                        {/* Edit (Admin Mode) */}
                        <button onClick={() => handleEdit(post.id)} className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition" title="Edit Content">
                            <Edit2 size={16} />
                        </button>
                        
                        {/* Delete */}
                        <button onClick={() => handleDelete(post)} className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition" title="Delete Permanently">
                            <Trash2 size={16} />
                        </button>
                      </div>
                   )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {filteredPosts.length === 0 && (
            <div className="p-12 text-center">
                <div className="inline-flex p-4 bg-gray-50 rounded-full mb-3">
                    <Search className="text-gray-400" size={24} />
                </div>
                <h3 className="text-gray-900 font-bold">No content found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your search terms.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;