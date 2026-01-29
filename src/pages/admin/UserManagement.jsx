import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { adminService } from "../../services/adminService";
import { Ban, CheckCircle, Shield, AlertCircle, Loader2 } from "lucide-react";

const UserManagement = () => {
  const auth = useAuth();
  const token = auth.user?.id_token;

  // State for data and UI
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null); // To show spinner on specific button

  // --- 1. FETCH DATA ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers(token);

      // Safety check: Your API might return an array directly OR a paginated object ({ content: [...] })
      const userList = Array.isArray(data) ? data : (data.content || []);
      setUsers(userList);
    } catch (err) {
      console.error(err);
      setError("Failed to load users. Please check your admin permissions.");
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);


  // --- 2. HANDLE ACTIONS ---
  const handleStatusChange = async (user, newStatus) => {
    if (!window.confirm(`Are you sure you want to change ${user.displayName}'s status to ${newStatus}?`)) return;

    setProcessingId(user.id); // Show loading on this specific row

    try {
      // Call API
      await adminService.updateUserStatus(token, user.id, newStatus);

      // Optimistic Update: Update local state immediately without refetching
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };


  // --- 3. RENDER ---
  if (loading) return (
    <div className="flex justify-center items-center h-64 text-[#04644C]">
      <Loader2 size={40} className="animate-spin" />
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
      <AlertCircle size={20} /> {error}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total Users: {users.length}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          {/* TABLE HEADER */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User Profile</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">

                {/* 1. User Profile */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl || user.pictureUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full bg-gray-200 object-cover border border-gray-100"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{user.displayName || "Unknown"}</p>
                      <p className="text-xs text-gray-500">@{user.handle || "no-handle"}</p>
                    </div>
                  </div>
                </td>

                {/* 2. Contact */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.email || "No Email"}
                </td>

                {/* 3. Role */}
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {/* Assuming roles is an array, e.g. ["USER", "ADMIN"] */}
                    {(user.roles || ["USER"]).map((role, i) => (
                      <span key={i} className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {role}
                      </span>
                    ))}
                  </div>
                </td>

                {/* 4. Status */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border
                        ${user.status === 'BANNED'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-green-50 text-green-600 border-green-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'BANNED' ? 'bg-red-500' : 'bg-green-500'}`} />
                    {user.status || "ACTIVE"}
                  </span>
                </td>

                {/* 5. Actions (Ban / Unban) */}
                <td className="px-6 py-4 text-right">
                  {processingId === user.id ? (
                    <div className="flex justify-end">
                      <Loader2 size={18} className="animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      {user.status === "BANNED" ? (
                        // UNBAN BUTTON
                        <button
                          onClick={() => handleStatusChange(user, "ACTIVE")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-green-200 text-green-600 rounded-lg hover:bg-green-50 text-xs font-bold transition shadow-sm"
                        >
                          <CheckCircle size={14} /> Activate
                        </button>
                      ) : (
                        // BAN BUTTON
                        <button
                          onClick={() => handleStatusChange(user, "BANNED")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-xs font-bold transition shadow-sm"
                        >
                          <Ban size={14} /> Ban User
                        </button>
                      )}
                    </div>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {users.length === 0 && !loading && (
          <div className="p-10 text-center text-gray-500">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;