export const createSlug = (title) => {
  // 1. Safety Check: If title is missing or not a string, return a placeholder
  if (!title || typeof title !== 'string') {
    return "unknown-post"; 
  }

  // 2. Standard formatting
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};