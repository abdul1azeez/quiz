import { MoveLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

const EditPostNavbar = ({ onPublish, loading }) => {
  const navigate = useNavigate();
  return (
    <div className="flex w-full justify-between items-center p-4 px-10 border-b-2 border-gray-200 z-50 bg-[#f9fafb] sticky top-0">
      <Link to="/">
        <button className="menuHeading font-bold text-lg p-3 bg-gray-200 rounded-xl cursor-pointer hover:bg-gray-300 transition">
          <MoveLeft />
        </button>
      </Link>

      <h1 className="text-lg font-semibold">Editing Post</h1>

      <div className="flex gap-3 items-center text-sm">
        <button
          onClick={onPublish}
          disabled={loading}
          className={`publishButton cursor-pointer rounded-xl p-2 w-fit text-surface-banner transition 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-brand-primary hover:bg-opacity-90"}`}
        >
          {loading ? "..." : "Edit and Publish Post"}
        </button>
      </div>
    </div>
  );
};

export default EditPostNavbar;