// import { useState, useEffect } from "react";
// import { useAuth } from "react-oidc-context";

// const API_BASE = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";

// export const useProfileDetails = () => {
//   const auth = useAuth();
//   const [loading, setLoading] = useState(true);

//   // Initial state matching UI needs
//   const [profile, setProfile] = useState({
//     name: "",
//     handle: "",
//     bio: "",
//     email: "",
//     picture: "",
//     banner: "",
//     website: "",
//     Instagram: "",
//     X: "",
//     Youtube: "",
//     LinkedIn: "",
//     GitHub: "",
//   });

//   const getToken = () => auth.user?.id_token || localStorage.getItem("cognito_jwt");

//   // --- LOAD PROFILE ---
//   useEffect(() => {
//     const loadProfile = async () => {
//       if (!auth.isAuthenticated && !localStorage.getItem("cognito_jwt")) {
//         setLoading(false);
//         return;
//       }

//       const token = getToken();
//       if (!token) return setLoading(false);

//       try {
//         const res = await fetch(`${API_BASE}/profiles/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error("Failed to fetch");

//         const data = await res.json();

//         // Map Backend Response -> UI State
//         setProfile({
//           name: data.displayName || "",
//           handle: data.handle || "",
//           email: data.email || "",
//           bio: data.bio || "",

//           picture: data.avatarUrl || data.pictureUrl || "",
//           banner: data.bannerUrl || "",

//           website: data.website || "",
//           // Note: Backend returns these keys, ensure we map them back correctly
//           Instagram: data.instagramHandle || "",
//           X: data.xHandle || data.xhandle || data.twitterHandle || "",
//           Youtube: data.youtubeHandle || "",
//           LinkedIn: data.linkedinUrl || "",
//           GitHub: data.githubHandle || "",
//         });
//       } catch (err) {
//         console.error("Failed to load profile:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProfile();
//   }, [auth.isAuthenticated]);

//   // --- UPLOAD MEDIA ---
//   const uploadMedia = async (file, type = "AVATAR") => {
//     const token = getToken();
//     if (!token) throw new Error("Not logged in");

//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await fetch(`${API_BASE}/media/upload?type=${type}`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     });

//     if (!res.ok) throw new Error(`${type} upload failed`);
//     const data = await res.json();
//     return data.fullUrl || data.url || data.pictureUrl;
//   };

//   // --- DATA CLEANING HELPERS ---

//   // 1. Clean Handles: Removes URL parts, '@', and trims.
//   const cleanHandle = (input) => {
//     if (!input || !input.trim()) return null; // Send null if empty to avoid "min length 1" errors

//     let value = input.trim();

//     // Strip URL if present
//     if (value.includes("http") || value.includes(".com") || value.includes("www.")) {
//       try {
//         // Mock a protocol if missing to use URL parser
//         const urlStr = value.startsWith("http") ? value : `https://${value}`;
//         const url = new URL(urlStr);
//         const parts = url.pathname.split("/").filter(Boolean);
//         // Return the last segment (usually the username)
//         if (parts.length > 0) value = parts[parts.length - 1];
//       } catch (e) {
//         // If URL parsing fails, fall back to regex cleaning
//       }
//     }

//     // Remove '@' prefix and query params
//     return value.replace(/^@/, "").split("?")[0];
//   };

//   // 2. Format URLs: Ensures full valid URL
//   const formatLinkedInUrl = (input) => {
//     if (!input || !input.trim()) return null;
//     if (input.startsWith("http")) return input;
//     return `https://www.linkedin.com/in/${input.replace(/^@/, '')}`;
//   };

//   const formatWebsiteUrl = (input) => {
//     if (!input || !input.trim()) return null;
//     if (input.startsWith("http")) return input;
//     return `https://${input}`;
//   };

//   // --- UPDATE PROFILE ---
//   const updateProfile = async (formData) => {
//     const token = getToken();
//     if (!token) throw new Error("Not logged in");

//     // 1. VALIDATION
//     if (!formData.name || !formData.name.trim()) throw new Error("Display Name is required");
//     if (!formData.handle || !formData.handle.trim()) throw new Error("Username is required");

//     // 2. HANDLE UPLOADS
//     let finalAvatar = formData.picture;
//     let finalBanner = formData.banner;

//     try {
//       if (formData.avatarFile) finalAvatar = await uploadMedia(formData.avatarFile, "AVATAR");
//       if (formData.bannerFile) finalBanner = await uploadMedia(formData.bannerFile, "BANNER");
//     } catch (error) {
//       console.error("Upload failed", error);
//       throw new Error("Image upload failed");
//     }

//     // 3. PREPARE PAYLOAD (Cleaned & Formatted)
//     const payload = {
//       // Identity
//       displayName: formData.name,
//       handle: formData.handle,
//       bio: formData.bio || "",
//       email: formData.email,

//       // Images
//       avatarUrl: finalAvatar || "",
//       pictureUrl: finalAvatar || "",
//       bannerUrl: finalBanner || "",

//       // Links (Must be valid URLs or null)
//       website: formatWebsiteUrl(formData.website),
//       linkedinUrl: formatLinkedInUrl(formData.LinkedIn),

//       // Handles (Must be pure usernames or null)
//       instagramHandle: cleanHandle(formData.Instagram),
//       xHandle: cleanHandle(formData.X),       // Fixed key: xHandle (was xhandle)
//       twitterHandle: cleanHandle(formData.X), // Fallback
//       youtubeHandle: cleanHandle(formData.Youtube),
//       githubHandle: cleanHandle(formData.GitHub),

//       // Backend Requirements
//       location: "",
//       profilePublic: true,
//       showEmail: false,
//       emailNotifications: true,
//       pushNotifications: true
//     };

//     // 4. SEND PUT REQUEST
//     const res = await fetch(`${API_BASE}/profiles/me`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error("API Error:", errorText);
//       throw new Error(`Update failed: ${errorText}`);
//     }

//     // 5. UPDATE LOCAL STATE
//     setProfile((prev) => ({
//       ...prev,
//       ...formData,
//       picture: finalAvatar,
//       banner: finalBanner,
//       avatarFile: null,
//       bannerFile: null,
//     }));
//   };

//   return { profile, loading, updateProfile };
// };

import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";

const API_BASE = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";

export const useProfileDetails = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);

  // Initial state
  const [profile, setProfile] = useState({
    name: "",
    handle: "",
    bio: "",
    email: "",
    picture: "",
    banner: "",
    website: "",
    Instagram: "",
    X: "",
    Youtube: "",
    LinkedIn: "",
    GitHub: "",
  });

  const getToken = () => auth.user?.id_token || localStorage.getItem("cognito_jwt");

  // --- LOAD PROFILE ---
  useEffect(() => {
    const loadProfile = async () => {
      if (!auth.isAuthenticated && !localStorage.getItem("cognito_jwt")) {
        setLoading(false);
        return;
      }

      const token = getToken();
      if (!token) return setLoading(false);

      try {
        const res = await fetch(`${API_BASE}/profiles/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        setProfile({
          name: data.displayName || "",
          handle: data.handle || "",
          email: data.email || "",
          bio: data.bio || "",
          picture: data.avatarUrl || data.pictureUrl || "",
          banner: data.bannerUrl || "",
          website: data.website || "",
          Instagram: data.instagramHandle || "",
          X: data.xHandle || data.xhandle || data.twitterHandle || "",
          Youtube: data.youtubeHandle || "",
          LinkedIn: data.linkedinUrl || "",
          GitHub: data.githubHandle || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [auth.isAuthenticated]);

  // --- VALIDATION HELPERS ---

  const validateFile = (file, type) => {
    if (!file) return;
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`${type === 'AVATAR' ? 'Profile picture' : 'Banner'} must be a JPG, PNG, or WEBP image.`);
    }
    if (file.size > MAX_SIZE) {
      throw new Error(`${type === 'AVATAR' ? 'Profile picture' : 'Banner'} is too large. Max size is 5MB.`);
    }
  };

  const validateUrl = (urlString) => {
    if (!urlString) return true; // Empty is valid (optional field)
    try {
      // If it doesn't start with http, strictly speaking it's invalid for new URL(), 
      // but our formatter handles that. We check the final formatted version.
      const testUrl = urlString.startsWith("http") ? urlString : `https://${urlString}`;
      new URL(testUrl);
      return true;
    } catch (e) {
      return false;
    }
  };

  // --- UPLOAD MEDIA ---
  const uploadMedia = async (file, type = "AVATAR") => {
    const token = getToken();
    if (!token) throw new Error("Not logged in");

    // 1. Validate File locally
    validateFile(file, type);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/media/upload?type=${type}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
        throw new Error(`Failed to upload image. Please try a different file.`);
    }
    const data = await res.json();
    return data.fullUrl || data.url || data.pictureUrl;
  };

  // --- DATA CLEANING & FORMATTING ---

  const cleanHandle = (input) => {
    if (!input || !input.trim()) return null;
    let value = input.trim();
    // Strip URL logic
    if (value.includes("http") || value.includes(".com") || value.includes("www.")) {
      try {
        const urlStr = value.startsWith("http") ? value : `https://${value}`;
        const url = new URL(urlStr);
        const parts = url.pathname.split("/").filter(Boolean);
        if (parts.length > 0) value = parts[parts.length - 1];
      } catch (e) { /* ignore */ }
    }
    // Remove characters that usually aren't allowed in handles
    return value.replace(/^@/, "").split("?")[0];
  };

  const formatLinkedInUrl = (input) => {
    if (!input || !input.trim()) return null;
    if (input.startsWith("http")) return input;
    return `https://www.linkedin.com/in/${input.replace(/^@/, '')}`;
  };

  const formatWebsiteUrl = (input) => {
    if (!input || !input.trim()) return null;
    if (input.startsWith("http")) return input;
    return `https://${input}`;
  };

  // --- UPDATE PROFILE ---
  const updateProfile = async (formData) => {
    const token = getToken();
    if (!token) throw new Error("Not logged in");

    // --- STEP 1: CLIENT-SIDE VALIDATION ---

    // Display Name
    if (!formData.name || formData.name.trim().length < 2) {
      throw new Error("Display Name must be at least 2 characters long.");
    }

    // Username / Handle
    if (!formData.handle || formData.handle.trim().length < 3) {
      throw new Error("Username must be at least 3 characters long.");
    }
    // Regex: Alphanumeric, dots, underscores only
    const handleRegex = /^[a-zA-Z0-9._]+$/;
    if (!handleRegex.test(formData.handle)) {
      throw new Error("Username can only contain letters, numbers, dots (.), and underscores (_).");
    }

    // Website
    if (formData.website && !validateUrl(formData.website)) {
      throw new Error("Website must be a valid URL.");
    }

    // Bio
    if (formData.bio && formData.bio.length > 500) { // Assuming a limit
        throw new Error("Bio cannot exceed 500 characters.");
    }

    // --- STEP 2: HANDLE MEDIA UPLOADS ---
    let finalAvatar = formData.picture;
    let finalBanner = formData.banner;

    try {
      if (formData.avatarFile) finalAvatar = await uploadMedia(formData.avatarFile, "AVATAR");
      if (formData.bannerFile) finalBanner = await uploadMedia(formData.bannerFile, "BANNER");
    } catch (error) {
      console.error("Upload failed", error);
      throw error; // Re-throw the specific validation error from uploadMedia
    }

    // --- STEP 3: PREPARE PAYLOAD ---
    const payload = {
      displayName: formData.name,
      handle: formData.handle,
      bio: formData.bio || "",
      email: formData.email,
      avatarUrl: finalAvatar || "",
      pictureUrl: finalAvatar || "",
      bannerUrl: finalBanner || "",
      
      website: formatWebsiteUrl(formData.website),
      linkedinUrl: formatLinkedInUrl(formData.LinkedIn),
      
      instagramHandle: cleanHandle(formData.Instagram),
      xHandle: cleanHandle(formData.X), 
      xhandle: cleanHandle(formData.X), 
      twitterHandle: cleanHandle(formData.Twitter), 
      youtubeHandle: cleanHandle(formData.Youtube),
      githubHandle: cleanHandle(formData.GitHub),

      location: "",
      profilePublic: true,
      showEmail: false,
      emailNotifications: true,
      pushNotifications: true
    };

    // --- STEP 4: SEND API REQUEST ---
    const res = await fetch(`${API_BASE}/profiles/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = "Profile update failed.";

      // Attempt to parse Backend Validation Errors (e.g., 400 Bad Request)
      try {
        const errorJson = JSON.parse(errorText);
        
        // Scenario 1: Field-specific details (Your previous error log format)
        if (errorJson.details) {
            // Flatten the details object into a single readable string
            // details: { xHandle: ["Must be ..."], instagramHandle: ["..."] }
            const messages = Object.values(errorJson.details).flat();
            if (messages.length > 0) {
                errorMessage = messages[0]; // Show the first specific error
            }
        } 
        // Scenario 2: Generic message
        else if (errorJson.message) {
            errorMessage = errorJson.message;
        }
      } catch (e) {
        // Fallback if not JSON
        errorMessage = `Update failed: ${res.statusText}`;
      }

      console.error("API Error:", errorText);
      throw new Error(errorMessage);
    }

    // --- STEP 5: UPDATE LOCAL STATE ---
    setProfile((prev) => ({
      ...prev,
      ...formData,
      picture: finalAvatar,
      banner: finalBanner,
      avatarFile: null,
      bannerFile: null,
    }));
  };

  return { profile, loading, updateProfile };
};

// import { useState, useEffect } from "react";
// import { useAuth } from "react-oidc-context";

// const API_BASE = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";

// export const useProfileDetails = () => {
//   const auth = useAuth();
//   const [loading, setLoading] = useState(true);

//   // ✅ FIX 1: Use Backend Property Names
//   // Changed "X", "Instagram" -> "xhandle", "instagramHandle" etc.
//   const [profile, setProfile] = useState({
//     name: "",
//     handle: "",
//     bio: "",
//     email: "",
//     picture: "",
//     banner: "",
//     website: "",
//     instagramHandle: "",
//     xhandle: "",
//     twitterHandle: "",
//     youtubeHandle: "",
//     linkedinUrl: "",
//     githubHandle: "",
//   });

//   const getToken = () => auth.user?.id_token || localStorage.getItem("cognito_jwt");

//   // --- LOAD PROFILE ---
//   useEffect(() => {
//     const loadProfile = async () => {
//       if (!auth.isAuthenticated && !localStorage.getItem("cognito_jwt")) {
//         setLoading(false);
//         return;
//       }

//       const token = getToken();
//       if (!token) return setLoading(false);

//       try {
//         const res = await fetch(`${API_BASE}/profiles/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error("Failed to fetch");

//         const data = await res.json();

//         // ✅ FIX 2: Map API response to correct state keys
//         setProfile({
//           name: data.displayName || "",
//           handle: data.handle || "",
//           email: data.email || "",
//           bio: data.bio || "",
//           picture: data.avatarUrl || data.pictureUrl || "",
//           banner: data.bannerUrl || "",
//           website: data.website || "",
          
//           instagramHandle: data.instagramHandle || "",
//           // Handle various spellings from backend
//           xhandle: data.xHandle || data.xhandle || data.twitterHandle || "",
//           twitterHandle: data.twitterHandle || "",
//           youtubeHandle: data.youtubeHandle || "",
//           linkedinUrl: data.linkedinUrl || "",
//           githubHandle: data.githubHandle || "",
//         });
//       } catch (err) {
//         console.error("Failed to load profile:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProfile();
//   }, [auth.isAuthenticated]);

//   // --- VALIDATION HELPERS ---
//   const validateFile = (file, type) => {
//     if (!file) return;
//     const MAX_SIZE = 5 * 1024 * 1024; // 5MB
//     const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

//     if (!ALLOWED_TYPES.includes(file.type)) {
//       throw new Error(`${type === 'AVATAR' ? 'Profile picture' : 'Banner'} must be a JPG, PNG, or WEBP image.`);
//     }
//     if (file.size > MAX_SIZE) {
//       throw new Error(`${type === 'AVATAR' ? 'Profile picture' : 'Banner'} is too large. Max size is 5MB.`);
//     }
//   };

//   const validateUrl = (urlString) => {
//     if (!urlString) return true;
//     try {
//       const testUrl = urlString.startsWith("http") ? urlString : `https://${urlString}`;
//       new URL(testUrl);
//       return true;
//     } catch (e) {
//       return false;
//     }
//   };

//   // --- UPLOAD MEDIA ---
//   const uploadMedia = async (file, type = "AVATAR") => {
//     const token = getToken();
//     if (!token) throw new Error("Not logged in");

//     validateFile(file, type);

//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await fetch(`${API_BASE}/media/upload?type=${type}`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     });

//     if (!res.ok) {
//         throw new Error(`Failed to upload image. Please try a different file.`);
//     }
//     const data = await res.json();
//     return data.fullUrl || data.url || data.pictureUrl;
//   };

//   // --- DATA CLEANING & FORMATTING ---
//   const cleanHandle = (input) => {
//     if (!input || !input.trim()) return ""; // Return empty string for API consistency
//     let value = input.trim();
//     if (value.includes("http") || value.includes(".com") || value.includes("www.")) {
//       try {
//         const urlStr = value.startsWith("http") ? value : `https://${value}`;
//         const url = new URL(urlStr);
//         const parts = url.pathname.split("/").filter(Boolean);
//         if (parts.length > 0) value = parts[parts.length - 1];
//       } catch (e) { /* ignore */ }
//     }
//     return value.replace(/^@/, "").split("?")[0];
//   };

//   const formatLinkedInUrl = (input) => {
//     if (!input || !input.trim()) return "";
//     if (input.startsWith("http")) return input;
//     return `https://www.linkedin.com/in/${input.replace(/^@/, '')}`;
//   };

//   const formatWebsiteUrl = (input) => {
//     if (!input || !input.trim()) return "";
//     if (input.startsWith("http")) return input;
//     return `https://${input}`;
//   };

//   // --- UPDATE PROFILE ---
//   const updateProfile = async (formData) => {
//     const token = getToken();
//     if (!token) throw new Error("Not logged in");

//     // VALIDATION
//     if (!formData.name || formData.name.trim().length < 2) {
//       throw new Error("Display Name must be at least 2 characters long.");
//     }
//     if (!formData.handle || formData.handle.trim().length < 3) {
//       throw new Error("Username must be at least 3 characters long.");
//     }
//     const handleRegex = /^[a-zA-Z0-9._]+$/;
//     if (!handleRegex.test(formData.handle)) {
//       throw new Error("Username can only contain letters, numbers, dots (.), and underscores (_).");
//     }
//     if (formData.website && !validateUrl(formData.website)) {
//       throw new Error("Website must be a valid URL.");
//     }
//     if (formData.bio && formData.bio.length > 500) {
//         throw new Error("Bio cannot exceed 500 characters.");
//     }

//     // MEDIA UPLOAD
//     let finalAvatar = formData.picture;
//     let finalBanner = formData.banner;

//     try {
//       if (formData.avatarFile) finalAvatar = await uploadMedia(formData.avatarFile, "AVATAR");
//       if (formData.bannerFile) finalBanner = await uploadMedia(formData.bannerFile, "BANNER");
//     } catch (error) {
//       console.error("Upload failed", error);
//       throw error;
//     }

//     // --- PREPARE PAYLOAD ---
//     const payload = {
//       displayName: formData.name,
//       handle: formData.handle,
//       bio: formData.bio || "",
//       email: formData.email,
//       avatarUrl: finalAvatar || "",
//       pictureUrl: finalAvatar || "", // Redundant but safe
//       bannerUrl: finalBanner || "",
      
//       website: formatWebsiteUrl(formData.website),
      
//       // ✅ FIX 3: Read from Correct Property Names
//       linkedinUrl: formatLinkedInUrl(formData.linkedinUrl),
//       instagramHandle: cleanHandle(formData.instagramHandle),
      
//       // ✅ FIX 4: Sync X and Twitter Logic
//       // We send the 'xhandle' value to BOTH fields to ensure data persistence
//       xHandle: cleanHandle(formData.xhandle),
//       xhandle: cleanHandle(formData.xhandle),       // Send lowercase version too just in case
//       twitterHandle: cleanHandle(formData.xhandle), 
      
//       youtubeHandle: cleanHandle(formData.youtubeHandle),
//       githubHandle: cleanHandle(formData.githubHandle),

//       // Static/Default fields
//       location: "",
//       profilePublic: true,
//       showEmail: false,
//       emailNotifications: true,
//       pushNotifications: true
//     };

//     const res = await fetch(`${API_BASE}/profiles/me`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       let errorMessage = "Profile update failed.";
//       try {
//         const errorJson = JSON.parse(errorText);
//         if (errorJson.details) {
//             const messages = Object.values(errorJson.details).flat();
//             if (messages.length > 0) errorMessage = messages[0];
//         } else if (errorJson.message) {
//             errorMessage = errorJson.message;
//         }
//       } catch (e) {
//         errorMessage = `Update failed: ${res.statusText}`;
//       }
//       throw new Error(errorMessage);
//     }

//     // UPDATE LOCAL STATE
//     setProfile((prev) => ({
//       ...prev,
//       ...formData,
//       picture: finalAvatar,
//       banner: finalBanner,
//       avatarFile: null,
//       bannerFile: null,
//       // Ensure local state reflects the sync
//       twitterHandle: formData.xhandle, 
//     }));
//   };

//   return { profile, loading, updateProfile };
// };