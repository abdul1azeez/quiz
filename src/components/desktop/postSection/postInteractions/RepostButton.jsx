// import { useState } from "react";
// import axios from "axios";
// import { Repeat2 } from "lucide-react"; // or your own repost icon if you have one

// const RepostButton = ({ BASE_URL, post, currentUserId }) => {
//     // ♻️ Track repost state
//     const [reposted, setReposted] = useState(post.reposted || false);
//     const [repostCount, setRepostCount] = useState(post.reposts || 0);

//     // 🔁 Handle repost click
//     const handleRepost = async (e) => {
//         e.stopPropagation(); // prevent triggering parent navigation

//         try {
//             // Optimistic UI update
//             const newReposted = !reposted;
//             setReposted(newReposted);
//             setRepostCount((prev) => (newReposted ? prev + 1 : prev - 1));

//             // 🔗 API call
//             await axios.post(`${BASE_URL}/${post.id}/repost`, null, {
//                 params: { userId: currentUserId },
//             });
//         } catch (error) {
//             console.error("Error reposting:", error);
//             // Rollback UI if it fails
//             setReposted(reposted);
//             setRepostCount((prev) => (reposted ? prev + 1 : prev - 1));
//         }
//     };

//     return (
//         <button
//             onClick={handleRepost}
//             className={`repostCount flex items-center gap-1 cursor-pointer transition-colors duration-200 ${
//                 reposted ? "text-green-600" : "text-gray-600"
//             }`}
//         >
//             <Repeat2
//                 className={`w-6 h-6 ${reposted ? "rotate-180 transition-transform" : ""}`}
//             />
//             {repostCount}
//         </button>
//     );
// };

// export default RepostButton;

// --- Hassan's Code Below ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import axios from "axios";
import { Repeat2 } from "lucide-react";
import { useAuth } from "react-oidc-context";
import { useOutletContext } from "react-router-dom";
import { useProfileDetails } from "../../../../hooks/useProfileDetails";

const RepostButton = ({ post }) => {
  const auth = useAuth();
  const { openSignIn } = useOutletContext();
  const { profile, loading: profileLoading } = useProfileDetails();

  const isLoggedIn = auth.isAuthenticated && auth.user?.profile?.sub;
  const token = auth.user?.id_token || localStorage.getItem("cognito_jwt") || null;

  const [reposted, setReposted] = useState(false);
  //const [repostCount, setRepostCount] = useState(post.repostCount || 0);
  const [loading, setLoading] = useState(false);

  const userId = profile?.userId || localStorage.getItem("userId") || null;

  // Fetch initial repost/bookmark status only if logged in
  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const fetchRepostStatus = async () => {
      try {
        const url = `https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/engagement/content/${post.id}/bookmark-status`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (typeof response.data === "boolean") {
          setReposted(response.data);
        }
      } catch (error) {
        console.error("Error fetching repost status:", error);
      }
    };

    fetchRepostStatus();
  }, [isLoggedIn, post.id, token]);

  const handleRepost = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      openSignIn();
      return;
    }

    if (profileLoading || loading) return;

    const newReposted = !reposted;

    // Optimistic UI update
    setReposted(newReposted);
   // setRepostCount((prev) => (newReposted ? prev + 1 : prev - 1));
    setLoading(true);

    try {
      const url = `https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/engagement/content/${post.id}/bookmark`;

      if (newReposted) {
        await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (error) {
      console.error("Error reposting:", error);
      // rollback
      setReposted((prev) => !prev);
      //setRepostCount((prev) => (newReposted ? prev - 1 : prev + 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`
        repostCount cursor-pointer flex items-center gap-1
        transition-all duration-200
        ${reposted ? "text-green-600" : "text-gray-600"}
        ${loading ? "opacity-60 pointer-events-none" : ""}
      `}
      onClick={handleRepost}
      disabled={loading}
    >
      <Repeat2
        className={`
          w-6 h-6 transition-transform
          ${reposted ? "rotate-180 scale-110" : "scale-100"}
        `}
      />
      {/*repostCount*/}
    </button>
  );
};

export default RepostButton;
