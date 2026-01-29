// import { AuthContext } from 'react-oidc-context';
// import { FullLogo_Light } from '../../../assets';
// import { navLinks } from '../../../constants/navLinks';
// import NavItems from "../../../shared/NavItems";
// import { NavLink } from 'react-router';
// import { LogIn, Sparkles } from 'lucide-react';



// const MobileSidebar = ({ isMenuOpen, setIsMenuOpen, auth, profile }) => {

//     return (
//         <>
//             {/* ==============================
//           MOBILE SIDEBAR OVERLAY
//        ============================== */}
//             <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
//                 onClick={() => setIsMenuOpen(false)} />

//             {/* ==============================
//           MOBILE SIDEBAR DRAWER
//        ============================== */}
//             <aside
//                 className={`fixed top-0 left-0 h-full w-72 bg-white/90 backdrop-blur-2xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
//                     }`}
//             >
//                 {/* Navigation Links */}
//                 <div className="flex flex-col p-2 gap-1">
//                     <a href="/">
//                         <img
//                             className="cursor-pointer w-40"
//                             src={FullLogo_Light}
//                             alt="LogoLightMode"
//                         />
//                     </a>

//                     {/* CREATE POST BUTTON (Only if logged in) */}
//                     {AuthContext.isAuthenticated && (
//                         <NavLink
//                             to="/publishTest/post/new" // Fixed path (removed :postID which is for viewing)
//                             onClick={() => setIsMenuOpen(false)}
//                             className="bg-button-primary text-white font-medium px-4 py-3 rounded-xl hover:bg-black transition flex items-center gap-3 justify-center mb-4 shadow-md"
//                         >
//                             <Upload className="w-4 h-4" />
//                             Create Post
//                         </NavLink>
//                     )}

//                     {/* NAV ITEMS
//                     {[
//                         { label: "Home", to: "/", icon: HomeIcon_Active },
//                         { label: "Explore", to: "/explore", icon: CompassIcon_Active },
//                         { label: "Notifications", to: "/notifications", icon: NotificationIcon_Active },
//                         { label: "About MINE", to: "/about-us", icon: Logo_Emblem_Light },
//                         // 👇 CONDITIONALLY ADD PROFILE LINK
//                         ...(auth.isAuthenticated ? [{
//                             label: "Profile",
//                             to: "/profile",
//                             // Use user picture or fallback to Logo if missing
//                             icon: profile?.picture || Logo_Emblem_Light
//                         }] : []),
//                     ].map((item) => (
//                         <NavLink
//                             key={item.label}
//                             to={item.to}
//                             onClick={() => setIsMenuOpen(false)}
//                             className={({ isActive }) => `
//         font-medium px-4 py-3 rounded-xl transition flex items-center gap-3
//         ${isActive
//                                     ? "bg-[#04644C]/10 text-black font-bold border border-[#04644C]/20" // Active Style (Matches Desktop)
//                                     : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//                                 }
//       `}
//                         >
//                             <img src={item.icon} alt={item.label} className="w-6 aspect-square rounded-full object-cover" />
//                             {item.label}
//                         </NavLink>
//                     ))} */}

//                     <ul className="menu flex flex-col items-start px-4 gap-5 h-fit w-full">
//                         {navLinks.map((link) => (
//                             <li key={link.to} className="w-full">
//                                 <NavLink to={link} className={({ isActive }) => `
//         font-medium px-4 py-3 rounded-xl transition flex items-center gap-3
//         ${isActive
//                                         ? "bg-[#04644C]/10 text-black font-bold border border-[#04644C]/20" // Active Style (Matches Desktop)
//                                         : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//                                     }
//       `}>
//                                     <NavItems
//                                         link={link}
//                                         onClick={() => setIsMenuOpen(false)} />
//                                 </NavLink>
//                             </li>
//                         ))}
//                     </ul>

//                     {/* Profile Button - Only renders if authenticated */}
//                     {auth.isAuthenticated && (
//                         <div className="flex justify-center items-center w-full">
//                             <NavLink to="/profile" className="w-full flex justify-center">
//                                 {({ isActive }) => (
//                                     <button
//                                         className={`px-3 py-2 rounded-3xl w-52 flex justify-start items-center gap-2 transition-all group
//             ${isActive
//                                                 ? "bg-[#04644C]/10 text-black font-bold border border-[#04644C]/20" // Active
//                                                 : "text-black hover:bg-button-primary/20" // Inactive
//                                             }
//           `}
//                                     >
//                                         {/* Icon Container */}
//                                         <div
//                                             className={`w-6 h-6 rounded-full flex items-center justify-center overflow-hidden transition-colors
//               ${isActive
//                                                     ? "bg-white shadow-sm"
//                                                     : "bg-surface-base group-hover:bg-white"
//                                                 }
//             `}
//                                         >
//                                             <img
//                                                 src={profile?.picture || Logo_Emblem_Light}
//                                                 alt="Profile"
//                                                 className="w-full h-full object-cover"
//                                             />
//                                         </div>
//                                         <span>Profile</span>
//                                     </button>
//                                 )}
//                             </NavLink>
//                         </div>
//                     )}

//                     {/* COMING SOON QUIZ */}
//                     <div className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 bg-gray-50 border border-dashed border-gray-200 cursor-not-allowed mt-2">
//                         <Sparkles size={18} />
//                         <div className="flex flex-col leading-none">
//                             <span className="font-medium text-sm">MINE Quiz</span>
//                             <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Coming Soon</span>
//                         </div>
//                     </div>
//                 </div>

// {/* Bottom Auth Section (Mobile Only) */}
// <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100 bg-gray-50/50">
//     {!auth.isAuthenticated ? (
//         <button
//             className="w-full bg-button-primary text-white font-medium py-3 rounded-xl hover:bg-button-secondary-700 transition-all flex items-center justify-center gap-2 shadow-sm"
//             onClick={() => {
//                 auth.signinRedirect();
//                 setIsMenuOpen(false);
//             }}
//         >
//             <span>Sign In</span>
//             <LogIn size={18} />
//         </button>
//     ) : (
//         <button
//             className="w-full p-2.5 bg-red-500 text-red-50 rounded-full transition-colors flex gap-2 items-center justify-center"
//             onClick={() => {
//                 // Step 1: Go to home first (prevents protected route triggering)
//                 window.location.href = "/";

//                 // Step 2: Remove user AFTER redirect begins
//                 setTimeout(() => {
//                     auth.removeUser();
//                 });
//                 setIsMenuOpen(false);
//             }}

//         >
//             <span>Sign Out</span>
//             <LogOut size={18} />
//         </button>
//     )}
// </div>
//             </aside>
//         </>
//     )
// }

// export default MobileSidebar


import { NavLink } from 'react-router-dom'; // Use react-router-dom for web
import { LogIn, LogOut, Sparkles, Upload } from 'lucide-react';
import { FullLogo_Light, Logo_Emblem_Light } from '../../../assets';
import { navLinks } from '../../../constants/navLinks';
import NavItems from "../../../shared/NavItems";

const MobileSidebar = ({ isMenuOpen, setIsMenuOpen, auth, profile, myHandle }) => {

    return (
        <>
            {/* OVERLAY */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* DRAWER */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white/90 backdrop-blur-2xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Scrollable Area */}
                <div className="flex flex-col h-full">

                    {/* TOP SECTION */}
                    <div className="flex flex-col p-4 gap-4 overflow-y-auto flex-1">

                        {/* LOGO */}
                        <a href="/">
                            <img
                                className="cursor-pointer w-32"
                                src={FullLogo_Light}
                                alt="Logo"
                            />
                        </a>

                        {/* CREATE POST (Only if logged in) */}
                        {/* ✅ FIX: Use 'auth.isAuthenticated', not AuthContext */}
                        {auth.isAuthenticated && (
                            <NavLink
                                to="/publishTest/post/new"
                                onClick={() => setIsMenuOpen(false)}
                                className="bg-[#04644C] text-white font-medium px-4 py-3 rounded-xl hover:bg-[#03523F] transition flex items-center gap-3 justify-center shadow-md"
                            >
                                <Upload className="w-4 h-4" />
                                Create Post
                            </NavLink>
                        )}

                        {/* NAV ITEMS LIST */}
                        <ul className="flex flex-col gap-2 w-full">
                            {navLinks.map((link) => (
                                <li key={link.alt} className="w-full">
                                    <div
                                        // Assuming navLinks has 'to' property
                                        onClick={() => setIsMenuOpen(false)}
                                        
                                    >
                                        {/* Assuming NavItems renders the icon and label */}
                                        <NavItems link={link} />
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* about button */}
                        <div className="flex justify-center items-center w-full">
                            <NavLink onClick={() => setIsMenuOpen(false)} to="/about-us" className="w-full flex justify-center">
                                {({ isActive }) => (
                                    <button
                                        className={`w-full px-3 py-2 rounded-3xl flex justify-start items-center gap-2 transition-all
                                            ${isActive
                                                ? "bg-[#04644C]/10 text-black font-bold border border-[#04644C]/20"
                                                : "text-black hover:bg-gray-100"
                                            }
                                        `}
                                    >
                                        {/* Icon Container */}
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden transition-colors
                                    ${isActive
                                                    ? "bg-white shadow-sm" // Active: White bg + shadow
                                                    : "bg-surface-base group-hover:bg-white" // Inactive: Gray, White on Hover
                                                }
                                  `}
                                        >
                                            <img
                                                src={Logo_Emblem_Light}
                                                alt="About"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        </div>
                                        <span>About MINE</span>
                                    </button>
                                )}
                            </NavLink>
                        </div>

                        {/* PROFILE BUTTON (Only if logged in) */}
                        {auth.isAuthenticated && (
                            <NavLink to={`/profile/${myHandle}`}>
                                {({ isActive }) => (
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`w-full px-3 py-2 rounded-3xl flex justify-start items-center gap-2 transition-all
                                            ${isActive
                                                ? "bg-[#04644C]/10 text-black font-bold border border-[#04644C]/20"
                                                : "text-black hover:bg-gray-100"
                                            }
                                        `}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${isActive ? "bg-white" : "bg-gray-200"}`}>
                                            <img
                                                src={profile?.picture || FullLogo_Light}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span>Profile</span>
                                    </button>
                                )}
                            </NavLink>
                        )}

                        {/* COMING SOON */}
                        <div className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 bg-gray-50 border border-dashed border-gray-200 cursor-not-allowed">
                            <Sparkles size={18} />
                            <div className="flex flex-col leading-none">
                                <span className="font-medium text-sm">MINE Quiz</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Coming Soon</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Auth Section (Mobile Only) */}
                    <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100 bg-gray-50/50">
                        {!auth.isAuthenticated ? (
                            <button
                                className="w-full bg-button-primary text-white font-medium py-3 rounded-xl hover:bg-button-secondary-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                                onClick={() => {
                                    auth.signinRedirect();
                                    setIsMenuOpen(false);
                                }}
                            >
                                <span>Sign In</span>
                                <LogIn size={18} />
                            </button>
                        ) : (
                            <button
                                className="w-full p-2.5 bg-red-500 text-red-50 rounded-full transition-colors flex gap-2 items-center justify-center"
                                onClick={() => {
                                    // Step 1: Go to home first (prevents protected route triggering)
                                    window.location.href = "/";

                                    // Step 2: Remove user AFTER redirect begins
                                    setTimeout(() => {
                                        auth.removeUser();
                                    });
                                    setIsMenuOpen(false);
                                }}

                            >
                                <span>Sign Out</span>
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}

export default MobileSidebar;



