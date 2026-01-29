// import { PenTool, ArrowLeft, Star } from "lucide-react";
// import { Link } from "react-router-dom";

// const CreatorsPage = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">

//       {/* 1. ANIMATED ICON CONTAINER */}
//       <div className="relative mb-8 group cursor-default">
//         {/* Glowing background effect */}
//         <div className="absolute inset-0 bg-[#04644C]/20 rounded-full blur-2xl transform group-hover:scale-110 transition-transform duration-700"></div>

//         <div className="relative bg-white p-8 rounded-full shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-500">
//           <PenTool
//             size={64}
//             className="text-[#04644C] group-hover:-translate-y-1 group-hover:-rotate-12 transition-transform duration-300"
//             strokeWidth={1.5}
//           />
//           {/* Decorative Star Graphic */}
//           <div className="absolute -bottom-1 -right-1 bg-[#FFF0D6] p-2 rounded-full border-2 border-white shadow-sm">
//             <Star size={20} className="text-[#056B71] fill-current animate-pulse" />
//           </div>
//         </div>
//       </div>

//       {/* 2. COMING SOON BADGE */}
//       <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0D6] text-[#056B71] text-xs font-bold uppercase tracking-widest shadow-sm">
//         <span className="w-2 h-2 rounded-full bg-[#056B71] animate-pulse"></span>
//         Coming Soon
//       </div>

//       {/* 3. HEADLINES */}
//       <h1 className="text-4xl md:text-5xl font-bold text-[#000A07] mb-4 tracking-tight">
//         Discover <span className="text-[#04644C]">the Minds</span>
//       </h1>

//       <p className="text-[#5C6261] text-lg max-w-md mx-auto mb-10 leading-relaxed">
//         We are building a dedicated space to showcase the thinkers, writers, and leaders shaping the narrative.
//       </p>

//       {/* 4. CALL TO ACTION */}
//       <Link to="/">
//         <button className="group flex items-center gap-2 px-8 py-3 bg-button-primary text-white rounded-xl font-medium transition-all hover:bg-[#323E3A] hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
//           <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
//           Back to Home
//         </button>
//       </Link>

//     </div>
//   );
// };

// export default 


//  -------------------------------------------------------------------------



// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useAuth } from "react-oidc-context";
// import { Loader2, AlertCircle, User } from "lucide-react";

// const API_BASE = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";

// const CreatorsPage = () => {
//   const auth = useAuth();
//   const token = auth.user?.id_token;

//   const [creators, setCreators] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // --- FETCH CREATORS ---
//   const fetchCreators = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/directory/creators`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) throw new Error("Failed to fetch creators");

//       const data = await res.json();
//       setCreators(data.content || []);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load creators.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (auth.isAuthenticated && token) {
//       fetchCreators();
//     } else {
//       setLoading(false);
//     }
//   }, [token, auth.isAuthenticated]);

//   // --- STATE 1: NOT LOGGED IN ---
//   if (!auth.isAuthenticated) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
//         <div className="bg-gray-100 p-4 rounded-full mb-4">
//           <Lock size={32} className="text-gray-400" />
//         </div>
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Login to see Creators</h2>
//         <p className="text-gray-500 max-w-md mb-6">
//           Join our community to discover talented writers, explore their profiles, and connect with thought leaders.
//         </p>
//         <button
//           onClick={() => auth.signinRedirect()}
//           className="bg-[#04644C] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#03523F] transition-all shadow-md active:scale-95"
//         >
//           Sign In / Register
//         </button>
//       </div>
//     );
//   }

//   // --- STATE 2: LOADING ---
//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64 text-[#04644C]">
//         <Loader2 size={40} className="animate-spin" />
//       </div>
//     );

//   // --- STATE 3: ERROR ---
//   if (error)
//     return (
//       <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
//         <AlertCircle size={20} /> {error}
//       </div>
//     );

//   return (
//     <div className="space-y-8 px-8 lg:py-0 pb-20">
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h2 className="text-3xl font-bold text-gray-900">Explore Creators</h2>
//           <p className="text-gray-500 mt-1">Discover talented writers .</p>
//         </div>
//         {/* <span className="text-xs font-bold text-[#04644C] bg-[#04644C]/10 px-4 py-2 rounded-full uppercase tracking-wider">
//           {creators.length} Creators
//         </span> */}
//       </div>

//       {/* GRID VIEW (Replaces Table) */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {creators.map((creator) => {
//           // Bio with fallback
//           const bioText = creator.bio && creator.bio.trim().length > 0
//             ? creator.bio
//             : "A passionate creator sharing insights, stories, and ideas with the community.";

//           return (
//             <div
//               key={creator.id}
//               className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
//             >
//               {/* TOP SECTION: Avatar & Name */}
//               <div>
//                 <div className="flex items-center gap-4 mb-4">
//                   {creator.avatarUrl ? (
//                     // 1. Show Image
//                     <img
//                       src={creator.avatarUrl}
//                       alt="avatar"
//                       className="w-14 h-14 rounded-full bg-gray-50 object-cover border-2 border-white shadow-sm"
//                     />
//                   ) : (creator.displayName || creator.handle) ? (
//                     // 2. Show Initials (if name exists)
//                     <div className="w-14 h-14 rounded-full bg-[#04644C]/10 border-2 border-white shadow-sm flex items-center justify-center text-[#04644C] font-bold text-xl select-none">
//                       {(creator.displayName || creator.handle).charAt(0).toUpperCase()}
//                     </div>
//                   ) : (
//                     // 3. Fallback to Icon (if absolutely no data exists)
//                     <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center">
//                       <User size={24} className="text-gray-400" />
//                     </div>
//                   )}
//                   <div className="min-w-0">
//                     <h3 className="font-bold text-lg text-gray-900 truncate">
//                       {creator.displayName || "Unknown Creator"}
//                     </h3>
//                     <p className="text-sm text-gray-500 truncate font-medium">
//                       @{creator.handle || "no-handle"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* MIDDLE: Bio */}
//                 <div className="mb-6 h-12"> {/* Fixed height to align buttons */}
//                   <p className={`text-sm leading-relaxed line-clamp-2 ${!creator.bio ? "text-gray-400 italic" : "text-gray-600"}`}>
//                     {bioText}
//                   </p>
//                 </div>
//               </div>

//               {/* BOTTOM: Action Button */}
//               <Link
//                 to={`/profile/${creator.handle}`}
//                 className="block w-full text-center py-2.5 rounded-xl bg-gray-50 text-[#04644C] font-bold text-sm border border-gray-200 group-hover:bg-[#04644C] group-hover:text-white group-hover:border-[#04644C] transition-all duration-300"
//               >
//                 Visit Profile
//               </Link>
//             </div>
//           );
//         })}
//       </div>

//       {/* EMPTY STATE */}
//       {creators.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-300">
//           <div className="bg-white p-4 rounded-full shadow-sm mb-4">
//             <User size={32} className="text-gray-300" />
//           </div>
//           <h3 className="text-lg font-bold text-gray-900">No creators found yet</h3>
//           <p className="text-gray-500 max-w-sm mt-2">
//             It looks like the directory is empty. Check back later to discover new voices!
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreatorsPage;








//-------------------------------------------------------------


import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Loader2, AlertCircle, User, Lock } from "lucide-react";

const API_BASE = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";

const CreatorsPage = () => {
  const auth = useAuth();
  const token = auth.user?.id_token;

  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH CREATORS ---
  const fetchCreators = async () => {
    // Safety check inside function too
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/directory/creators`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch creators");

      const data = await res.json();
      setCreators(data.content || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load creators.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated && token) {
      fetchCreators();
    } else {
      // If not authenticated, we stop loading immediately
      setLoading(false);
    }
  }, [token, auth.isAuthenticated]);

  // --- STATE 1: NOT LOGGED IN ---
  if (!auth.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Lock size={32} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Login to see Creators</h2>
        <p className="text-gray-500 max-w-md mb-6">
          Join our community to discover talented writers, explore their profiles, and connect with thought leaders.
        </p>
        <button
          onClick={() => auth.signinRedirect()}
          className="bg-[#04644C] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#03523F] transition-all shadow-md active:scale-95"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // --- STATE 2: LOADING ---
  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-[#04644C]">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );

  // --- STATE 3: ERROR ---
  if (error)
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
        <AlertCircle size={20} /> {error}
      </div>
    );

  // --- STATE 4: DATA DISPLAY ---
  return (
    <div className="space-y-8 px-8 lg:py-0 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Explore Creators</h2>
          <p className="text-gray-500 mt-1">Discover MINE writers.</p>
        </div>
        {/* <span className="text-xs font-bold text-[#04644C] bg-[#04644C]/10 px-4 py-2 rounded-full uppercase tracking-wider">
          {creators.length} Creators
        </span> */}
      </div>

      {/* GRID VIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {creators.map((creator) => {
          const bioText = creator.bio && creator.bio.trim().length > 0
            ? creator.bio
            : "A passionate creator sharing insights, stories, and ideas with the community.";

          return (
            <div
              key={creator.id}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
            >
              {/* TOP: Avatar & Name */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  {creator.avatarUrl ? (
                    <img
                      src={creator.avatarUrl}
                      alt="avatar"
                      className="w-14 h-14 rounded-full bg-gray-50 object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#04644C]/10 border-2 border-white shadow-sm flex items-center justify-center text-[#04644C] font-bold text-xl select-none">
                      {(creator.displayName || creator.handle || "?").charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 truncate">
                      {creator.displayName || "Unknown Creator"}
                    </h3>
                    <p className="text-sm text-gray-500 truncate font-medium">
                      @{creator.handle || "no-handle"}
                    </p>
                  </div>
                </div>

                {/* MIDDLE: Bio */}
                <div className="mb-6 h-12">
                  <p className={`text-sm leading-relaxed line-clamp-2 ${!creator.bio ? "text-gray-400 italic" : "text-gray-600"}`}>
                    {bioText}
                  </p>
                </div>
              </div>

              {/* BOTTOM: Action Button */}
              <Link
                to={`/profile/${creator.handle}`}
                className="block w-full text-center py-2.5 rounded-xl bg-gray-50 text-[#04644C] font-bold text-sm border border-gray-200 group-hover:bg-[#04644C] group-hover:text-white group-hover:border-[#04644C] transition-all duration-300"
              >
                Visit Profile
              </Link>
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE FOR LOGGED IN USERS */}
      {creators.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <User size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No creators found yet</h3>
          <p className="text-gray-500 max-w-sm mt-2">
            It looks like the directory is empty. Check back later to discover new voices!
          </p>
        </div>
      )}
    </div>
  );
};

export default CreatorsPage;