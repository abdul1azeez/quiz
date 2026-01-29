import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { useAuth } from "react-oidc-context";
import "./index.css";

// ------------ Layouts ------------
  import RootLayout from "./layout/RootLayout";
  import AdminLayout from "./layout/AdminLayout"

// ------------ Admin Pages ------------
  import UserManagement from "./pages/admin/UserManagement";
  import ContentManagement from "./pages/admin/ContentManagement";

// ------------ MAIN PAGES AND COMPONENTS -------------
  // -------( Pages )-------
  import { Home, Explore, Notifications, EditProfilePage, NotFound, AboutPage } from "./pages/desktop";
  import UniversalProfile from "./components/desktop/profileSection/UniversalPrfofile";
  import PublicProfilePage from "./pages/desktop/PublicProfilePage";
  // -------( Components )-------
  import Activity from "./pages/desktop/Activity";
  import { LoginCard } from "./components/desktop";
  import PostExpanded from "./components/desktop/postSection/PostExpanded";
  import EditPost from "./components/desktop/postSection/EditPost";
  import RichTextEditor2 from "./components/desktop/editor/RichTextEditor2";
  import PublishPostTest from "./components/desktop/postSection/PublishPostTest";
  import AddArticle from "./components/desktop/featuredSection/AddArticle";
  import ProtectedRoute from "./components/desktop/auth/ProtectedRoute";
  import CreatorsPage from "./pages/desktop/CreatorsPage";


// ------------------------
// Main App Component
// ------------------------
function App() {
  const auth = useAuth();

  // Save Cognito & CMS tokens
  useEffect(() => {
    const saveTokens = async () => {
      if (!auth.isAuthenticated) return;

      const idToken = auth.user?.id_token;
      if (!idToken) return;

      // Save Cognito JWT
      localStorage.setItem("cognito_jwt", idToken);

      try {
        // Exchange Cognito token → CMS token
        const res = await fetch(
          "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/auth/cognito",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cognitoToken: idToken }),
          }
        );

        if (!res.ok) {
          console.error("Failed to exchange token. Status:", res.status);
          return;
        }

        const data = await res.json();
        localStorage.setItem("cms_token", data.token);

        // Fetch user profile & store userId
        const profileRes = await fetch(
          "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/profiles/me",
          {
            headers: { Authorization: `Bearer ${idToken}` },
          }
        );

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          localStorage.setItem("userId", profileData.userId);
          localStorage.setItem("userHandle", profileData.handle);
          //console.log("user id token:", profileData.userId);
          //console.log("jwt:", auth.user?.id_token);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    saveTokens();
  }, [auth.isAuthenticated, auth.user]);

  // Clear tokens on logout
  useEffect(() => {
    if (!auth.isAuthenticated) {
      localStorage.removeItem("cognito_jwt");
      localStorage.removeItem("cms_token");
      localStorage.removeItem("userId");
    }
  }, [auth.isAuthenticated]);

  // ------------------------
  // Router setup
  // ------------------------
  const router = createBrowserRouter([

    //  --- Admin Routes ---
    {
      path: "/admin",
      // Ideally create a <AdminRoleGuard> wrapper here that checks  if(user.roles.includes("ADMIN")) 
      element: ( <ProtectedRoute> <AdminLayout /> </ProtectedRoute> ),
      // element: <AdminLayout />,
      children: [
        { index: true, element: <div>Admin Dashboard Overview</div> }, // Default /admin
        { path: "users", element: <UserManagement /> },
        { path: "content", element: <ContentManagement /> }, // Create this similarly
        { path: "approvals", element: <div>Approvals Page</div> },
        { path: "system", element: <div>System Tools</div> },
      ]
    },


    // --- Main Routes ---
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },

        // 🔓 PUBLIC LOGIN PAGE (must NOT be protected)
        { path: "login", element: <LoginCard /> },

        { path: "profile/:handle", element: <UniversalProfile /> },

        // 🔓 PUBLIC PROFILE (by handle)
        // { path: "profile/:handle", element: <PublicProfilePage /> },


        // 🔒 PROTECTED ROUTES
        // {
        //   path: "profile", element: (
        //     <ProtectedRoute>
        //       <EditProfilePage />
        //     </ProtectedRoute>
        //   )
        // },

        {
          path: "publishTest/post/:postID", element: (
            <ProtectedRoute>
              <PublishPostTest />
            </ProtectedRoute>
          )
        },

        {
          path: "myActivity", element: (
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          )
        },

        // 🔓 PUBLIC ROUTES
        // { path: "post/:id", element: <PostExpanded /> },
        { path: "post/:slug", element: <PostExpanded /> },
        { path: "edit-post/:id", element: <EditPost /> },
        { path: "explore", element: <Explore /> },
        { path: "editor", element: <RichTextEditor2 /> },
        { path: "notifications", element: <Notifications /> },
        { path: "addArticle", element: <AddArticle /> },
        { path: "mine-creators", element: <CreatorsPage /> },
        { path: "about-us", element: <AboutPage /> },
        { path: "*", element: <NotFound /> },

      ],
    },
  ]);

  return (
    <div className="bg-[#f9fafb]"> <RouterProvider router={router} /> </div>);
}

export default App;
