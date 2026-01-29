import { useState, useEffect } from "react";
import axios from "axios";
import { Bookmark } from "lucide-react";
import { useAuth } from "react-oidc-context";
import { useOutletContext } from "react-router-dom";
import { useProfileDetails } from "../../../../hooks/useProfileDetails";

// Use the correct API base URL
const API_BASE = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";

const BookmarkButton = ({ post }) => {
  const auth = useAuth();
  const { openSignIn } = useOutletContext();
  const { loading: profileLoading } = useProfileDetails();

  const isLoggedIn = auth.isAuthenticated && auth.user?.profile?.sub;
  const token = auth.user?.id_token || localStorage.getItem("cognito_jwt");

  // State
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(post.repostCount || 0); // Assuming repostCount maps to bookmarks in your schema, or change to post.bookmarkCount
  const [loading, setLoading] = useState(false);

  // 1. Fetch initial bookmark status
  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const fetchStatus = async () => {
      try {
        const url = `${API_BASE}/engagement/content/${post.id}/bookmark-status`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (typeof response.data === "boolean") {
          setIsBookmarked(response.data);
        }
      } catch (error) {
        console.error("Error fetching bookmark status:", error);
      }
    };

    fetchStatus();
  }, [isLoggedIn, post.id, token]);

  // 2. Handle Click
  const handleBookmark = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      openSignIn();
      return;
    }

    if (profileLoading || loading) return;

    // Optimistic Update
    const newStatus = !isBookmarked;
    setIsBookmarked(newStatus);
    setBookmarkCount((prev) => (newStatus ? prev + 1 : prev - 1));
    setLoading(true);

    try {
      const url = `${API_BASE}/engagement/content/${post.id}/bookmark`;

      if (newStatus) {
        // POST to add bookmark
        await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        // DELETE to remove bookmark
        await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      // Rollback on error
      setIsBookmarked(!newStatus);
      setBookmarkCount((prev) => (newStatus ? prev - 1 : prev + 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      className={`
        group flex items-center gap-1.5 cursor-pointer transition-all duration-200
        ${loading ? "opacity-60 pointer-events-none" : "hover:scale-105"}
        ${isBookmarked ? "text-brand-primary" : "text-gray-500 hover:text-gray-900"}
      `}
      title={isBookmarked ? "Remove Bookmark" : "Bookmark this post"}
    >
      <Bookmark
        size={20}
        className={`transition-all duration-300 ${
          isBookmarked 
            ? "fill-current text-button-primary" // Filled when active
            : "fill-transparent stroke-current" // Outlined when inactive
        }`}
      />
      
      {/* Optional: Show count if needed */}
      {/* <span className="text-sm font-medium">{bookmarkCount}</span> */}
    </button>
  );
};

export default BookmarkButton;