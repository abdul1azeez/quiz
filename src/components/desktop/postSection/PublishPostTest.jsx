// import { useState, useEffect } from "react";
// import PublishPostNavbar from "../Navbar/PublishPostNavbar";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "react-oidc-context";
// import axios from "axios";

// import RichTextEditor2 from "../editor/RichTextEditor2";

// export default function PublishPostTest() {
//     const navigate = useNavigate();
//     const auth = useAuth();

//     const [loading, setLoading] = useState(false);

//     // This state matches the backend API format
//     const [postData, setPostData] = useState({
//         title: "",
//         subtitle: "",
//         sectionId: "",
//         body: "",
//     });

//     // Update handler for controlled inputs
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setPostData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!auth.isAuthenticated) {
//             return alert("You must be logged in.");
//         }

//         if (!postData.title.trim()) return alert("Title is required.");
//         if (!postData.body.trim()) return alert("Body cannot be empty.");

//         setLoading(true);

//         try {
//             const payload = {
//                 ...postData,
//                 published: true, // backend expects this
//             };

//             const res = await axios.post(
//                 "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content",
//                 payload,
//                 { headers: { Authorization: `Bearer ${auth.user.id_token}` } }
//             );

//             navigate(`/post/${res.data.id}`, { state: { post: res.data } });

//         } catch (err) {
//             console.error(err);
//             alert("Error creating post.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-white ">
//             <PublishPostNavbar />

//             <form onSubmit={handleSubmit} className="w-full p-8">

//                 {/* Title */}
//                 <input
//                     name="title"
//                     placeholder="Title"
//                     value={postData.title}
//                     onChange={handleChange}
//                     className="w-full text-4xl font-bold outline-none"
//                 />

//                 {/* Subtitle */}
//                 <input
//                     name="subtitle"
//                     placeholder="Add subtitle..."
//                     value={postData.subtitle}
//                     onChange={handleChange}
//                     className="w-full mt-3 text-lg outline-none"
//                 />

//                 {/* Rich Text Editor */}
//                 <div className="mt-10">
//                     <RichTextEditor2
//                         value={postData.body}
//                         onChange={(html) => setPostData({ ...postData, body: html })}
//                     />
//                 </div>

//                 {/* Submit */}
//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="mt-10 bg-black text-white px-6 py-2 rounded-md"
//                 >
//                     {loading ? "Publishing..." : "Publish"}
//                 </button>
//             </form>
//         </div>
//     );
// }

import { useState } from "react";
import PublishPostNavbar from "../Navbar/PublishPostNavbar"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import RichTextEditor2 from "../editor/RichTextEditor2"; // Adjust path if needed

export default function PublishPostTest() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [loading, setLoading] = useState(false);

    // State matches backend API format
    const [postData, setPostData] = useState({
        title: "",
        subtitle: "",
        sectionId: "",
        body: "<p>Start writing...</p>", // Default content
        createdAt: new Date().toISOString(),
    });

    // Handle Input Changes (Title/Subtitle)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle Editor Changes
    const handleEditorChange = (html) => {
        setPostData((prev) => ({ ...prev, body: html }));
    };

    // Submit Logic
    const handleSubmit = async () => {
        // 1. Validation
        if (!auth.isAuthenticated) {
            return alert("You must be logged in.");
        }
        if (!postData.title.trim()) return alert("Title is required.");

        // Check if body is empty or just contains empty p tags
        if (!postData.body || postData.body === "<p></p>") {
            return alert("Body cannot be empty.");
        }

        setLoading(true);

        try {
            const payload = {
                ...postData,
                published: true,
                createdAt: new Date().toISOString(),
            };

            const res = await axios.post(
                "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content",
                payload,
                { headers: { Authorization: `Bearer ${auth.user.id_token}` } }
            );

            // Navigate to the new post
            navigate(`/post/${res.data.id}`, { state: { post: res.data } });

        } catch (err) {
            console.error(err);
            alert("Error creating post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            {/* Pass the submit handler and loading state to Navbar */}
            <PublishPostNavbar onPublish={handleSubmit} loading={loading} />

            <div className="w-full flex justify-center">
                <div className="w-[clamp(20rem,90vw,60rem)] p-8">

                    {/* Title Input */}
                    <input
                        name="title"
                        placeholder="Title"
                        value={postData.title}
                        onChange={handleChange}
                        className="w-full text-4xl font-bold outline-none placeholder:text-gray-300"
                    />

                    {/* Subtitle Input */}
                    <input
                        name="subtitle"
                        placeholder="Add subtitle..."
                        value={postData.subtitle}
                        onChange={handleChange}
                        className="w-full mt-3 text-base text-gray-500 outline-none placeholder:text-gray-300"
                    />

                    {/* Rich Text Editor */}
                    <div className="mt-6 -ml-14">
                        <RichTextEditor2
                            content={postData.body}
                            onChange={handleEditorChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}