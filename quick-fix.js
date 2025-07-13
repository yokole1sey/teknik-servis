// QUICK FIX - Copy and paste this into browser console
// This will immediately fix the API connection issue

console.log('🔧 Fixing API Configuration...');

// Update CONFIG object
CONFIG.API_BASE_URL = 'https://teknik-servis-backend.onrender.com';

// Save to localStorage for persistence
localStorage.setItem('apiBaseUrl', 'https://teknik-servis-backend.onrender.com');

// Verify the fix
console.log('✅ API Base URL updated to:', CONFIG.API_BASE_URL);
console.log('✅ Saved to localStorage');

// Test the API endpoints
const endpoints = CONFIG.ENDPOINTS;
console.log('📋 Updated endpoints:');
console.log('- Customers:', endpoints.customers);
console.log('- Stok:', endpoints.stok);
console.log('- Arsiv:', endpoints.arsiv);

// Force reload to apply changes
console.log('🔄 Reloading page to apply changes...');
setTimeout(() => {
  window.location.reload();
}, 1000); 