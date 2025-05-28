/**
 * Utility to reset demo accounts
 * This can be called from the browser console if demo accounts are corrupted
 */

export const resetDemoAccounts = () => {
  // Clear existing users
  localStorage.removeItem('pressly_users');
  
  // Force reload to reinitialize demo accounts
  window.location.reload();
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.resetDemoAccounts = resetDemoAccounts;
}