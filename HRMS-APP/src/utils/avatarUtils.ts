// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
// No external dependencies needed for this utility module

// ==========================================
// 2. AVATAR UTILITIES
// ==========================================

/**
 * Generates a deterministic male avatar URL using randomuser.me portraits (1 to 99).
 * If the provided ID is a string (e.g. UUID, code), it hashes the string by summing its character codes.
 * 
 * @param {number | string} id - The employee's unique identifier.
 * @returns {string} The generated absolute URL of the avatar image.
 */
export const getDeterministicMaleAvatar = (id: number | string): string => {
  let numericId = 0;
  
  // Inspect type of the ID and convert strings to a deterministic integer sum
  if (typeof id === 'number') {
    numericId = id;
  } else {
    // Hash string IDs by aggregating their character codes
    for (let i = 0; i < id.length; i++) {
      numericId += id.charCodeAt(i);
    }
  }
  
  // Calculate portrait number within bounds 1-99 allowed by randomuser.me
  const portraitNumber = (numericId % 99) + 1;
  return `https://randomuser.me/api/portraits/men/${portraitNumber}.jpg`;
};
