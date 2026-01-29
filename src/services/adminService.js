// src/services/adminService.js
const API_BASE = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/admin";

export const adminService = {
  // --- USERS ---
  getUsers: async (token, page = 0, size = 20) => {
    const res = await fetch(`${API_BASE}/users?page=${page}&size=${size}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 1. Debug: Log the status code to see if it's 200, 401, or 403
    console.log("Admin API Status:", res.status);

    // 2. Handle Authentication/Permission Errors separately
    if (res.status === 401)
      throw new Error("Unauthorized: Please log in again.");
    if (res.status === 403)
      throw new Error("Forbidden: You do not have Admin permissions.");
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);

    // 3. Handle "204 No Content" (Success but empty)
    if (res.status === 204) {
      return []; // Return empty array
    }

    // 4. Safe Parsing: Read text first to prevent JSON crash
    const text = await res.text();
    try {
      // If text is empty, return empty array. Otherwise, parse it.
      return text ? JSON.parse(text) : [];
    } catch (err) {
      console.error("Server returned non-JSON response:", text);
      throw new Error("Invalid response format from server");
    }
  },

  getUser: async (token, userId) => {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  updateUserStatus: async (token, userId, status) => {
    // PATCH /api/v1/admin/users/{id}/status
    // Body usually expects { status: "ACTIVE" | "BANNED" }
    const res = await fetch(`${API_BASE}/users/${userId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  assignRole: async (token, userId, roles) => {
    // POST /api/v1/admin/users/{id}/roles
    const res = await fetch(`${API_BASE}/users/${userId}/roles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roles), // e.g. ["ADMIN", "USER"]
    });
    return res.json();
  },

  // --- CREATOR APPROVALS ---
  approveCreator: async (token, userId) => {
    return fetch(`${API_BASE}/creators/${userId}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  rejectCreator: async (token, userId) => {
    return fetch(`${API_BASE}/creators/${userId}/reject`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // --- CONTENT ---
  /**
   * GET /api/v1/admin/content
   * Supports optional search
   */
  getAllContent: async (token, page = 0, size = 20) => {
    const url = `${API_BASE}/content?page=${page}&size=${size}`;
    console.log("Fetching Content from:", url); // 1. Check URL

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Content API Status:", res.status); // 2. Check Status

    if (res.status === 403)
      throw new Error("Forbidden: Admin access required.");
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);

    // 3. Handle Empty Responses (204)
    if (res.status === 204) return [];

    // 4. Safe Parsing
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : [];
    } catch (err) {
      console.error("Invalid JSON response:", text);
      throw new Error("Server returned invalid JSON");
    }
  },

  /**
   * DELETE /api/v1/admin/content/{id}
   * Admin delete (force delete)
   */
  deleteContent: async (token, contentId) => {
    const res = await fetch(`${API_BASE}/content/${contentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to delete content");
  },

  /**
   * (Optional) Fetch specific user's content if your backend supports it
   * Otherwise we filter on the frontend.
   */
};
