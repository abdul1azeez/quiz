import { MoveLeft } from "lucide-react"
import { NotificationIcon_NotActive, UploadIcon } from "../../../assets"
import { Link, useNavigate } from "react-router"
import { ShareButton } from "../postSection/postInteractions";



const PostExpandedNavbar = ({ post }) => {

  const navigate = useNavigate();
  return (
    <div className='flex w-full justify-between items-center p-6 lg:px-10 border-b-2 border-gray-200 z-20'>
      <Link to="/">
        <button className="menuHeading font-bold text-lg p-3 bg-gray-200 rounded-xl cursor-pointer hover:bg-gray-300 transition">
          <MoveLeft />
        </button>
      </Link>

      <div className='flex gap-3 items-center w-fit text-sm'>
        {/* <button className='signIn cursor-pointer hover:bg-gray-200 p-2 rounded-full'> <img className="w-7" src={UploadIcon} alt="UploadIcon" /></button> */}
        {/* <button className='createAccount cursor-pointer hover:bg-gray-200 p-2 rounded-full'> <img className="w-7" src={NotificationIcon_NotActive} alt="NotificationIcon" /></button> */}
        <ShareButton post={post} />
        {/* <div className="profilePicture cursor-pointer">
          {post.profilePicture && (
            <img className="profilePicture w-10" src={post.profilePicture} alt="profilePicture" />
          )}
        </div> */}
      </div>
    </div>
  )
}

export default PostExpandedNavbar


// import { MoveLeft } from "lucide-react";
// import { Link } from "react-router-dom";
// import { NotificationIcon_NotActive, UploadIcon } from "../../../assets";

// // Adjust path to where you saved ShareButton.jsx
// import ShareButton from "../postSection/postInteractions/ShareButton"; 

// const PostExpandedNavbar = ({ post }) => {
//   return (
//     <div className='flex w-full justify-between items-center p-6 lg:px-10 border-b-2 border-gray-200 z-20 bg-white'>
      
//       {/* Back Button */}
//       <Link to="/">
//         <button className="menuHeading font-bold text-lg p-3 bg-gray-200 rounded-xl cursor-pointer hover:bg-gray-300 transition">
//           <MoveLeft />
//         </button>
//       </Link>

//       <div className='flex gap-3 items-center w-fit text-sm'>
        
//         {/* ✅ SHARE BUTTON with Custom Upload Icon */}
//         <ShareButton post={post}>
//            <img className="w-7" src={UploadIcon} alt="Share" />
//         </ShareButton>

//         {/* Notifications Button */}
//         <button className='createAccount cursor-pointer hover:bg-gray-200 p-2 rounded-full transition-colors'>
//            <img className="w-7" src={NotificationIcon_NotActive} alt="NotificationIcon" />
//         </button>
        
//       </div>
//     </div>
//   )
// }

// export default PostExpandedNavbar;