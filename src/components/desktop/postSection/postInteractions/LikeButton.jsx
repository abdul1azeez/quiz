
import { useState, useEffect } from "react";
import axios from "axios";
import { LikedHeart, Heart } from "../../../../assets";
import { useAuth } from "react-oidc-context";
import { useOutletContext } from "react-router-dom";
import { useProfileDetails } from "../../../../hooks/useProfileDetails";

const LikeButton = ({ post }) => {
  const auth = useAuth();
  const { openSignIn } = useOutletContext();
  const { profile, loading: profileLoading } = useProfileDetails();

  const isLoggedIn = auth.isAuthenticated && auth.user?.profile?.sub;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [loading, setLoading] = useState(false);

  const userId = profile?.userId || localStorage.getItem("userId") || null;
  const token = auth.user?.id_token || localStorage.getItem("cognito_jwt") || null;

  // Fetch like status only if logged in
  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const fetchLikeStatus = async () => {
      try {
        const url = `https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/engagement/content/${post.id}/like-status`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (typeof response.data === "boolean") {
          setLiked(response.data);
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [isLoggedIn, post.id, token]); // token is stable now

  const handleLike = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      openSignIn();
      return;
    }

    if (profileLoading || loading) return;

    const newLiked = !liked;

    // Optimistic UI update
    setLiked(newLiked);
    setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    setLoading(true);

    try {
      const url = `https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/engagement/content/${post.id}/like`;

      if (newLiked) {
        await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);

      // rollback
      setLiked((prev) => !prev);
      setLikeCount((prev) => (newLiked ? prev - 1 : prev + 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`likeCount cursor-pointer flex items-center gap-1 transition-all duration-200 ${
        liked ? "text-red-500" : "text-gray-600"
      } ${loading ? "opacity-60 pointer-events-none" : ""}`}
      onClick={handleLike}
      disabled={loading}
    >
      <img
        src={liked ? LikedHeart : Heart}
        alt={liked ? "LikedHeart" : "Heart"}
        className={`w-6 h-6 transition-transform ${liked ? "scale-110" : "scale-100"}`}
      />
      {likeCount}
    </button>
  );
};

export default LikeButton;
