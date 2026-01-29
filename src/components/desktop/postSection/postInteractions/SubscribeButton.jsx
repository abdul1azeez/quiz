// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "react-oidc-context";
// import { useOutletContext } from "react-router-dom";
// import { useProfileDetails } from "../../../../hooks/useProfileDetails";

// const BASE_URL =
//   "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/subscriptions";

// const SubscribeButton = ({ creatorId }) => {
//   const auth = useAuth();
//   const { openSignIn } = useOutletContext();
//   const { profile, loading: profileLoading } = useProfileDetails();

//   const isLoggedIn = auth.isAuthenticated && auth.user?.profile?.sub;
//   const token =
//     auth.user?.id_token || localStorage.getItem("cognito_jwt") || null;

//   const [subscribed, setSubscribed] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // -----------------------------------
//   // 1️⃣ Fetch subscribe status
//   // -----------------------------------
//   useEffect(() => {
//     if (!isLoggedIn || !token || !creatorId) return;

//     const fetchStatus = async () => {
//       try {
//         const res = await axios.get(
//           `${BASE_URL}/is-subscribed/${creatorId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (typeof res.data === "boolean") {
//           setSubscribed(res.data);
//         }
//       } catch (e) {
//         console.error("Error fetching subscribe status", e);
//       }
//     };

//     fetchStatus();
//   }, [isLoggedIn, creatorId, token]);

//   // -----------------------------------
//   // 2️⃣ Like-style toggle (optimistic)
//   // -----------------------------------
//   const handleSubscribe = async (e) => {
//     e.stopPropagation();

//     if (!isLoggedIn) {
//       openSignIn();
//       return;
//     }

//     if (profileLoading || loading) return;

//     const newSubscribed = !subscribed;

//     // optimistic UI
//     setSubscribed(newSubscribed);
//     setLoading(true);

//     try {
//       const url = `${BASE_URL}/${newSubscribed ? "subscribe" : "unsubscribe"}/${creatorId}`;

//       await axios.post(url, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     } catch (error) {
//       console.error("Subscribe toggle failed", error);
//       setSubscribed((prev) => !prev); // rollback
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -----------------------------------
//   // 3️⃣ Render
//   // -----------------------------------
//   return (
//     <button
//       onClick={handleSubscribe}
//       disabled={loading}
//       className={`text-sm rounded-full px-4 py-2 transition-all
//         ${subscribed
//           ? "text-gray-500 bg-gray-100"
//           : "text-link hover:bg-gray-200"}
//         ${loading ? "opacity-60 pointer-events-none" : ""}
//       `}
//     >
//       {subscribed ? "Subscribed" : "Subscribe"}
//     </button>
//   );
// };

// export default SubscribeButton;


import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "react-oidc-context";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";

// ⚠️ Verify this endpoint with your backend (e.g., /profiles/{id}/follow)
const API_BASE = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";

const SubscribeButton = ({ targetUserId, initialIsFollowing = false, onToggle }) => {
  const auth = useAuth();
  const token = auth.user?.id_token || localStorage.getItem("cognito_jwt");
  
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  // Sync state if prop changes
  useEffect(() => { setIsFollowing(initialIsFollowing) }, [initialIsFollowing]);

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (!token) return alert("Please sign in to follow authors.");
    if (loading) return;

    // Optimistic Update
    const newState = !isFollowing;
    setIsFollowing(newState);
    setLoading(true);

    try {
      if (newState) {
        // Follow
        await axios.post(`${API_BASE}/profiles/${targetUserId}/follow`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Unfollow
        await axios.delete(`${API_BASE}/profiles/${targetUserId}/follow`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      if (onToggle) onToggle(newState);
    } catch (err) {
      console.error("Follow error:", err);
      setIsFollowing(!newState); // Rollback
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`
        flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 shadow-sm
        ${isFollowing 
          ? "bg-white border border-[#04644C] text-[#04644C] hover:bg-gray-50" 
          : "bg-[#000A07] text-white hover:bg-[#323E3A] hover:shadow-md hover:-translate-y-0.5"}
      `}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck size={18} />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus size={18} />
          <span>Follow</span>
        </>
      )}
    </button>
  );
};

export default SubscribeButton;