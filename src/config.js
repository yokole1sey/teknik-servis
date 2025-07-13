// Frontend API Configuration
const CONFIG = {
  // Production ortamında otomatik tespit
  API_BASE_URL: window.location.hostname === 'localhost' ? 
    'http://localhost:3001' : 
    window.location.origin,
  
  // API Endpoints
  get ENDPOINTS() {
    return {
      customers: `${this.API_BASE_URL}/api/customers`,
      servis: `${this.API_BASE_URL}/api/servis`,
      stok: `${this.API_BASE_URL}/api/stok`,
      arsiv: `${this.API_BASE_URL}/api/arsiv`,
      upload: `${this.API_BASE_URL}/api/upload`,
      settings: `${this.API_BASE_URL}/api/settings`,
      sirketBilgi: `${this.API_BASE_URL}/api/sirket-bilgi`
    };
  },
  
  // Upload Configuration
  UPLOAD: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'],
    maxFiles: 10
  },
  
  // UI Configuration
  UI: {
    toastDuration: 3000,
    autoSaveInterval: 30000, // 30 saniye
    pageSize: 25,
    searchDebounce: 300
  },
  
  // Debug Mode
  DEBUG: window.location.hostname === 'localhost'
};

// Global olarak kullanım için
window.CONFIG = CONFIG;

// Console'da ortam bilgisi göster
if (CONFIG.DEBUG) {
  console.log('🔧 Development Mode');
  console.log('API Base URL:', CONFIG.API_BASE_URL);
} else {
  console.log('🚀 Production Mode');
  console.log('API Base URL:', CONFIG.API_BASE_URL);
} 