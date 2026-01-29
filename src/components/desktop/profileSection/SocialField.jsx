
// const SOCIAL_URLS = {
//   X: (username) => `https://x.com/${username}`,
//   Instagram: (username) => `https://instagram.com/${username}`,
//   Youtube: (username) => `https://youtube.com/@${username}`,
//   LinkedIn: (username) => `https://www.linkedin.com/in/${username}`,
//   GitHub: (username) => `https://github.com/${username}`,
// };

// const extractUsername = (raw) => {
//   if (!raw) return "";
//   let value = String(raw).trim();
//   if (value.endsWith("/")) value = value.slice(0, -1);
//   if (value.startsWith("http")) {
//     try {
//         const url = new URL(value);
//         const parts = url.pathname.split("/").filter(Boolean);
//         return parts.length ? parts[parts.length - 1].replace(/^@/, "") : "";
//     } catch { return value; }
//   }
//   return value.replace(/^@/, "");
// };

// export const SocialField = ({ isEditing, icon, label, value, onChange, color }) => {
//   if (!isEditing && !value) return null;

//   const isWebsite = label.toLowerCase() === "website";
//   const username = extractUsername(value);
  
//   const finalURL = isWebsite
//     ? (value?.startsWith("http") ? value : `https://${value}`)
//     : SOCIAL_URLS[label] ? SOCIAL_URLS[label](username) : "#";

//   const displayText = username && !isWebsite ? `@${username}` : value || label;

//   return (
//     <div className={`flex items-center gap-2 text-sm py-1 px-3 rounded-full w-fit transition-all ${
//         isEditing ? "bg-gray-100 border border-gray-200" : "bg-[#323E3A] text-white"
//     }`}>
//       <div className={`shrink-0 text-lg ${isEditing ? color : "text-gray-300"}`}>
//         {icon}
//       </div>
//       <div className="flex-1 min-w-[120px]">
//         {isEditing ? (
//           <input
//             type="text"
//             value={value || ""}
//             onChange={(e) => onChange(e.target.value)}
//             placeholder={`${label} username`}
//             className="w-full bg-transparent outline-none text-black placeholder-gray-400 text-sm"
//           />
//         ) : (
//           <a
//             href={finalURL}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="hover:underline text-white font-medium truncate block max-w-[150px]"
//           >
//             {displayText}
//           </a>
//         )}
//       </div>
//     </div>
//   );
// };

const SOCIAL_URLS = {
  X: (username) => `https://x.com/${username}`,
  Instagram: (username) => `https://instagram.com/${username}`,
  Youtube: (username) => `https://youtube.com/@${username}`,
  LinkedIn: (username) => `https://www.linkedin.com/in/${username}`,
  GitHub: (username) => `https://github.com/${username}`,
};

const extractUsername = (raw) => {
  if (!raw) return "";
  let value = String(raw).trim();
  if (value.endsWith("/")) value = value.slice(0, -1);
  
  // Handle full URLs
  if (value.startsWith("http") || value.startsWith("www")) {
    try {
        // Add protocol if missing for URL parsing
        const urlStr = value.startsWith("www") ? `https://${value}` : value;
        const url = new URL(urlStr);
        const parts = url.pathname.split("/").filter(Boolean);
        return parts.length ? parts[parts.length - 1].replace(/^@/, "") : "";
    } catch { return value; }
  }
  return value.replace(/^@/, "");
};

export const SocialField = ({ isEditing, icon, label, value, onChange, color }) => {
  // Hide empty fields in View Mode
  if (!isEditing && !value) return null;

  const isWebsite = label.toLowerCase() === "website";
  const username = extractUsername(value);
  
  // Construct the final click-through URL
  const finalURL = isWebsite
    ? (value?.startsWith("http") ? value : `https://${value}`)
    : SOCIAL_URLS[label] ? SOCIAL_URLS[label](username) : "#";

  // Determine what text to show
  const displayText = username && !isWebsite ? `@${username}` : value || label;

  return (
    <div className={`flex items-center gap-2 text-sm py-1.5 px-4 rounded-full w-full sm:w-fit transition-all ${
        isEditing 
          ? "bg-gray-50 border border-gray-200 focus-within:border-[#04644C] focus-within:ring-1 focus-within:ring-[#04644C]/20" 
          : "bg-[#323E3A] text-white hover:bg-[#2A3430]"
    }`}>
      {/* Icon */}
      <div className={`shrink-0 text-lg ${isEditing ? color : "text-gray-300"}`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-[100px]">
        {isEditing ? (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={isWebsite ? "https://..." : "username"}
            // Improved Input CSS: prevents background overlap and handles width better
            className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm font-medium"
            autoComplete="off"
            spellCheck="false"
          />
        ) : (
          <a
            href={finalURL}
            target="_blank"
            rel="noopener noreferrer"
            // Truncate logic to keep profile clean
            className="text-white font-medium truncate block max-w-[180px]"
            title={isWebsite ? value : `@${username}`} // Tooltip for full text
          >
            {displayText}
          </a>
        )}
      </div>
    </div>
  );
};