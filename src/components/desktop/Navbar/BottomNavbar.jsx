//  import { NavLink } from "react-router";

// const BottomNavbar = () => {
//     return (
//         <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full z-10 md:hidden">
//             <ul className="menu flex justify-around items-center h-16">
//                 {navLinks.map((navLink) => (
//                     <li key={navLink.to}>
//                         <NavLink
//                             to={navLink.to}
//                             className={({ isActive }) =>
//                                 `menuItems inline-flex flex-col items-center gap-1 ${isActive ? 'font-bold text-link' : 'font-normal'}`
//                             }
//                         >
//                             {({ isActive }) => (
//                                 <>
//                                     <img
//                                         src={isActive ? navLink.iconActive : navLink.iconNotActive}
//                                         alt={navLink.alt}
//                                     />
//                                     {/* <span>{navLink.alt}</span> */}
//                                 </>
//                             )}
//                         </NavLink>
//                     </li>
//                 ))}
//             </ul>
//         </nav>
//     )
// }

// export default BottomNavbar


import { NavLink } from "react-router-dom"; // Ensure consistent import package
import { navLinks } from "../../../constants/navLinks";
import NavItems from "../../../shared/NavItems";
import { Logo_Emblem_Light } from "../../../assets";
import { User, LogIn } from "lucide-react"; // Assuming you have lucide-react, or use any icon

const BottomNavbar = ({ profile, auth, myHandle }) => {

    // 1. Remove "Notifications" from the standard list so we can replace it
    // (Adjust the string "Notifications" to match exactly what is in your constants file)
    const filteredLinks = navLinks.filter(link => link.alt !== "Notifications");

    return (
        <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full md:hidden pb-safe">
            <ul className="flex justify-around items-center h-16 px-2">

                {/* 2. Render the Standard Links (Home, Explore, etc.) */}
                {filteredLinks.map((link) => (
                    <li key={link.to} className="flex-1 flex justify-center">
                        <NavLink to={link.to}>
                            <NavItems link={link} orientation="horizontal" />
                        </NavLink>
                    </li>
                ))}

                {/* 3. The Dynamic Profile / Login Button */}
                <li className="flex-1 flex justify-center">
                    <NavLink
                        // 1. If logged in, go to profile. If not, put a placeholder "#" so it's still a valid link.
                        to={auth.isAuthenticated ? `/profile/${myHandle}` : "#"}

                        // 2. Handle the click logic here
                        onClick={(e) => {
                            if (!auth.isAuthenticated) {
                                e.preventDefault(); // Stop the router from navigating to "#"
                                auth.signinRedirect(); // Call your auth function
                            }
                        }}

                        className={({ isActive }) =>
                            `p-1 rounded-full transition-all border-2 
        ${isActive && auth.isAuthenticated // Only show active border if actually on profile page
                                ? "border-[#04644C]"
                                : "border-transparent hover:bg-gray-50"
                            }`
                        }
                    >
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                            {auth.isAuthenticated ? (
                                <img
                                    src={profile?.picture || Logo_Emblem_Light}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={Logo_Emblem_Light}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    </NavLink>
                </li>

            </ul>
        </nav>
    );
};

export default BottomNavbar;