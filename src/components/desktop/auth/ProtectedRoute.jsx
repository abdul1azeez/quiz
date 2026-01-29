// import { useAuth } from "react-oidc-context";
// import { useOutletContext } from "react-router-dom";
// import { useState, useEffect } from "react";

// export default function ProtectedRoute({ children }) {
//   const auth = useAuth();
//   const { openSignIn } = useOutletContext(); // from RootLayout

//   const [hasShownModal, setHasShownModal] = useState(false);

//   if (auth.isLoading) return <div>Loading...</div>;

//   // 🚫 Not authenticated → show message + sign-in modal
//   if (!auth.isAuthenticated) {
//     // prevent repeated triggering
//     if (!hasShownModal) {
//       setHasShownModal(true);
//       openSignIn();
//     }

//     return (
//       <div className="text-center mt-20 text-gray-700">
//         <h2 className="text-xl font-semibold mb-2">
//           You’re trying to access a private page
//         </h2>
//         <p className="text-gray-500">
//           Please sign in to continue.
//         </p>
//       </div>
//     );
//   }

//   return children;
// }



import { useAuth } from "react-oidc-context";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();

  // ✅ FIX: Safely get context. Returns null if used outside RootLayout.
  const context = useOutletContext();
  const openSignIn = context?.openSignIn;

  const [hasTriggeredAuth, setHasTriggeredAuth] = useState(false);

  if (auth.isLoading) return <div className="p-10 text-center">Loading...</div>;

  // 🚫 Not authenticated
  if (!auth.isAuthenticated) {
    // Prevent infinite loop of calls
    if (!hasTriggeredAuth) {
      setHasTriggeredAuth(true);

      // ✅ LOGIC: Try opening the UI modal first. 
      // If context is missing (e.g. Admin Panel), fall back to direct redirect.
      if (openSignIn) {
        openSignIn();
      } else {
        console.warn("ProtectedRoute: No layout context found. Redirecting directly.");
        auth.signinRedirect();
      }
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Access Restricted
        </h2>
        <p className="text-gray-500">
          You need to sign in to view this page.
        </p>
        {/* Optional Manual Button in case auto-trigger fails */}
        <button
          onClick={() => auth.signinRedirect()}
          className="mt-4 px-6 py-2 bg-[#04644C] text-white rounded-lg hover:bg-[#03523F] transition"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return children;
}