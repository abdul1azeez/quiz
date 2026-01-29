import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import { Link2, MapPin, Calendar, LayoutGrid } from "lucide-react";
import { PiXLogoFill } from "react-icons/pi";
import { FaInstagram, FaLinkedin, FaYoutube, FaGithub } from "react-icons/fa";

// Component Imports
import { ProfileBanner, ProfileAvatar } from "../profileSection/ProfileVisuals"; // Reuse existing
import { SocialField } from "../profileSection/SocialField"; // Reuse existing
import SubscribeButton from "../postSection/postInteractions/SubscribeButton";
import Post from "../postSection/Post"; // Reuse Feed Post
import { useAuth } from "react-oidc-context";

// Helper to check if a string is a valid UUID
const API_BASE = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";

// Helper to check if a string is a valid UUID
const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const ViewProfile = () => {
    const { userId: routeId } = useParams();
    const auth = useAuth();
    const { openSignIn } = useOutletContext() || {};

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            setError("");

            const token = auth.user?.id_token || localStorage.getItem("cognito_jwt");

            // Handle the ID/Handle distinction
            const cleanId = routeId ? routeId.replace(/^@/, '') : null;
            if (!cleanId) return;

            const endpoint = isUUID(cleanId)
                ? `${API_BASE}/profiles/${cleanId}`
                : `${API_BASE}/profiles/handle/${cleanId}`;

            try {
                let profileRes;

                // 1. Fetch Profile (Try Auth, Fallback to Guest)
                try {
                    const headers = token ? { Authorization: `Bearer ${token}` } : {};
                    profileRes = await axios.get(endpoint, { headers });
                } catch (authErr) {
                    if (authErr.response?.status === 401) {
                        // If token invalid, retry as guest
                        profileRes = await axios.get(endpoint);
                    } else {
                        throw authErr;
                    }
                }

                const userData = profileRes.data;
                setUser(userData);

                // 2. Fetch Posts
                if (userData && userData.userId) {
                    try {
                        // ✅ FIX: Removed 'sort' parameter and added 'page=0' to prevent 500 Error
                        const postsUrl = `${API_BASE}/content?authorId=${userData.userId}&publishedOnly=true&page=0&size=20`;

                        // Try fetching posts (Auth headers optional but good for 'liked' status)
                        const postsRes = await axios.get(postsUrl,
                            token ? { headers: { Authorization: `Bearer ${token}` } } : {}
                        );

                        setPosts(postsRes.data.content || []);
                    } catch (postErr) {
                        // Retry posts as guest if 401
                        if (postErr.response?.status === 401) {
                            const guestPostsUrl = `${API_BASE}/content?authorId=${userData.userId}&publishedOnly=true&page=0&size=20`;
                            const guestPosts = await axios.get(guestPostsUrl);
                            setPosts(guestPosts.data.content || []);
                        } else {
                            console.error("Failed to load posts", postErr);
                        }
                    }
                }

            } catch (err) {
                console.error("Fetch error:", err);
                setError("User not found.");
            } finally {
                setLoading(false);
            }
        };

        if (routeId) fetchProfileData();
    }, [routeId, auth.user?.id_token]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error || !user) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "User not found"}</div>;

    return (
        <div className="flex flex-col items-center pb-20 bg-[#FAFAFA] min-h-screen">

            <div className="w-full lg:px-[min(3em,3.5%)]">
                <ProfileBanner banner={user.bannerUrl} isEditing={false} />

                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 relative -mt-16 md:-mt-20">
                    <div className="bg-white rounded-2xl shadow-sm border border-[#EDEDED] overflow-hidden">
                        <div className="p-6 md:p-8">

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
                                <div className="flex flex-col md:flex-row items-end md:items-end gap-6 w-full">
                                    <div className="-mt-24 md:-mt-32 shrink-0">
                                        <ProfileAvatar picture={user.avatarUrl || user.pictureUrl} isEditing={false} />
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <h1 className="text-3xl font-bold text-[#000A07]">{user.displayName}</h1>
                                        <p className="text-[#5C6261] font-medium">@{user.handle}</p>

                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-xs text-gray-400">
                                            {user.createdAt && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} /> Joined {new Date(user.createdAt).getFullYear()}
                                                </span>
                                            )}
                                            {user.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={12} /> {user.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto flex justify-center md:justify-end">
                                    <SubscribeButton
                                        targetUserId={user.userId}
                                        initialIsFollowing={user.isFollowing || false}
                                        openSignIn={openSignIn}
                                    />
                                </div>
                            </div>

                            {user.bio && (
                                <p className="text-[#323E3A] leading-relaxed max-w-2xl mb-6 text-sm md:text-base whitespace-pre-wrap">
                                    {user.bio}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-6">
                                <SocialField isEditing={false} icon={<Link2 size={16} />} label="website" value={user.website} color="text-gray-700" />
                                <SocialField isEditing={false} icon={<PiXLogoFill size={16} />} label="X" value={user.xhandle} color="text-black" />
                                <SocialField isEditing={false} icon={<FaInstagram size={16} />} label="Instagram" value={user.instagramHandle} color="text-[#E1306C]" />
                                <SocialField isEditing={false} icon={<FaLinkedin size={16} />} label="LinkedIn" value={user.linkedinUrl} color="text-[#0077B5]" />
                                <SocialField isEditing={false} icon={<FaYoutube size={16} />} label="Youtube" value={user.youtubeHandle} color="text-[#FF0000]" />
                                <SocialField isEditing={false} icon={<FaGithub size={16} />} label="GitHub" value={user.githubHandle} color="text-black" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-3xl mt-8 px-4 flex flex-col gap-6">
                <div className="flex items-center gap-2 text-xl font-bold text-[#000A07]">
                    <LayoutGrid className="text-[#04644C]" />
                    Posts ({posts.length})
                </div>

                <div className="flex flex-col gap-4">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Post
                                key={post.id}
                                post={{
                                    ...post,
                                    authorDisplay: `@${user.handle}`,
                                    authorAvatar: user.avatarUrl
                                }}
                                currentUserId={null}
                            />
                        ))
                    ) : (
                        <div className="py-20 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
                            User has not published any posts yet.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ViewProfile;