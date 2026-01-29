import { BottomNavbar, FeaturedArticle, LeftNavbar, TopNavbar } from "../components/desktop"
import { Outlet, useLocation } from "react-router-dom"
import SignInModal from "../components/desktop/auth/SignInModal";
import { useState } from "react";

import { useAuth } from "react-oidc-context";
import MobileSidebar from "../components/desktop/Navbar/MobileSidebar";
import { useProfileDetails } from "../hooks/useProfileDetails";




const RootLayout = () => {
  const location = useLocation();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // --- Route Logic ---
  const hideLeftNavbarRoutes = ["/post/", "/publish/", "/publishTest/", "/edit-post"];
  const shouldHideNavbar = hideLeftNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const hideTopNavbarRoutes = ["/profile"];
  const shouldHideTopNavbar = hideTopNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const isHomePage = location.pathname === "/";

  // Forward Sidebar Scroll to Main Container
  const handleSidebarScroll = (e) => {
    const mainContainer = document.getElementById("main-scroll-container");
    if (mainContainer) {
      // scrollBy adds the scroll amount (deltaY) to the current position
      // 'behavior: auto' ensures it feels instant and responsive
      mainContainer.scrollBy({ top: e.deltaY, behavior: "auto" });
    }
  };

  const auth = useAuth();
  const { profile } = useProfileDetails();
  const myHandle = profile?.handle || auth.user?.profile?.preferred_username;

  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile Sidebar State


  return (
    <div className="bg-gray-50 h-screen lg:mx-8 flex flex-col md:flex-row relative">

      {/* LEFT NAVBAR */}
      {!shouldHideNavbar && (
        <aside
          onWheel={handleSidebarScroll}
          className="z-30 hidden md:block justify-center md:w-64 shrink-0"
        >
          <LeftNavbar
            openSignIn={() => setIsSignInModalOpen(true)}
            auth={auth}
            profile={profile}
            myHandle = {myHandle} />
        </aside>
      )}

      {/* MAIN CONTENT AREA */}
      <div id="main-scroll-container" className="flex-1 relative overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* DIM OVERLAY */}
        {isSignInModalOpen && (
          <div className="absolute inset-0 z-40 pointer-events-none"></div>
        )}

        {/* TOP NAVBAR */}
        {!shouldHideNavbar && (
          <div className={`z-20 w-full justify-center ${shouldHideTopNavbar ? 'md:hidden' : ''}`}>
            <TopNavbar
              auth={auth}
              setIsMenuOpen={setIsMenuOpen} />
          </div>
        )}

        {/* --- MOBILE: SIDEBAR MENU --- */}
        <MobileSidebar
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          auth={auth}
          profile={profile} 
          myHandle = {myHandle}/>

        {/* LAYOUT CONTAINER */}
        <div className="flex w-full">

          <main className="flex-1 min-w-0">
            <Outlet context={{ openSignIn: () => setIsSignInModalOpen(true) }} />
          </main>

          {/* RIGHT SIDEBAR */}
          {isHomePage && (
            <aside className="sticky top-0 hidden lg:block w-80 shrink-0 h-screen overflow-y-auto pl-4 pb-10">
              <FeaturedArticle />
            </aside>
          )}

        </div>
      </div>

      {/* GLOBAL MODAL */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />

      <BottomNavbar  profile={profile} auth={auth} myHandle={myHandle} />
    </div>
  );
};

export default RootLayout;