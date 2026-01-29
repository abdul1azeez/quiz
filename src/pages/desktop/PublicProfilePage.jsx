// import { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router";
// import { useAuth } from 'react-oidc-context';

// import { Link2 } from "lucide-react";
// import { PiXLogoFill } from "react-icons/pi";
// import {
//   FaInstagram,
//   FaLinkedin,
//   FaYoutube,
//   FaGithub,
// } from "react-icons/fa";

// import { Post } from "../../components/desktop";
// import { SocialField } from "../../components/desktop/profileSection/SocialField";
// import {
//   ProfileBanner,
//   ProfileAvatar,
// } from "../../components/desktop/profileSection/ProfileVisuals";

// const PROFILE_BASE_URL =
//   "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";
// const CONTENT_BASE_URL =
//   "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content";

// const PublicProfilePage = () => {
//   const { handle } = useParams();
//   const auth = useAuth();
//   const loggedInHandle = auth.user?.profile?.preferred_username;
//   const isOwnProfile = auth.isAuthenticated && (handle === loggedInHandle);
//   // ---------------- PROFILE STATE ----------------
//   const [profile, setProfile] = useState(null);
//   const [loadingProfile, setLoadingProfile] = useState(true);

//   // ---------------- POSTS STATE ----------------
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(0);
//   const [loadingPosts, setLoadingPosts] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   const loadMoreRef = useRef(null);

//   // ---------------- FETCH PROFILE ----------------
//   useEffect(() => {
//     setLoadingProfile(true);

//     const fetchProfile = async () => {
//       try {
//         const res = await fetch(
//           `${PROFILE_BASE_URL}/profiles/handle/${handle}`
//         );

//         if (!res.ok) throw new Error("Profile not found");

//         const data = await res.json();
//         setProfile(data);
//       } catch (err) {
//         console.error(err);
//         setProfile(null);
//       } finally {
//         setLoadingProfile(false);
//       }
//     };

//     fetchProfile();
//   }, [handle]);

//   // ---------------- RESET POSTS WHEN PROFILE CHANGES ----------------
//   useEffect(() => {
//     setPosts([]);
//     setPage(0);
//     setHasMore(true);
//   }, [profile?.userId]);

//   // ---------------- FETCH POSTS (FRONTEND FILTERING) ----------------
//   useEffect(() => {
//     if (!profile?.userId) return;
//     if (loadingPosts || !hasMore) return;

//     const fetchPosts = async () => {
//       setLoadingPosts(true);

//       try {
//         const res = await fetch(
//           `${CONTENT_BASE_URL}?publishedOnly=true&page=${page}&size=20&sort=createdAt,DESC`
//         );

//         if (!res.ok) throw new Error("Failed to fetch posts");

//         const data = await res.json();

//         // ✅ FRONTEND FILTER BY AUTHOR
//         const filteredPosts = data.content.filter(
//           (post) => post.author?.id === profile.userId
//         );

//         setPosts((prev) => [...prev, ...filteredPosts]);

//         // ✅ STOP WHEN BACKEND ENDS
//         if (data.last === true) {
//           setHasMore(false);
//         }
//       } catch (err) {
//         console.error("Error loading posts:", err);
//       } finally {
//         setLoadingPosts(false);
//       }
//     };

//     fetchPosts();
//   }, [page, profile?.userId]);

//   // ---------------- INFINITE SCROLL ----------------
//   useEffect(() => {
//     if (!loadMoreRef.current || loadingPosts || !hasMore) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setPage((p) => p + 1);
//         }
//       },
//       { rootMargin: "200px" }
//     );

//     observer.observe(loadMoreRef.current);
//     return () => observer.disconnect();
//   }, [loadingPosts, hasMore]);

//   // ---------------- UI STATES ----------------
//   if (loadingProfile) {
//     return <div className="p-10 text-center">Loading profile...</div>;
//   }

//   if (!profile) {
//     return <div className="p-10 text-center">User not found</div>;
//   }

//   // ---------------- RENDER ----------------
//   return (
//     <div className="flex flex-col lg:px-[min(3em,3.5%)] items-center gap-4 pb-20">

//       {/* BANNER */}
//       <ProfileBanner banner={profile.banner} isEditing={false} />

//       {/* PROFILE CARD */}
//       <div className="w-full mx-auto px-4 sm:px-6 relative -mt-20">
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
//           <div className="flex flex-col gap-8 p-6 md:p-10">

//             {/* HEADER */}
//             <div className="flex flex-col md:flex-row justify-between items-start gap-6">

//               {/* LEFT */}
//               <div className="flex-1 w-full order-2 md:order-1 pt-10 md:pt-0">
//                 <h1 className="text-4xl font-bold text-[#000A07] mb-1">
//                   {profile.displayName}
//                 </h1>

//                 <p className="text-xl text-gray-500 mb-6">
//                   @{profile.handle}
//                 </p>

//                 {profile.bio && (
//                   <p className="text-gray-700 leading-relaxed max-w-2xl whitespace-pre-wrap">
//                     {profile.bio}
//                   </p>
//                 )}

//                 <p className="mt-4 text-sm text-gray-500">
//                   Followers:{" "}
//                   <span className="font-semibold">
//                     {profile.followerCount || 0}
//                   </span>
//                 </p>
//               </div>

//               {/* RIGHT */}
//               <div className="order-1 md:order-2 shrink-0 mx-auto md:mx-0">
//                 <ProfileAvatar
//                   picture={profile.avatarUrl}
//                   isEditing={false}
//                 />
//               </div>
//             </div>

//             {/* SOCIAL LINKS */}
//             <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">

//               {/* Website matches, so it works */}
//               <SocialField
//                 icon={<Link2 size={18} />}
//                 label="website"
//                 value={profile.website}
//               />

//               {/* FIX: Use backend keys (e.g., xhandle, instagramHandle) */}
//               <SocialField
//                 icon={<PiXLogoFill size={18} />}
//                 label="X"
//                 value={profile.xhandle || profile.twitterHandle}
//               />

//               <SocialField
//                 icon={<FaInstagram size={18} />}
//                 label="Instagram"
//                 value={profile.instagramHandle}
//               />

//               <SocialField
//                 icon={<FaLinkedin size={18} />}
//                 label="LinkedIn"
//                 value={profile.linkedinUrl}
//               />

//               <SocialField
//                 icon={<FaYoutube size={18} />}
//                 label="Youtube"
//                 value={profile.youtubeHandle}
//               />

//               <SocialField
//                 icon={<FaGithub size={18} />}
//                 label="GitHub"
//                 value={profile.githubHandle}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* POSTS */}
//       <div className="w-full max-w-5xl mt-10 divide-y divide-surface-stroke">
//         {posts.map((post) => (
//           <Post
//             key={post.id}
//             post={{
//               ...post,
//               authorDisplay: `@${profile.handle}`,
//             }}
//             currentUserId={null}
//           />
//         ))}

//         <div ref={loadMoreRef} className="h-10" />

//         {loadingPosts && (
//           <div className="py-6 text-center text-sm text-gray-500">
//             Loading posts...
//           </div>
//         )}

//         {!hasMore && (
//           <div className="py-6 text-center text-sm text-gray-400">
//             No more posts
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PublicProfilePage;



import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom"; // ✅ Import Link
import { useAuth } from 'react-oidc-context';

// ✅ Import Icons for buttons
import { Link2, Edit, UserPlus, Plus } from "lucide-react";
import { PiXLogoFill } from "react-icons/pi";
import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";

import { Post } from "../../components/desktop";
import { SocialField } from "../../components/desktop/profileSection/SocialField";
import {
  ProfileBanner,
  ProfileAvatar,
} from "../../components/desktop/profileSection/ProfileVisuals";

import FollowButton from "../../components/desktop/postSection/postInteractions/FollowButton";

const PROFILE_BASE_URL = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";
const CONTENT_BASE_URL = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content";

// ✅ 1. Define Default Banner
const DEFAULT_BANNER = "https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&h=400&fit=crop&q=80";

const PublicProfilePage = () => {
  const { handle } = useParams();
  const auth = useAuth();

  // ✅ Check Ownership
  const loggedInHandle = auth.user?.profile?.preferred_username;
  const isOwnProfile = auth.isAuthenticated && (handle === loggedInHandle);

  // ---------------- PROFILE STATE ----------------
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ---------------- POSTS STATE ----------------
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef(null);

  // ---------------- FETCH Follow ----------------
  const [followCount, setFollowCount] = useState(0);
  const handleFollowChange = (delta) => {
    setFollowCount((prev) => Math.max(0, prev + delta));
  };

  // ---------------- FETCH PROFILE ----------------
  useEffect(() => {
    setLoadingProfile(true);
    setFollowCount(0); // ✅ reset when switching profiles

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${PROFILE_BASE_URL}/profiles/handle/${handle}`);
        if (!res.ok) throw new Error("Profile not found");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [handle]);

  useEffect(() => {
    const fetchFollowCount = async () => {
      try {
        const res = await fetch(`${PROFILE_BASE_URL}/follow/users/${profile?.userId}/followers/count`,
          { headers: { Authorization: `Bearer ${auth.user?.id_token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch follow count");
        const data = await res.json();
        setFollowCount(data);
      } catch (err) {
        console.error("Error fetching follow count:", err);
      }
    };
    if (profile?.userId) fetchFollowCount();
  }, [profile?.userId]);

  // console.log("Profile Data:", profile?.userId); // Debugging log
  // console.log("Is Own Profile:", auth.user?.id_token); // Debugging log

  // ---------------- RESET POSTS WHEN PROFILE CHANGES ----------------
  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
  }, [profile?.userId]);

  // ---------------- FETCH POSTS ----------------
  useEffect(() => {
    if (!profile?.userId) return;
    if (loadingPosts || !hasMore) return;

    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await fetch(
          `${CONTENT_BASE_URL}?publishedOnly=true&page=${page}&size=20&sort=createdAt,DESC`
        );
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();

        const filteredPosts = data.content.filter(
          (post) => post.author?.id === profile.userId
        );

        //console.log("Filtered Posts:", filteredPosts); // Debugging log

        setPosts((prev) => [...prev, ...filteredPosts]);

        if (data.last === true) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error loading posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, [page, profile?.userId]);

  // ---------------- INFINITE SCROLL ----------------
  useEffect(() => {
    if (!loadMoreRef.current || loadingPosts || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPage((p) => p + 1);
      },
      { rootMargin: "200px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadingPosts, hasMore]);

  // ---------------- UI STATES ----------------
  if (loadingProfile) return <div className="p-10 text-center">Loading profile...</div>;
  if (!profile) return <div className="p-10 text-center">User not found</div>;

  // ---------------- RENDER ----------------
  return (
    <div className="flex flex-col lg:px-[min(3em,3.5%)] items-center gap-4 pb-20">

      {/* BANNER - ✅ Added Default Banner Logic */}
      <ProfileBanner
        // banner={profile.banner || DEFAULT_BANNER} 
        isEditing={false}
      />

      {/* PROFILE CARD */}
      <div className="w-full mx-auto px-4 sm:px-6 relative -mt-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="flex flex-col gap-3 p-6 md:p-10">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-2">

              {/* LEFT */}
              <div className="flex-1 w-full order-2 md:order-1 pt-10 md:pt-0">
                <h1 className="text-4xl font-bold text-[#000A07] mb-1">
                  {profile.displayName}
                </h1>


                <p className="text-xl text-gray-500 mb-6">
                  @{profile.handle}
                </p>

                {profile.bio && (
                  <p className="text-gray-700 leading-relaxed max-w-2xl whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* RIGHT */}
              <div className="order-1 md:order-2 shrink-0 mx-auto md:mx-0">
                <ProfileAvatar
                  picture={profile.avatarUrl}
                  isEditing={false}
                />
              </div>
            </div>

            {/* SOCIAL LINKS */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
              <SocialField icon={<Link2 size={18} />} label="website" value={profile.website} />
              <SocialField icon={<PiXLogoFill size={18} />} label="X" value={profile.xhandle || profile.twitterHandle} />
              <SocialField icon={<FaInstagram size={18} />} label="Instagram" value={profile.instagramHandle} />
              <SocialField icon={<FaLinkedin size={18} />} label="LinkedIn" value={profile.linkedinUrl} />
              <SocialField icon={<FaYoutube size={18} />} label="Youtube" value={profile.youtubeHandle} />
              <SocialField icon={<FaGithub size={18} />} label="GitHub" value={profile.githubHandle} />
            </div>

            {/* follow-section */}
            <div className="flex flex-col gap-1 mt-3">
              {/* Follower Count */}
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-gray-900">
                  {followCount}
                </span>
                <span className="text-sm text-gray-500">
                  Followers
                </span>
              </div>

              {/* Follow Button */}
              <div className="w-full h-full flex items-center">
                <FollowButton
                  targetUserId={profile.userId}
                  onFollowChange={handleFollowChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* POSTS */}
      <div className="w-full max-w-5xl mt-10 divide-y divide-surface-stroke">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={{
              ...post,
              authorDisplay: `@${profile.handle}`,
            }}
            currentUserId={null}
          />
        ))}

        <div ref={loadMoreRef} className="h-10" />
        {loadingPosts && <div className="py-6 text-center text-sm text-gray-500">Loading posts...</div>}
        {!hasMore && <div className="py-6 text-center text-sm text-gray-400">No more posts</div>}
      </div>
    </div>
  );
};

export default PublicProfilePage;