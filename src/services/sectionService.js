// src/services/sectionService.js

const BASE_URL = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";

// 1. Existing fetch
export const getSections = async () => {
  try {
    const response = await fetch(`${BASE_URL}/sections?active=true&page=0&size=50&sort=name,asc`);
    if (!response.ok) throw new Error("Failed to fetch sections");
    const data = await response.json();
    return data.content || []; 
  } catch (error) {
    console.error(error);
    return [];
  }
};

// 2. NEW: Get the list of sections the User is following
export const getUserFollowedSections = async (userId) => {
  if (!userId) return [];
  try {
    const response = await fetch(`${BASE_URL}/sections/users/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user sections");
    // Swagger shows this returns a direct array of objects
    return await response.json(); 
  } catch (error) {
    console.error(error);
    return [];
  }
};
// 3. Follow a Section (Choose)
// UPDATED: Now accepts 'token'
export const followSection = async (sectionId, userId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/sections/${sectionId}/choose?userId=${userId}`, {
      method: "POST",
      headers: {
        // CRITICAL: Send the token to prove who you are
        "Authorization": `Bearer ${token}` 
      }
    });
    return response.ok;
  } catch (error) {
    console.error("Error following section:", error);
    return false;
  }
};

// 4. Unfollow a Section (Unchoose)
// UPDATED: Now accepts 'token'
export const unfollowSection = async (sectionId, userId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/sections/${sectionId}/unchoose?userId=${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.ok;
  } catch (error) {
    console.error("Error unfollowing section:", error);
    return false;
  }
};