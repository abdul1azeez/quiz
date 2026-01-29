import { NavLink } from "react-router-dom";
import { FullLogo_Light, Logo_Emblem_Light } from "../../../assets";
import { navLinks } from "../../../constants/navLinks";
import NavItems from "../../../shared/NavItems";
import { LogIn, Plus } from "lucide-react";

const LeftNavbar = ({ openSignIn, auth, profile, myHandle }) => {

  return (
    <nav className="h-screen flex flex-col items-center">

      {/* Logo */}
      <div className="logo flex w-full h-24 justify-center items-center px-4">
        <a href="/">
          <img
            className="cursor-pointer w-40"
            src={FullLogo_Light}
            alt="LogoLightMode"
          />
        </a>
      </div>

      {/* Main Section */}
      <div className="h-fit p-4 py-4 transition-all duration-300 ease-in-out z-50 backdrop-blur-md bg-white/60 border border-overlay-background rounded-4xl flex flex-col justify-between gap-4">

        {/* Create Button */}
        <div className="flex justify-center items-center w-full">
          {auth.isAuthenticated ? (
            <NavLink to="/publishTest/post/:postID">
              <button className="bg-button-primary text-surface-base px-3 py-3 rounded-lg w-52 flex justify-center items-center gap-2 hover:opacity-95">
                <Plus /> Create
              </button>
            </NavLink>
          ) : (
            <button
              onClick={openSignIn}
              className="bg-button-primary text-surface-base px-3 py-3 rounded-lg w-52 flex justify-center items-center gap-2 hover:opacity-95"
            >
              <Plus /> Create
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <ul className="menu flex flex-col items-start px-4 gap-2 h-fit w-full">
          {navLinks.map((link) => (
            <li key={link.to} className="w-full">
              <NavItems link={link} orientation="vertical" />
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-1">
          {/* about button */}
          <div className="flex justify-center items-center w-full">
            <NavLink to="/about-us" className="w-full flex justify-center">
              {({ isActive }) => (
                <button
                  className={`px-3 py-2 rounded-3xl w-52 flex justify-start items-center gap-2 transition-all group
          ${isActive
                      ? "bg-[#04644C]/10 text-black font-bold border border-[#04644C]/20" // ACTIVE STYLES
                      : "text-black hover:bg-button-primary/20" // INACTIVE STYLES
                    }
        `}
                >
                  {/* Icon Container */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center overflow-hidden transition-colors
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
          <div className="hidden md:block shrink-0">

            {!auth.isAuthenticated && (
              <button
                onClick={() => auth.signinRedirect()}
                className="bg-button-primary text-surface-base px-3 py-3 rounded-xl w-52 flex justify-center items-center gap-2 hover:opacity-95"
              >
                <span>Sign In</span>
                <LogIn size={16} />
              </button>
            )}
          </div>

          {/* Profile Button - Only renders if authenticated */}
          {auth.isAuthenticated && (
            <div className="flex justify-center items-center w-full">
              <NavLink to={`/profile/${myHandle}`} className="w-full flex justify-center">
                {({ isActive }) => (
                  <button
                    className={`px-3 py-2 rounded-3xl w-52 flex justify-start items-center gap-2 transition-all group
            ${isActive
                        ? "bg-[#04644C]/10 text-black font-bold border border-[#04644C]/20" // Active
                        : "text-black hover:bg-button-primary/20" // Inactive
                      }
          `}
                  >
                    {/* Icon Container */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-colors
              ${isActive
                          ? "bg-white shadow-sm"
                          : "bg-surface-base group-hover:bg-white"
                        }
            `}
                    >
                      <img
                        src={profile?.picture || Logo_Emblem_Light}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-lg">Profile</span>
                  </button>
                )}
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LeftNavbar;
