import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router";

const PublishPostNavbar = ({ onPublish, loading }) => {
  const navigate = useNavigate();
  return (
    <div className="flex w-full justify-between items-center p-4 lg:px-10 border-b-2 border-gray-200 z-20 bg-white sticky top-0">
      <button
        className="menuHeading font-bold text-lg p-3 bg-gray-200 rounded-xl cursor-pointer hover:bg-gray-300 transition"
        onClick={() => navigate(-1)}
      >
        <MoveLeft />
      </button>

      <div className="flex gap-3 items-center text-sm">
        {/* <button className="previewButton cursor-pointer border border-brand-primary rounded-xl p-2 w-20 text-brand-primary hover:bg-gray-50 transition">
          Preview
        </button> */}
        <button
          onClick={onPublish}
          disabled={loading}
          className={`publishButton cursor-pointer rounded-xl p-2 w-20 text-surface-banner transition 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-brand-primary hover:bg-opacity-90"}`}
        >
          {loading ? "..." : "Publish"}
        </button>
      </div>
    </div>
  );
};

export default PublishPostNavbar;