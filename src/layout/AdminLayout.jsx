import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    Users, FileText, CheckCircle, ShieldAlert, LogOut,
    LayoutDashboard, ChevronLeft, ChevronRight
} from "lucide-react";
import { useAuth } from "react-oidc-context";
import { Logo_Emblem_Light } from "../assets"; // Adjust path if needed

const AdminLayout = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    // 1. State for Collapsed Mode
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        auth.removeUser();
        navigate("/");
    };

    // Helper for Link Classes
    const linkClass = ({ isActive }) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
    ${isActive ? "bg-[#04644C] text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}
    ${isCollapsed ? "justify-center" : ""}
  `;

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* SIDEBAR */}
            <aside
                className={`bg-primary text-white flex flex-col fixed h-full transition-all duration-300 z-50
        ${isCollapsed ? "w-20" : "w-72"}`}
            >
                {/* HEADER */}
                <div className={`p-4 border-b border-gray-800 flex items-center h-20 relative transition-all duration-300 ${isCollapsed ? "justify-center" : "justify-start gap-3"}`}>
                    <img
                        src={Logo_Emblem_Light}
                        alt="Logo"
                        className={`transition-all duration-300 ${isCollapsed ? "w-10 h-10" : "w-8 h-8"}`}
                    />

                    {!isCollapsed && (
                        <h1 className="text-xl font-bold tracking-wider whitespace-nowrap overflow-hidden animate-in fade-in duration-300">
                            ADMIN PANEL
                        </h1>
                    )}

                    {/* TOGGLE BUTTON */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-[#04644C] text-white p-1 rounded-full border border-gray-800 shadow-md hover:bg-[#03523F] transition-transform z-50"
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 p-3 space-y-2 overflow-x-hidden">
                    <NavLink to="/admin" end className={linkClass} title={isCollapsed ? "Dashboard" : ""}>
                        <LayoutDashboard size={20} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-2">Dashboard</span>}
                    </NavLink>

                    <NavLink to="/admin/users" className={linkClass} title={isCollapsed ? "Users" : ""}>
                        <Users size={20} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-2">Users</span>}
                    </NavLink>

                    <NavLink to="/admin/content" className={linkClass} title={isCollapsed ? "Content" : ""}>
                        <FileText size={20} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-2">Content</span>}
                    </NavLink>

                    <NavLink to="/admin/approvals" className={linkClass} title={isCollapsed ? "Approvals" : ""}>
                        <CheckCircle size={20} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-2">Approvals</span>}
                    </NavLink>

                    <div className={`pt-4 mt-4 border-t border-gray-800 transition-all duration-300 ${isCollapsed ? "mx-2" : ""}`}>
                        <NavLink to="/admin/system" className={linkClass} title={isCollapsed ? "System Tools" : ""}>
                            <ShieldAlert size={20} className="shrink-0" />
                            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-2">System Tools</span>}
                        </NavLink>
                    </div>
                </nav>

                {/* FOOTER (Logout) */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg w-full transition-colors duration-200 ${isCollapsed ? "justify-center" : "justify-start"}`}
                        title="Logout"
                    >
                        <LogOut size={20} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap overflow-hidden animate-in fade-in">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main
                className={`flex-1 p-8 overflow-auto transition-all duration-300
        ${isCollapsed ? "ml-20" : "ml-72"}`}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;