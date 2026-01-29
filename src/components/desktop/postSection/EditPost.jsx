// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "react-oidc-context";
// import { useProfileDetails } from "../../../hooks/useProfileDetails";

// const BASE_URL = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content";

// const EditPost = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const auth = useAuth();
//   const { profile, loading: profileLoading } = useProfileDetails();

//   const accessToken = auth.user?.id_token;
//   const currentUserId =
//     profile?.userId || localStorage.getItem("userId") || null;

//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   // --------------------------------------------
//   // 1️⃣ Fetch post only when token and profile exist
//   // --------------------------------------------
//   useEffect(() => {
//     if (!accessToken || profileLoading) return;

//     const fetchPost = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/${id}`, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });

//         setPost(res.data);
//       } catch (err) {
//         console.error("Failed to load post:", err);
//         setError("Failed to load post.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPost();
//   }, [id, accessToken, profileLoading]);

//   // --------------------------------------------
//   // 2️⃣ UI loading states
//   // --------------------------------------------
//   if (profileLoading || loading)
//     return <p className="text-center py-20">Loading...</p>;

//   if (error)
//     return <p className="text-center py-20 text-red-500">{error}</p>;

//   if (!post)
//     return <p className="text-center py-20">Post not found.</p>;

//   // --------------------------------------------
//   // 3️⃣ Author Guard (Only the owner may edit)
//   // --------------------------------------------
//   if (String(post.author?.id) !== String(currentUserId)) {
//     return (
//       <p className="text-center py-20 text-red-500">
//         You are not authorized to edit this post.
//       </p>
//     );
//   }

//   // --------------------------------------------
//   // 4️⃣ Handle form updates
//   // --------------------------------------------
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPost((prev) => ({ ...prev, [name]: value }));
//   };

//   // --------------------------------------------
//   // 5️⃣ Save post (PUT request)
//   // --------------------------------------------
//   const handleSave = async () => {
//     setSaving(true);
//     setError("");

//     try {
//       await axios.put(
//         `${BASE_URL}/${post.id}`,
//         {
//           title: post.title,
//           subtitle: post.subtitle,
//           section: post.section,
//           body: post.body,
//           authorId: currentUserId,
//           published: post.published,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       navigate(`/post/${post.id}`);
//     } catch (err) {
//       console.error("Failed to update post:", err);
//       setError("Failed to save post.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // --------------------------------------------
//   // 6️⃣ Form UI
//   // --------------------------------------------
//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

//       <div className="flex flex-col gap-4">
//         <div>
//           <label className="block text-sm font-semibold mb-1">Title</label>
//           <input
//             type="text"
//             name="title"
//             value={post.title}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold mb-1">Subtitle</label>
//           <input
//             type="text"
//             name="subtitle"
//             value={post.subtitle || ""}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold mb-1">Section</label>
//           <input
//             type="text"
//             name="section"
//             value={post.section || ""}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold mb-1">Body</label>
//           <textarea
//             name="body"
//             value={post.body}
//             onChange={handleChange}
//             rows={8}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         {error && <p className="text-red-500">{error}</p>}

//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//         >
//           {saving ? "Saving..." : "Save Changes"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EditPost;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "react-oidc-context";
import { useProfileDetails } from "../../../hooks/useProfileDetails";

// Reuse the Navbar and Editor from Publish flow
import EditPostNavbar from "../Navbar/EditPostNavbar";
import RichTextEditor2 from "../editor/RichTextEditor2";
RichTextEditor2
const BASE_URL = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const { profile, loading: profileLoading } = useProfileDetails();

  const accessToken = auth.user?.id_token;
  const currentUserId = profile?.userId || localStorage.getItem("userId");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // State structure matches PublishPostTest for consistency
  const [postData, setPostData] = useState({
    title: "",
    subtitle: "",
    section: "",
    body: "",
    authorId: "",
    published: false,
  });

  // --------------------------------------------
  // 1. Fetch Post Data
  // --------------------------------------------
  useEffect(() => {
    if (!accessToken || profileLoading) return;

    const fetchPost = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = res.data;

        // Populate state
        setPostData({
          id: data.id,
          title: data.title || "",
          subtitle: data.subtitle || "",
          section: data.section || "",
          body: data.body || "",
          authorId: data.author?.id,
          published: data.published
        });

      } catch (err) {
        console.error("Failed to load post:", err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, accessToken, profileLoading]);

  // --------------------------------------------
  // 2. Handlers
  // --------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (html) => {
    setPostData((prev) => ({ ...prev, body: html }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(
        `${BASE_URL}/${id}`,
        {
          title: postData.title,
          subtitle: postData.subtitle,
          section: postData.section,
          body: postData.body,
          authorId: currentUserId,
          published: postData.published,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Navigate back to the read view
      navigate(`/post/${id}`);
    } catch (err) {
      console.error("Failed to update post:", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------
  // 3. UI Renders
  // --------------------------------------------

  if (profileLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  // Author Guard
  if (String(postData.authorId) !== String(currentUserId)) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">You are not authorized to edit this post.</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Using PublishPostNavbar to match the 'PublishPostTest' look.
          We pass handleSave to the onPublish prop.
      */}
      <EditPostNavbar
        onPublish={handleSave}
        loading={saving}
        // Optional: If your navbar supports a custom button label, pass it here. 
        // Otherwise it might say "Publish" which is fine, or you can edit Navbar to accept a label prop.
        buttonLabel="Save Changes"
      />

      <div className="w-full flex justify-center">
        <div className="w-[clamp(20rem,90vw,60rem)] p-8">

          {/* Title Input */}
          <input
            name="title"
            placeholder="Title"
            value={postData.title}
            onChange={handleChange}
            className="w-full text-4xl font-bold outline-none placeholder:text-gray-300 mb-2"
          />

          {/* Subtitle Input */}
          <input
            name="subtitle"
            placeholder="Add subtitle..."
            value={postData.subtitle}
            onChange={handleChange}
            className="w-full text-xl text-gray-500 outline-none placeholder:text-gray-300 mb-6"
          />

          {/* Optional: Section Input (if you want to keep it accessible) */}
          <input
            name="section"
            placeholder="Topic / Section (e.g. Technology)"
            value={postData.section}
            onChange={handleChange}
            className="w-full text-sm text-gray-400 outline-none placeholder:text-gray-200 mb-6 uppercase font-bold tracking-wide"
          />

          {/* Rich Text Editor */}
          {/* Negative margin pulls the toolbar to align nicely with the text */}
          <div className="mt-2 -ml-14">
            <RichTextEditor2
              content={postData.body}
              onChange={handleEditorChange}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditPost;