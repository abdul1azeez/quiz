
import Searchbar from "./Searchbar"; // Import the Searchbar component
import { useState, useEffect, useRef } from "react";

import { LogIn, LogOut, Menu } from "lucide-react";
import { StreakInfo } from "../../mini_components";




const TopNavbar = ({ auth, setIsMenuOpen }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const searchRef = useRef(null); // Ref for Searchbar from Searchbar.jsx




  // --- 1. Smart Scroll Logic ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // --- 2. Keyboard Shortcut ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* ==============================
          FLOATING NAVBAR
       ============================== */}
      <div className="flex flex-col gap-4 items-center">
        <nav
          className={`z-50 m-4 flex justify-between pointer-events-none transition-transform duration-300 ease-in-out w-full max-w-5xl ${isVisible ? "translate-y-0" : "-translate-y-[200%]"
            }`}
        >
          <div className="pointer-events-auto flex items-center justify-between w-full max-w-5xl mx-3 mt-3 md:mx-6 md:mt-4 gap-3">
            {/* --- SEARCH BAR (Always Visible) --- */}
            <div className="relative flex-1 min-w-0 max-w-2xl group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-100 to-purple-100 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-md" />
              <div className="relative">

                <Searchbar ref={searchRef} />

              </div>
            </div>
            <StreakInfo />
            {/* --- DESKTOP: AUTH BUTTONS (Hidden on Mobile) --- */}
            <div className="hidden md:block shrink-0">

              {!auth.isAuthenticated ? (
                <button
                  onClick={() => auth.signinRedirect()}
                  className="p-2.5 px-4 bg-button-primary text-white rounded-full transition-colors flex gap-1 items-center cursor-pointer hover:opacity-90"
                >
                  <span>Sign In</span>
                  <LogIn size={16} />
                </button>
              ) : (
                <div className="flex items-center gap-1 h-14 bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-full px-2 shadow-sm">
                  <button
                    onClick={() => {
                      // Step 1: Go to home first (prevents protected route triggering)
                      window.location.href = "/";

                      // Step 2: Remove user AFTER redirect begins
                      setTimeout(() => {
                        auth.removeUser();
                      });
                    }}
                    className="p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors flex gap-2 items-center"
                    title="Sign Out"
                  >
                    <span className="text-red-800"> Sign Out </span>
                    <LogOut size={18} color="red" />
                  </button>
                </div>
              )}
            </div>

            {/* --- MOBILE: MENU BUTTON (Visible only on Mobile) --- */}
            <div className="md:hidden shrink-0">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="h-12 w-12 flex items-center justify-center bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <Menu className="text-gray-700" />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default TopNavbar;
