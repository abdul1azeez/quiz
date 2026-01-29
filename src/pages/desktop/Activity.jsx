import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "react-oidc-context";
import { Bookmark, Users, Heart, MessageSquare, SearchX, Loader2 } from "lucide-react";

// Import your actual Post component
import { Post } from "../../components/desktop";
import { useProfileDetails } from "../../hooks/useProfileDetails";
// Import sub-views
import SubscriptionsView from "../../components/desktop/activity/SubscriptionsView";
import CommentsView from "../../components/desktop/activity/CommentsView";
import BookmarksView from "../../components/desktop/activity/BookmarksView";
import LikesView from "../../components/desktop/activity/LikesView";



const API_BASE = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";

const Activity = () => {
    const auth = useAuth();
    const token = auth.user?.id_token || localStorage.getItem("cognito_jwt");

    const [activeTab, setActiveTab] = useState("bookmarks");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const tabs = [
        { id: "bookmarks", label: "Bookmarks", icon: <Bookmark size={18} /> },
        { id: "likes", label: "Likes", icon: <Heart size={18} /> },
        { id: "subscriptions", label: "Following", icon: <Users size={18} /> },
        { id: "comments", label: "Comments", icon: <MessageSquare size={18} /> },
    ];

    // --- DATA NORMALIZER ---
    // This transforms the API response into the flat format 'ArticleCard' expects
    const normalizeData = async (items, type) => {
        if (!Array.isArray(items)) return [];

        // ---- COMMENTS NEED ASYNC ----
        if (type === "comments") {
            return Promise.all(
                items.map(async (item) => {
                    try {
                        const res = await fetch(
                            `${API_BASE}/content/${item.contentId}`
                        );
                        const post = await res.json();

                        return {
                            id: item.id,
                            postTitle: post.title || "Unknown Post",
                            postId: item.contentId,
                            comment: item.text || item.body || "",
                            date: new Date(item.createdAt).toLocaleDateString(),
                        };
                    } catch (err) {
                        console.error("Failed to fetch post title", err);

                        return {
                            id: item.id,
                            postTitle: "Unknown Post",
                            comment: item.text || item.body || "",
                            date: new Date(item.createdAt).toLocaleDateString(),
                        };
                    }
                })
            );
        }

        // ---- EVERYTHING ELSE STAYS SYNC ----
        return items.map((item) => {
            // 1. BOOKMARKS
            if (type === "bookmarks") {
                const post = item.content || {};
                const author = post.author || {};

                return {
                    id: post.id || item.id,
                    title: post.title ? post.title : "Untitled Post",
                    author:
                        author.displayName ||
                        author.handle ||
                        author.username ||
                        "Unknown",
                    avatar:
                        author.avatarUrl ||
                        author.pictureUrl ||
                        "https://mineglobal.org/default-avatar.png",
                    date: new Date(post.createdAt || item.createdAt).toLocaleDateString(),
                    category: post.section || "General",
                    showAvatar: true, // 👈 IMPORTANT
                };
            }

            // 2️⃣ HANDLE LIKES (flat response)
            if (type === "likes") {
                return {
                    id: item.contentId || item.id,
                    title: item.contentTitle ? item.contentTitle : "Untitled Post",
                    author: item.authorHandle
                        ? `@${item.authorHandle}`
                        : "Unknown",
                    date: new Date(item.createdAt).toLocaleDateString(),
                    category: "General", // likes API doesn't send section
                    showAvatar: false, // 👈 IMPORTANT
                };
            }


            // 2. SUBSCRIPTIONS (people I follow)
            if (type === "subscriptions") {
                return {
                    id: item.followed.id,
                    name: item.followed.displayName || item.followed.username,
                    handle: item.followed.handle,
                    avatar: item.followed.avatarUrl || item.followed.pictureUrl,
                };
            }


            return item;
        });
    };


    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            setLoading(true);
            setError("");
            setData([]);

            try {
                let endpoint = "";
                // ⚠️ Minimal params to avoid 500 Error (Removed 'sort')
                const params = "?page=0&size=20";

                switch (activeTab) {
                    case "bookmarks":
                        endpoint = `${API_BASE}/my/bookmarks${params}`;
                        break;
                    case "likes":
                        endpoint = `${API_BASE}/my/likes${params}`;
                        break;
                    case "subscriptions":
                        endpoint = `${API_BASE}/my/following`;
                        break;
                    case "comments":
                        endpoint = `${API_BASE}/my/comments`;
                        break;
                    default:
                        return;
                }

                const res = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });


                // 1. Get the raw array (handle Spring Boot 'content' wrapper)
                const rawData = Array.isArray(res.data) ? res.data : (res.data.content || []);

                // 2. Normalize it for the UI components
                const cleanData = await normalizeData(rawData, activeTab);

                setData(cleanData);

            } catch (err) {
                console.error("Fetch error:", err);
                setError("Unable to load data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab, token]);

    const handleTabChange = (tabId) => {
        if (tabId !== activeTab) setActiveTab(tabId);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#FAFAFA] px-4 pb-20">

            {/* HEADER & TABS */}
            <div className="w-full max-w-3xl sticky top-0 md:top-4 z-30 flex flex-col items-center gap-6 mb-4 md:mb-8">
                <div className="flex w-full md:w-auto p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-5 py-3 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap
                    ${activeTab === tab.id
                                    ? "bg-[#04644C] text-white shadow-md"
                                    : "text-tertiary hover:bg-gray-100"
                                }
                `}
                        >
                            {/* Optional: Adjust icon size for mobile if needed, e.g. scale-90 */}
                            <span className="scale-90 md:scale-100">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="w-full max-w-3xl">
                <div className="bg-white rounded-3xl border border-[#EDEDED] shadow-sm overflow-hidden min-h-[500px]">

                    <div className="px-8 pt-8 pb-4 border-b border-gray-50">
                        <h2 className="text-xl font-bold text-[#000A07] capitalize">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h2>
                        <p className="text-xs text-[#5C6261] font-medium">
                            {loading ? "Loading..." : `${data.length} ${tabs.find(t => t.id === activeTab)?.label}`}
                        </p>
                    </div>

                    <div className="p-2 min-h-[300px]">
                        {loading ? (
                            <div className="flex justify-center items-center h-60">
                                <Loader2 className="animate-spin text-[#04644C]" size={32} />
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 text-red-500">{error}</div>
                        ) : (
                            <>
                                {activeTab === "bookmarks" && <BookmarksView data={data} />}
                                {activeTab === "likes" && <LikesView data={data} />}
                                {activeTab === "subscriptions" && <SubscriptionsView data={data} />}
                                {activeTab === "comments" && <CommentsView data={data} />}
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};


export default Activity;