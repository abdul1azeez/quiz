// import { User } from "lucide-react";
// import { useState } from "react";
// import { FaCamera, FaLink, FaCloudUploadAlt, FaTimes, FaCheck } from "react-icons/fa";
// import { useProfileDetails } from "../../../hooks/useProfileDetails";
// import { BannerImage } from "../../../assets";

// // --- BANNER COMPONENT ---
// export const ProfileBanner = ({ banner, isEditing, onUpload, onUrlChange }) => {
//     const [showMenu, setShowMenu] = useState(false);
//     const [showUrlInput, setShowUrlInput] = useState(false);
//     const [urlValue, setUrlValue] = useState("");

//     // Handle opening the menu
//     const handleBannerClick = () => {
//         if (isEditing && !showMenu) {
//             setShowMenu(true);
//         }
//     };
    
//     const DEFAULT_BANNER = BannerImage;
//     // Handle submitting the URL
//     const handleUrlSubmit = () => {
//         if (urlValue && onUrlChange) {
//             onUrlChange(urlValue); // Pass string back to parent
//             handleClose();
//         }
//     };

//     // Reset state on close
//     const handleClose = (e) => {
//         e?.stopPropagation();
//         setShowMenu(false);
//         setShowUrlInput(false);
//         setUrlValue("");
//     };

//     return (
//         <div
//             onClick={handleBannerClick}
//             className={`relative w-full h-56 bg-gray-200 overflow-hidden group lg:rounded-b-xl transition-all ${isEditing ? "cursor-pointer" : ""
//                 }`}
//         >
//             {/* BACKGROUND IMAGE */}
//             <img
//                 src={banner || DEFAULT_BANNER}
//                 alt="Banner"
//                 className="w-full h-full object-cover"
//             />

//             {/* 1. HOVER STATE (Only when editing & menu closed) */}
//             {isEditing && !showMenu && (
//                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//                     <span className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
//                         <FaCamera /> Edit Banner
//                     </span>
//                 </div>
//             )}

//             {/* 2. OVERLAY MENU (Active when clicked) */}
//             {isEditing && showMenu && (
//                 <div
//                     className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center animate-in fade-in duration-200"
//                     onClick={(e) => e.stopPropagation()} // Prevent clicking overlay from re-triggering banner click
//                 >
//                     {/* Close Button */}
//                     <button
//                         onClick={handleClose}
//                         className="absolute top-3 right-3 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
//                     >
//                         <FaTimes size={16} />
//                     </button>

//                     {!showUrlInput ? (
//                         /* --- SELECTION MODE --- */
//                         <div className="flex gap-4">
//                             {/* Option A: Upload */}
//                             <label className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 p-4 rounded-xl cursor-pointer text-white transition-all w-32 border border-white/10 hover:border-white/30 hover:-translate-y-1">
//                                 <FaCloudUploadAlt size={24} className="text-gray-200" />
//                                 <span className="text-xs font-bold uppercase tracking-wider">Upload</span>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     className="hidden"
//                                     onChange={(e) => {
//                                         onUpload(e);
//                                         handleClose();
//                                     }}
//                                 />
//                             </label>

//                             {/* Option B: Link */}
//                             <button
//                                 onClick={() => setShowUrlInput(true)}
//                                 className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 p-4 rounded-xl cursor-pointer text-white transition-all w-32 border border-white/10 hover:border-white/30 hover:-translate-y-1"
//                             >
//                                 <FaLink size={24} className="text-gray-200" />
//                                 <span className="text-xs font-bold uppercase tracking-wider">Link</span>
//                             </button>
//                         </div>
//                     ) : (
//                         /* --- URL INPUT MODE --- */
//                         <div className="flex flex-col items-center gap-3 w-full max-w-md px-6">
//                             <span className="text-white text-sm font-medium">Paste image URL</span>
//                             <div className="flex w-full gap-2">
//                                 <input
//                                     type="text"
//                                     value={urlValue}
//                                     onChange={(e) => setUrlValue(e.target.value)}
//                                     placeholder="https://..."
//                                     className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-white/50 placeholder-white/30"
//                                     autoFocus
//                                 />
//                                 <button
//                                     onClick={handleUrlSubmit}
//                                     className="bg-white text-black px-4 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
//                                 >
//                                     <FaCheck />
//                                 </button>
//                             </div>
//                             <button
//                                 onClick={() => setShowUrlInput(false)}
//                                 className="text-white/50 text-xs hover:text-white underline mt-1"
//                             >
//                                 Back to options
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// // --- AVATAR COMPONENT ---

// export const ProfileAvatar = ({ picture, isEditing, onUpload }) => {
//     const { profile } = useProfileDetails();
//     const getInitials = (name) => {
//         if (!name) return null;
//         const parts = name.trim().split(/\s+/); // Split by spaces
//         if (parts.length === 0) return null;
//         // Get first letter of first name + first letter of last name
//         const first = parts[0][0];
//         const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
//         return (first + last).toUpperCase();
//     };
//     return (
//         <div className="relative group w-40 h-40 -mt-32">
//             <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-md flex items-center justify-center">
//                 {picture ? (
//                     // 1. PRIORITY: Image
//                     <img
//                         src={picture}
//                         alt="Profile"
//                         className="w-full h-full object-cover"
//                     />
//                 ) : profile?.name ? (
//                     // 2. FALLBACK A: Initials
//                     <span className="text-5xl font-bold text-gray-500 select-none">
//                         {getInitials(profile.name)}
//                     </span>
//                 ) : (
//                     // 3. FALLBACK B: Default Icon
//                     <User className="w-1/2 h-1/2 text-gray-400" />
//                 )}
//             </div>
//             {isEditing && (
//                 <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10">
//                     <FaCamera size={24} />
//                     <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
//                 </label>
//             )}
//         </div>
//     );
// };


import { User } from "lucide-react";
import { useState } from "react";
import { FaCamera, FaLink, FaCloudUploadAlt, FaTimes, FaCheck } from "react-icons/fa";
import { useProfileDetails } from "../../../hooks/useProfileDetails";
import { BannerImage } from "../../../assets";
import ImageEditorModal from "../editor/ImageEditorModal";
// Import the Editor we just created (assuming it's in the same file or imported)
// import ImageEditorModal from "./ImageEditorModal"; 

// --- SHARED LOGIC: Handle File Selection ---
const useImageEditor = (onUpload) => {
    const [editorState, setEditorState] = useState({ isOpen: false, imageSrc: null });

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setEditorState({ isOpen: true, imageSrc: reader.result });
            });
            reader.readAsDataURL(file);
        }
        // Clear input value so same file can be selected again if needed
        e.target.value = null; 
    };

    const handleEditorSave = (croppedFile) => {
        // Mock a synthetic event to match your original onUpload signature
        const syntheticEvent = { target: { files: [croppedFile] } };
        onUpload(syntheticEvent);
        setEditorState({ isOpen: false, imageSrc: null });
    };

    const handleEditorCancel = () => {
        setEditorState({ isOpen: false, imageSrc: null });
    };

    return { editorState, handleFileSelect, handleEditorSave, handleEditorCancel };
};


// --- BANNER COMPONENT ---
export const ProfileBanner = ({ banner, isEditing, onUpload, onUrlChange }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlValue, setUrlValue] = useState("");
    const DEFAULT_BANNER = BannerImage;

    // Use our custom hook for editing logic
    const { editorState, handleFileSelect, handleEditorSave, handleEditorCancel } = useImageEditor(onUpload);

    const handleBannerClick = () => {
        if (isEditing && !showMenu) setShowMenu(true);
    };

    const handleUrlSubmit = () => {
        if (urlValue && onUrlChange) {
            onUrlChange(urlValue);
            handleClose();
        }
    };

    const handleClose = (e) => {
        e?.stopPropagation();
        setShowMenu(false);
        setShowUrlInput(false);
        setUrlValue("");
    };

    return (
        <>
            {/* EDITOR MODAL INJECTION */}
            {editorState.isOpen && (
                <ImageEditorModal 
                    imageSrc={editorState.imageSrc} 
                    aspect={3 / 1} // Wide aspect ratio for Banners
                    onCancel={handleEditorCancel} 
                    onSave={handleEditorSave} 
                />
            )}

            <div
                onClick={handleBannerClick}
                className={`relative w-full h-56 bg-gray-200 overflow-hidden group lg:rounded-b-xl transition-all ${isEditing ? "cursor-pointer" : ""}`}
            >
                <img
                    src={banner || DEFAULT_BANNER}
                    alt="Banner"
                    className="w-full h-full object-cover"
                />

                {/* 1. HOVER STATE */}
                {isEditing && !showMenu && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
                            <FaCamera /> Edit Banner
                        </span>
                    </div>
                )}

                {/* 2. OVERLAY MENU */}
                {isEditing && showMenu && (
                    <div
                        className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center animate-in fade-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
                        >
                            <FaTimes size={16} />
                        </button>

                        {!showUrlInput ? (
                            <div className="flex gap-4">
                                {/* Option A: Upload (Modified to trigger Editor) */}
                                <label className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 p-4 rounded-xl cursor-pointer text-white transition-all w-32 border border-white/10 hover:border-white/30 hover:-translate-y-1">
                                    <FaCloudUploadAlt size={24} className="text-gray-200" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Upload</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            handleFileSelect(e); // Step 1: Select & Read
                                            handleClose();       // Close menu
                                        }}
                                    />
                                </label>

                                {/* Option B: Link */}
                                <button
                                    onClick={() => setShowUrlInput(true)}
                                    className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 p-4 rounded-xl cursor-pointer text-white transition-all w-32 border border-white/10 hover:border-white/30 hover:-translate-y-1"
                                >
                                    <FaLink size={24} className="text-gray-200" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Link</span>
                                </button>
                            </div>
                        ) : (
                            /* URL INPUT MODE (Unchanged) */
                            <div className="flex flex-col items-center gap-3 w-full max-w-md px-6">
                                <span className="text-white text-sm font-medium">Paste image URL</span>
                                <div className="flex w-full gap-2">
                                    <input
                                        type="text"
                                        value={urlValue}
                                        onChange={(e) => setUrlValue(e.target.value)}
                                        placeholder="https://..."
                                        className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-white/50 placeholder-white/30"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleUrlSubmit}
                                        className="bg-white text-black px-4 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
                                    >
                                        <FaCheck />
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowUrlInput(false)}
                                    className="text-white/50 text-xs hover:text-white underline mt-1"
                                >
                                    Back to options
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

// --- AVATAR COMPONENT ---

const SIZE_CONFIG = {
    sm: { 
        container: "w-10 h-10", 
        text: "text-sm", 
        border: "border-2", 
        icon: 16, // size in px for Lucide icons
        margin: "mt-0" 
    },
    md: { 
        container: "w-20 h-20", 
        text: "text-2xl", 
        border: "border-2", 
        icon: 32,
        margin: "mt-0" 
    },
    lg: { 
        container: "w-32 h-32", 
        text: "text-4xl", 
        border: "border-4", 
        icon: 48,
        margin: "mt-0" 
    },
    xl: { 
        container: "w-40 h-40", 
        text: "text-5xl", 
        border: "border-4", 
        icon: 64,
        margin: "-mt-32" // Preserves your specific profile page layout
    }
};

export const ProfileAvatar = ({ picture, isEditing, onUpload, size = "xl" }) => {
    const { profile } = useProfileDetails();
    
    // Get styles based on size prop (fallback to xl if undefined)
    const config = SIZE_CONFIG[size] || SIZE_CONFIG.xl;
    
    // Use our custom hook for editing logic
    const { editorState, handleFileSelect, handleEditorSave, handleEditorCancel } = useImageEditor(onUpload);

    const getInitials = (name) => {
        if (!name) return null;
        const parts = name.trim().split(/\s+/);
        if (parts.length === 0) return null;
        const first = parts[0][0];
        const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
        return (first + last).toUpperCase();
    };

    return (
        <>
            {/* EDITOR MODAL INJECTION */}
            {editorState.isOpen && (
                <ImageEditorModal 
                    imageSrc={editorState.imageSrc} 
                    aspect={1} 
                    onCancel={handleEditorCancel} 
                    onSave={handleEditorSave} 
                />
            )}

            {/* DYNAMIC CONTAINER */}
            <div className={`relative group ${config.container} ${config.margin}`}>
                <div className={`w-full h-full rounded-full ${config.border} border-white overflow-hidden bg-gray-100 shadow-md flex items-center justify-center`}>
                    {picture ? (
                        <img src={picture} alt="Profile" className="w-full h-full object-cover" />
                    ) : profile?.name ? (
                        <span className={`${config.text} font-bold text-gray-500 select-none`}>
                            {getInitials(profile.name)}
                        </span>
                    ) : (
                        <User size={config.icon} className="text-gray-400" />
                    )}
                </div>
                
                {/* EDIT OVERLAY (Only shows if isEditing is true) */}
                {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <FaCamera size={size === 'sm' ? 12 : 24} />
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileSelect} 
                        />
                    </label>
                )}
            </div>
        </>
    );
};