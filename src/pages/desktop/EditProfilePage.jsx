import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Link2, Loader2, Plus } from "lucide-react";
import { PiXLogoFill } from "react-icons/pi";
import { FaInstagram, FaLinkedin, FaYoutube, FaGithub, FaPen, FaCheck } from "react-icons/fa";
import { Post } from "../../components/desktop";
// Imports from split files
import { useProfileDetails } from "../../hooks/useProfileDetails";
import { SocialField } from "../../components/desktop/profileSection/SocialField";
import { ProfileBanner, ProfileAvatar } from "../../components/desktop/profileSection/ProfileVisuals";
import { FollowHandler } from "../../components/mini_components";

const PROFILE_BASE_URL = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";
const CONTENT_BASE_URL = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content";

const EditProfilePage = () => {
  const { profile, loading, updateProfile } = useProfileDetails();

  const [editForm, setEditForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previews, setPreviews] = useState({ picture: "", banner: "" });

  // NEW: State for error messages
  const [errorMessage, setErrorMessage] = useState("");

  const [handleStatus, setHandleStatus] = useState("idle");


  // "drafts" | "published"
  const [postFilter, setPostFilter] = useState("published");


  // ---------------- HANDLE CHECKER ----------------
  useEffect(() => {
    if (!isEditing || !editForm.handle) return;

    if (profile?.handle && editForm.handle === profile.handle) {
      setHandleStatus("available");
      return;
    }

    setHandleStatus("checking");

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`${PROFILE_BASE_URL}/profiles/handle/${editForm.handle}`);
        if (res.ok) {
          setHandleStatus("taken");
        } else {
          setHandleStatus("available");
        }
      } catch (error) {
        setHandleStatus("available");
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [editForm.handle, isEditing, profile]);



  useEffect(() => {
    if (profile) {
      setEditForm(profile);
      setPreviews({ picture: profile.picture, banner: profile.banner });
    }
    //   // ✅ RESET POSTS STATE
    // setPosts([]);
    // setPage(0);
    // setHasMore(true);

  }, [profile]);

  //console.log("Profile Data:", profile);

  // ---------------- POSTS STATE ----------------
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef(null);

  // ---------------- FETCH POSTS ----------------
  useEffect(() => {
    if (!profile?.handle) return;
    if (loadingPosts || !hasMore) return;

    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await fetch(
          `${CONTENT_BASE_URL}?publishedOnly=false&page=${page}&size=20&sort=createdAt,DESC`
        );
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();

        const filteredPosts = data.content.filter(
          (post) => post.author?.handle === profile.handle
        );

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
  }, [page, profile?.handle]);

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

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [field === 'avatarFile' ? 'picture' : 'banner']: url }));
      setEditForm((prev) => ({ ...prev, [field]: file }));
    }
  };
  const handleBioChange = (e) => {
    const val = e.target.value;
    if (val.length <= 100) {
      setEditForm({ ...editForm, bio: val });
    }
  };

  const handleSave = async () => {
    setErrorMessage("");

    if (!editForm.name?.trim()) {
      setErrorMessage("Display Name is required.");
      return;
    }
    if (!editForm.handle?.trim()) {
      setErrorMessage("Username is required.");
      return;
    }

    if (handleStatus === "taken") {
      setErrorMessage("This username is already taken.");
      return;
    }
    if (handleStatus === "checking") {
      setErrorMessage("Please wait for username check to finish.");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(editForm);
      setIsEditing(false);
      // setIsNewUser(false);
    } catch (error) {
      console.error("Save Error:", error);
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEdit = () => {
    if (!isEditing) {
      setEditForm(profile);
      setErrorMessage(""); // Clear errors when starting edit
    }
    setIsEditing(!isEditing);
  };
  

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="flex flex-col lg:px-[min(3em,3.5%)] items-center gap-4 pb-20">

      {/* 1. BANNER */}
      <ProfileBanner
        banner={previews.banner}
        isEditing={isEditing}
        onUpload={(e) => handleFileChange(e, "bannerFile")}
        onUrlChange={(url) => {
          setPreviews(prev => ({ ...prev, banner: url }));
          setEditForm(prev => ({ ...prev, banner: url, bannerFile: null }));
        }}
      />


      <div className="w-full mx-auto px-4 sm:px-6 relative -mt-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="flex flex-col gap-8 p-6 md:p-10">

            {/* 2. HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">

              {/* Left: Text Inputs */}
              <div className="flex-1 w-full order-2 md:order-1 pt-10 md:pt-0">
                {isEditing ? (
                  <div className="max-w-md space-y-5">
                    {/* Display Name */}
                    <div>
                      <label className="text-xs uppercase font-bold text-gray-500 mb-1">Display Name</label>
                      <input
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full text-2xl font-bold text-[#000A07] border-b-2 border-gray-200 focus:border-[#04644C] outline-none py-1 bg-transparent placeholder-gray-300"
                        placeholder="Your Name"
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="text-xs uppercase font-bold text-gray-500 mb-1 flex justify-between">
                        <span>Username <span className="text-red-500">*</span></span>
                        <span className="text-xs normal-case">
                          {handleStatus === "checking" && <span className="text-gray-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Checking...</span>}
                          {handleStatus === "taken" && <span className="text-red-500 font-bold">Unavailable</span>}
                          {handleStatus === "available" && <span className="text-green-600 font-bold">Available</span>}
                        </span>
                      </label>
                      <div className="flex items-center relative">
                        <span className="text-gray-400 text-lg mr-1 absolute left-0">@</span>
                        <input
                          value={editForm.handle || ""}
                          onChange={(e) => setEditForm({ ...editForm, handle: e.target.value.toLowerCase().replace(/\s/g, '') })}
                          className={`w-full text-lg pl-6 border-b-2 outline-none py-1 bg-transparent placeholder-gray-300 transition-colors
                            ${handleStatus === 'taken' ? 'border-red-300 text-red-600' : 'border-gray-200 text-gray-700 focus:border-[#04644C]'}
                          `}
                          placeholder="username"
                        />
                      </div>
                    </div>

                    {/* Bio Input */}
                    <div>
                      <label className="text-xs uppercase font-bold text-gray-500 mb-1 flex justify-between">
                        <span>Bio</span>
                        <span className={`text-[10px] ${editForm.bio?.length === 100 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                          {editForm.bio?.length || 0}/100
                        </span>
                      </label>
                      <textarea
                        value={editForm.bio || ""}
                        onChange={handleBioChange}
                        className="w-full text-base text-gray-700 border-b-2 border-gray-200 focus:border-[#04644C] outline-none py-1 bg-transparent resize-none h-24 placeholder-gray-300 leading-relaxed"
                        placeholder="Tell us a little about yourself..."
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-4xl font-bold text-[#000A07] mb-1">{profile.name || "User Name"}</h1>
                    <p className="text-xl text-gray-500 mb-6">@{profile.handle || "handle"}</p>

                    {profile.bio && (
                      <p className="text-gray-700 leading-relaxed max-w-2xl whitespace-pre-wrap">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Avatar */}
              <div className="order-1 md:order-2 shrink-0 mx-auto md:mx-0">
                <ProfileAvatar
                  picture={previews.picture}
                  isEditing={isEditing}
                  onUpload={(e) => handleFileChange(e, "avatarFile")}
                />
              </div>
            </div>

            {/* 3. SOCIAL LINKS GRID */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
              <SocialField isEditing={isEditing} icon={<Link2 size={18} />} label="website" value={isEditing ? editForm.website : profile.website} onChange={(v) => setEditForm({ ...editForm, website: v })} color="text-gray-700" />
              <SocialField isEditing={isEditing} icon={<PiXLogoFill size={18} />} label="X" value={isEditing ? editForm.X : profile.X} onChange={(v) => setEditForm({ ...editForm, X: v })} color="text-black" />
              <SocialField isEditing={isEditing} icon={<FaInstagram size={18} />} label="Instagram" value={isEditing ? editForm.Instagram : profile.Instagram} onChange={(v) => setEditForm({ ...editForm, Instagram: v })} color="text-[#E1306C]" />
              <SocialField isEditing={isEditing} icon={<FaLinkedin size={18} />} label="LinkedIn" value={isEditing ? editForm.LinkedIn : profile.LinkedIn} onChange={(v) => setEditForm({ ...editForm, LinkedIn: v })} color="text-[#0077B5]" />
              <SocialField isEditing={isEditing} icon={<FaYoutube size={18} />} label="Youtube" value={isEditing ? editForm.Youtube : profile.Youtube} onChange={(v) => setEditForm({ ...editForm, Youtube: v })} color="text-[#FF0000]" />
              <SocialField isEditing={isEditing} icon={<FaGithub size={18} />} label="GitHub" value={isEditing ? editForm.GitHub : profile.GitHub} onChange={(v) => setEditForm({ ...editForm, GitHub: v })} color="text-black" />
            </div>

            {/* ERROR MESSAGE DISPLAY */}
            {errorMessage && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                ⚠️ {errorMessage}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <FollowHandler />
              {/* 4. ACTION BUTTONS */}
              {isEditing ? (
                // --- EDIT MODE: SAVE BUTTON ---
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex w-full justify-center items-center gap-2 px-4 py-3 md:px-6 md:py-4 text-base md:text-lg font-bold text-white bg-[#04644C] rounded-xl hover:bg-[#03523F] transition-all shadow-md disabled:opacity-70 active:scale-[0.98]"
                >
                  {isSaving ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck size={16} /> Save Changes
                    </>
                  )}
                </button>
              ) : (
                // --- VIEW MODE: NEW POST & EDIT PROFILE ---
                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 md:gap-4">

                  <NavLink to="/publishTest/post/new" className="w-full">
                    <button className="flex w-full justify-center items-center gap-2 px-4 py-3 md:px-4 md:py-3 text-base md:text-lg font-bold text-white bg-[#04644C] rounded-xl hover:opacity-95 shadow-sm active:scale-[0.98] transition-transform">
                      <Plus size={20} />
                      <span>New Post</span>
                    </button>
                  </NavLink>

                  <button
                    onClick={toggleEdit}
                    className="flex w-full justify-center items-center gap-2 px-4 py-3 md:px-4 md:py-3 text-base md:text-lg font-bold text-white bg-tertiary rounded-xl hover:opacity-95 shadow-sm active:scale-[0.98] transition-transform"
                  >
                    <FaPen size={14} />
                    <span>Edit Profile</span>
                  </button>


                </div>
              )}
            </div>
          </div>
        </div>


        {/* --- TAB ISLAND (Published vs Drafts) --- */}
        <div className="grid grid-cols-2 w-full p-2 items-center justify-center bg-gray-100/80 backdrop-blur-md border border-white/50 rounded-full shadow-inner mx-auto mt-2">

          {/* Published Button */}
          <button
            onClick={() => setPostFilter("published")}
            className={`
      px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300
      ${postFilter === "published"
                ? "bg-white text-[#04644C] shadow-sm ring-1 ring-black/5" // Active Style
                : "text-gray-400 hover:text-gray-600 bg-transparent"       // Inactive Style
              }
    `}
          >
            Published
          </button>

          {/* Drafts Button */}
          <button
            onClick={() => setPostFilter("drafts")}
            className={`
      px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300
      ${postFilter === "drafts"
                ? "bg-white text-[#b08746] shadow-sm ring-1 ring-black/5" // Active Style
                : "text-gray-400 hover:text-gray-600 bg-transparent"       // Inactive Style
              }
    `}
          >
            Drafts
          </button>

        </div>

        {/* <button
          onClick={() =>
            setPostFilter((prev) =>
              prev === "drafts" ? "published" : "drafts"
            )
          }
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors
      ${postFilter === "published" ? "bg-[#04644C]" : "bg-[#b08746]"}
    `}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform
        ${postFilter === "published" ? "translate-x-7" : "translate-x-1"}
      `}
          />
        </button> */}
        {/* </div> */}

        {/* POSTS */}
        <div className="w-full max-w-5xl divide-y divide-surface-stroke">
          {posts
            .filter((post) =>
              postFilter === "drafts"
                ? post.published === false
                : post.published === true
            ).map((post) => (
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
    </div>
  );
};

export default EditProfilePage;

// import { useState, useEffect, useRef } from "react";
// import { NavLink } from "react-router-dom";
// import { Link2, Plus, Loader2 } from "lucide-react";
// import { PiXLogoFill } from "react-icons/pi";
// import { FaInstagram, FaLinkedin, FaYoutube, FaGithub, FaPen, FaCheck, FaExclamationCircle } from "react-icons/fa";
// import { Post } from "../../components/desktop";
// import { useProfileDetails } from "../../hooks/useProfileDetails";
// import { SocialField } from "../../components/desktop/profileSection/SocialField";
// import { ProfileBanner, ProfileAvatar } from "../../components/desktop/profileSection/ProfileVisuals";
// import { FollowHandler } from "../../components/mini_components";

// const PROFILE_BASE_URL = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";
// const CONTENT_BASE_URL = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content";

// const EditProfilePage = () => {
//   const { profile, loading, updateProfile } = useProfileDetails();

//   const [editForm, setEditForm] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [previews, setPreviews] = useState({ picture: "", banner: "" });
//   const [errorMessage, setErrorMessage] = useState("");

//   const [isNewUser, setIsNewUser] = useState(false);
//   const [handleStatus, setHandleStatus] = useState("idle");

//   // ---------------- INITIALIZATION ----------------
//   // useEffect(() => {
//   //   if (profile) {
//   //     // Initialize form with backend data
//   //     setEditForm(profile);
//   //     setPreviews({ picture: profile.picture, banner: profile.banner });

//   //     // ✅ FIX 1: STRICT ONBOARDING CHECK
//   //     // Only force Edit Mode if the handle is genuinely missing.
//   //     // Once a handle exists, this block will never run again.
//   //     if (!profile.handle || profile.handle.trim() === "") {
//   //       setIsNewUser(true);
//   //       setIsEditing(true);
//   //       setErrorMessage("Please choose a unique username to continue.");
//   //     }
//   //   }
//   // }, [profile]);


// // ---------------- HANDLE CHECKER ----------------
// useEffect(() => {
//   if (!isEditing || !editForm.handle) return;

//   if (profile?.handle && editForm.handle === profile.handle) {
//     setHandleStatus("available");
//     return;
//   }

//   setHandleStatus("checking");

//   const delayDebounceFn = setTimeout(async () => {
//     try {
//       const res = await fetch(`${PROFILE_BASE_URL}/profiles/handle/${editForm.handle}`);
//       if (res.ok) {
//         setHandleStatus("taken");
//       } else {
//         setHandleStatus("available");
//       }
//     } catch (error) {
//       setHandleStatus("available");
//     }
//   }, 500);

//   return () => clearTimeout(delayDebounceFn);
// }, [editForm.handle, isEditing, profile]);


//   // ---------------- POSTS LOGIC ----------------
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(0);
//   const [loadingPosts, setLoadingPosts] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const loadMoreRef = useRef(null);

//   useEffect(() => {
//     if (!profile?.handle) return;
//     if (loadingPosts || !hasMore) return;

//     const fetchPosts = async () => {
//       setLoadingPosts(true);
//       try {
//         const res = await fetch(
//           `${CONTENT_BASE_URL}?publishedOnly=true&page=${page}&size=20&sort=createdAt,DESC`
//         );
//         if (!res.ok) throw new Error("Failed to fetch posts");
//         const data = await res.json();
//         const filteredPosts = data.content.filter(
//           (post) => post.author?.handle === profile.handle
//         );
//         setPosts((prev) => [...prev, ...filteredPosts]);
//         if (data.last === true) setHasMore(false);
//       } catch (err) {
//         console.error("Error loading posts:", err);
//       } finally {
//         setLoadingPosts(false);
//       }
//     };
//     fetchPosts();
//   }, [page, profile?.handle]);

//   useEffect(() => {
//     if (!loadMoreRef.current || loadingPosts || !hasMore) return;
//     const observer = new IntersectionObserver(
//       ([entry]) => { if (entry.isIntersecting) setPage((p) => p + 1); },
//       { rootMargin: "200px" }
//     );
//     observer.observe(loadMoreRef.current);
//     return () => observer.disconnect();
//   }, [loadingPosts, hasMore]);


//   // ---------------- HANDLERS ----------------

//   const handleFileChange = (e, field) => {
//     const file = e.target.files[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setPreviews((prev) => ({ ...prev, [field === 'avatarFile' ? 'picture' : 'banner']: url }));
//       setEditForm((prev) => ({ ...prev, [field]: file }));
//     }
//   };

// const handleBioChange = (e) => {
//   const val = e.target.value;
//   if (val.length <= 100) {
//     setEditForm({ ...editForm, bio: val });
//   }
// };

// const handleSave = async () => {
//   setErrorMessage("");

//   if (!editForm.name?.trim()) {
//     setErrorMessage("Display Name is required.");
//     return;
//   }
//   if (!editForm.handle?.trim()) {
//     setErrorMessage("Username is required.");
//     return;
//   }

//   if (handleStatus === "taken") {
//     setErrorMessage("This username is already taken.");
//     return;
//   }
//   if (handleStatus === "checking") {
//     setErrorMessage("Please wait for username check to finish.");
//     return;
//   }

//   setIsSaving(true);
//   try {
//     await updateProfile(editForm);
//     setIsEditing(false);
//     setIsNewUser(false);
//   } catch (error) {
//     console.error("Save Error:", error);
//     setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
//   } finally {
//     setIsSaving(false);
//   }
// };

//   const toggleEdit = () => {
//     if (isNewUser) return; // Prevent canceling if new user

//     if (!isEditing) {
//       setEditForm(profile);
//       setErrorMessage("");
//     }
//     setIsEditing(!isEditing);
//   };

//   if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

//   return (
//     <div className="flex flex-col lg:px-[min(3em,3.5%)] items-center gap-4 pb-20">

//       {/* 1. BANNER */}
//       <ProfileBanner
//         banner={previews.banner}
//         isEditing={isEditing}
//         onUpload={(e) => handleFileChange(e, "bannerFile")}
//         onUrlChange={(url) => {
//           setPreviews(prev => ({ ...prev, banner: url }));
//           setEditForm(prev => ({ ...prev, banner: url, bannerFile: null }));
//         }}
//       />

//       <div className="w-full mx-auto px-4 sm:px-6 relative -mt-20">
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
//           <div className="flex flex-col gap-8 p-6 md:p-10">

//             {/* 2. HEADER SECTION */}
//             <div className="flex flex-col md:flex-row justify-between items-start gap-4">

//               {/* Left: Text Inputs */}
//               <div className="flex-1 w-full order-2 md:order-1 pt-10 md:pt-0">
//                 {isEditing ? (
//                   <div className="max-w-md space-y-5">

//                     {/* Display Name */}
//                     <div>
//                       <label className="text-xs uppercase font-bold text-gray-500 mb-1 flex justify-between">
//                         <span>Display Name <span className="text-red-500">*</span></span>
//                       </label>
//                       <input
//                         value={editForm.name || ""}
//                         onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
//                         className="w-full text-2xl font-bold text-[#000A07] border-b-2 border-gray-200 focus:border-[#04644C] outline-none py-1 bg-transparent placeholder-gray-300"
//                         placeholder="Your Name"
//                       />
//                     </div>

//                     {/* Username */}
// <div>
//   <label className="text-xs uppercase font-bold text-gray-500 mb-1 flex justify-between">
//     <span>Username <span className="text-red-500">*</span></span>
//     <span className="text-xs normal-case">
//       {handleStatus === "checking" && <span className="text-gray-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Checking...</span>}
//       {handleStatus === "taken" && <span className="text-red-500 font-bold">Unavailable</span>}
//       {handleStatus === "available" && <span className="text-green-600 font-bold">Available</span>}
//     </span>
//   </label>
//   <div className="flex items-center relative">
//     <span className="text-gray-400 text-lg mr-1 absolute left-0">@</span>
//     <input
//       value={editForm.handle || ""}
//       onChange={(e) => setEditForm({ ...editForm, handle: e.target.value.toLowerCase().replace(/\s/g, '') })}
//       className={`w-full text-lg pl-6 border-b-2 outline-none py-1 bg-transparent placeholder-gray-300 transition-colors
//         ${handleStatus === 'taken' ? 'border-red-300 text-red-600' : 'border-gray-200 text-gray-700 focus:border-[#04644C]'}
//       `}
//       placeholder="username"
//     />
//   </div>
// </div>

//                     {/* Bio Input */}
//       <div>
//         <label className="text-xs uppercase font-bold text-gray-500 mb-1 flex justify-between">
//           <span>Bio</span>
//           <span className={`text-[10px] ${editForm.bio?.length === 100 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
//             {editForm.bio?.length || 0}/100
//           </span>
//         </label>
//         <textarea
//           value={editForm.bio || ""}
//           onChange={handleBioChange}
//           className="w-full text-base text-gray-700 border-b-2 border-gray-200 focus:border-[#04644C] outline-none py-1 bg-transparent resize-none h-24 placeholder-gray-300 leading-relaxed"
//           placeholder="Tell us a little about yourself..."
//         />
//       </div>
//     </div>
//   ) : (
//     <div>
//       <h1 className="text-4xl font-bold text-[#000A07] mb-1">{profile.name || "User Name"}</h1>
//       <p className="text-xl text-gray-500 mb-6">@{profile.handle || "handle"}</p>

//       {profile.bio && (
//         <p className="text-gray-700 leading-relaxed max-w-2xl whitespace-pre-wrap">
//           {profile.bio}
//         </p>
//       )}
//     </div>
//   )}
// </div>

//               {/* Right: Avatar */}
//               <div className="order-1 md:order-2 shrink-0 mx-auto md:mx-0">
//                 <ProfileAvatar
//                   picture={previews.picture}
//                   isEditing={isEditing}
//                   onUpload={(e) => handleFileChange(e, "avatarFile")}
//                 />
//               </div>
//             </div>

//             {/* ✅ FIX 2: CORRECT BACKEND PROPERTY NAMES */}
//             {/* The keys here (xhandle, instagramHandle etc.) MUST match your backend DB columns */}
//             <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
//                <SocialField isEditing={isEditing} icon={<Link2 size={18} />} label="website" value={isEditing ? editForm.website : profile.website} onChange={(v) => setEditForm({ ...editForm, website: v })} color="text-gray-700" />
//               <SocialField isEditing={isEditing} icon={<PiXLogoFill size={18} />} label="X" value={isEditing ? editForm.X : profile.X} onChange={(v) => setEditForm({ ...editForm, X: v })} color="text-black" />
//               <SocialField isEditing={isEditing} icon={<FaInstagram size={18} />} label="Instagram" value={isEditing ? editForm.Instagram : profile.Instagram} onChange={(v) => setEditForm({ ...editForm, Instagram: v })} color="text-[#E1306C]" />
//               <SocialField isEditing={isEditing} icon={<FaLinkedin size={18} />} label="LinkedIn" value={isEditing ? editForm.LinkedIn : profile.LinkedIn} onChange={(v) => setEditForm({ ...editForm, LinkedIn: v })} color="text-[#0077B5]" />
//               <SocialField isEditing={isEditing} icon={<FaYoutube size={18} />} label="Youtube" value={isEditing ? editForm.Youtube : profile.Youtube} onChange={(v) => setEditForm({ ...editForm, Youtube: v })} color="text-[#FF0000]" />
//               <SocialField isEditing={isEditing} icon={<FaGithub size={18} />} label="GitHub" value={isEditing ? editForm.GitHub : profile.GitHub} onChange={(v) => setEditForm({ ...editForm, GitHub: v })} color="text-black" />
//             </div>

//             {/* ERROR MESSAGE DISPLAY */}
//             {errorMessage && (
//               <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
//                 <FaExclamationCircle /> {errorMessage}
//               </div>
//             )}

//             <div className="flex flex-col gap-1">
//               {!isNewUser && <FollowHandler />}

//               {/* 4. ACTION BUTTONS */}
//               {isEditing ? (
//                 <button
//                   onClick={handleSave}
//                   disabled={isSaving || handleStatus === 'taken' || handleStatus === 'checking'}
//                   className="flex w-full justify-center items-center gap-2 px-4 py-3 md:px-6 md:py-4 text-base md:text-lg font-bold text-white bg-[#04644C] rounded-xl hover:bg-[#03523F] transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
//                 >
//                   {isSaving ? (
//                     <>
//                       <Loader2 size={20} className="animate-spin" />
//                       <span>Saving...</span>
//                     </>
//                   ) : (
//                     <>
//                       <FaCheck size={16} /> {isNewUser ? "Create Profile" : "Save Changes"}
//                     </>
//                   )}
//                 </button>
//               ) : (
//                 <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 md:gap-4">
//                   <NavLink to="/publishTest/post/new" className="w-full">
//                     <button className="flex w-full justify-center items-center gap-2 px-4 py-3 md:px-4 md:py-3 text-base md:text-lg font-bold text-white bg-[#04644C] rounded-xl hover:opacity-95 shadow-sm active:scale-[0.98] transition-transform">
//                       <Plus size={20} />
//                       <span>New Post</span>
//                     </button>
//                   </NavLink>

//                   <button
//                     onClick={toggleEdit}
//                     className="flex w-full justify-center items-center gap-2 px-4 py-3 md:px-4 md:py-3 text-base md:text-lg font-bold text-white bg-tertiary rounded-xl hover:opacity-95 shadow-sm active:scale-[0.98] transition-transform"
//                   >
//                     <FaPen size={14} />
//                     <span>Edit Profile</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* POSTS */}
//         {!isNewUser && (
//           <div className="w-full max-w-5xl mt-10 divide-y divide-surface-stroke">
//             {posts.map((post) => (
//               <Post
//                 key={post.id}
//                 post={{
//                   ...post,
//                   authorDisplay: `@${profile.handle}`,
//                 }}
//                 currentUserId={null}
//               />
//             ))}

//             <div ref={loadMoreRef} className="h-10" />
//             {loadingPosts && <div className="py-6 text-center text-sm text-gray-500">Loading posts...</div>}
//             {!hasMore && <div className="py-6 text-center text-sm text-gray-400">No more posts</div>}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default EditProfilePage;