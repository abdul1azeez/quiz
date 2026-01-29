import { useState, useEffect } from "react";
import PublishPostNavbar from "../Navbar/PublishPostNavbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import axios from "axios";

import RichTextEditor from "../editor/RichTextEditor";

export default function PublishPost() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);

  // This state matches the backend API format
  const [postData, setPostData] = useState({
    title: "",
    subtitle: "",
    sectionId: "",
    body: "",
  });

  // Update handler for controlled inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.isAuthenticated) {
      return alert("You must be logged in.");
    }

    if (!postData.title.trim()) return alert("Title is required.");
    if (!postData.body.trim()) return alert("Body cannot be empty.");

    setLoading(true);

    try {
      const payload = {
        ...postData,
        published: true, // backend expects this
      };

      const res = await axios.post(
        "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content",
        payload,
        { headers: { Authorization: `Bearer ${auth.user.id_token}` } }
      );

      navigate(`/post/${res.data.id}`, { state: { post: res.data } });

    } catch (err) {
      console.error(err);
      alert("Error creating post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PublishPostNavbar />
      Title
      Subtitle
      <RichTextEditor
        value={postData.body}
        onChange={(html) => setPostData({ ...postData, body: html })}
      />
      
      {/* <form onSubmit={handleSubmit} className="w-full p-8"> */}

      {/* Title */}
      {/* <input
          name="title"
          placeholder="Title"
          value={postData.title}
          onChange={handleChange}
          className="w-full text-4xl font-bold outline-none"
        /> */}

      {/* Subtitle */}
      {/* <input
          name="subtitle"
          placeholder="Add subtitle..."
          value={postData.subtitle}
          onChange={handleChange}
          className="w-full mt-3 text-lg outline-none"
        /> */}

      {/* Rich Text Editor */}
      {/* <div className="mt-10">
          <RichTextEditor
            value={postData.body}
            onChange={(html) => setPostData({ ...postData, body: html })}
          />
        </div> */}

      {/* Submit */}
      {/* <button
          type="submit"
          disabled={loading}
          className="mt-10 bg-black text-white px-6 py-2 rounded-md"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form> */}
    </div>
  );
}