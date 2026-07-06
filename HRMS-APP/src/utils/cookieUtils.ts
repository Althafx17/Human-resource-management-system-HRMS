// ==========================================
// 1. COOKIE UTIL FUNCTIONS
// ==========================================

/**
 * Retrieves a cookie value by its key/name.
 * 
 * @param {string} name - Name of the cookie to retrieve.
 * @returns {string|null} Cookie string value or null if not found.
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Sets a cookie key-value pair with a specified expiration duration in days.
 * Configured with SameSite=Lax and Secure attributes to ensure standard security compliance.
 * 
 * @param {string} name - Name of the cookie.
 * @param {string} value - String value to store.
 * @param {number} days - Duration in days before the cookie expires.
 */
export function setCookie(name: string, value: string, days: number): void {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure";
}

/**
 * Deletes a cookie key-value pair by overriding it with an expired timestamp.
 * 
 * @param {string} name - Name of the cookie.
 */
export function deleteCookie(name: string): void {
  document.cookie = name + '=; Max-Age=-99999999; path=/; SameSite=Lax; Secure';
}
