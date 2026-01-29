import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "react-oidc-context";
import { useOutletContext } from "react-router-dom";
import { useProfileDetails } from "../../../../hooks/useProfileDetails";
import { FaUserPlus, FaCheck, FaSpinner } from "react-icons/fa";

const FollowButton = ({ targetUserId, onFollowChange }) => {
  const auth = useAuth();
  const { openSignIn } = useOutletContext();
  const { profile, loading: profileLoading } = useProfileDetails();

  const isLoggedIn = auth.isAuthenticated && auth.user?.profile?.sub;

  const token =
    auth.user?.id_token || localStorage.getItem("cognito_jwt") || null;

  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // ----------- FETCH FOLLOW STATUS -----------
  useEffect(() => {
    if (!isLoggedIn || !token || !targetUserId) return;

    const fetchFollowStatus = async () => {
      try {
        const res = await axios.get(
          `https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/follow/users/${targetUserId}/status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (typeof res.data === "boolean") {
          setFollowing(res.data);
        }
      } catch (err) {
        console.error("Error fetching follow status:", err);
      }
    };

    fetchFollowStatus();
  }, [isLoggedIn, token, targetUserId]);

  // ----------- FOLLOW / UNFOLLOW -----------
  const handleFollow = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      openSignIn();
      return;
    }

    if (profileLoading || loading) return;

    const newFollowing = !following;

    // Optimistic UI
    setFollowing(newFollowing);
    setLoading(true);

    // ✅ TELL PARENT
    onFollowChange?.(newFollowing ? +1 : -1);

    try {
      const url = `https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/follow/users/${targetUserId}`;

      if (newFollowing) {
        await axios.post(url, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error("Error follow/unfollow:", err);

      // rollback
      setFollowing((prev) => !prev);

      // ❌ rollback count
      onFollowChange?.(newFollowing ? -1 : +1);
    } finally {
      setLoading(false);
    }
  };

  // ----------- DONT SHOW ON OWN PROFILE -----------
  if (profile?.userId === targetUserId) return null;

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`
    flex w-full items-center justify-center gap-2 px-6 py-2 rounded-xl font-bold transition-all duration-200 active:scale-95 cursor-pointer
    ${following
          ? "bg-white border-2 border-gray-400 text-gray-500 hover:bg-gray-50" // Following State (Outline)
          : "bg-[#04644C] text-white shadow-md hover:bg-[#03523F] hover:shadow-lg" // Follow State (Filled)
        }
    ${loading ? "opacity-70 cursor-wait" : ""}
  `}
    >
      {loading ? (
        // 1. Loading State
        <>
          <FaSpinner className="animate-spin" />
          <span>Processing...</span>
        </>
      ) : following ? (
        // 2. Following State (Checkmark)
        <>
          <span>Following</span>
        </>
      ) : (
        // 3. Follow State (User Plus)
        <>
          <FaUserPlus size={16} />
          <span>Follow</span>
        </>
      )}
    </button>
  );
};

export default FollowButton;
