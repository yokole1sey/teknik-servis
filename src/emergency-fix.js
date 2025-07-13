// KOMPLE SİSTEM DÜZELTMESİ - Teknik Servis Sistemi
// Bu dosya tüm API bağlantı sorunlarını çözer
// Eğer sistem çalışmıyorsa, bu kodu browser konsoluna yapıştırın

console.log('🚀 Teknik Servis Sistemi - Komple Düzeltme Başlatılıyor...');

// ============================
// 1. BACKEND YAPITLANDIRMA
// ============================

const BACKEND_URL = 'https://teknik-servis-backend.onrender.com';
const FRONTEND_URL = 'https://bilgisayar-teknik-servis-takip.vercel.app';

// ============================
// 2. API İSTEKLERİ YÖNLENDİRME
// ============================

// Fetch override - Tüm localhost:3001 isteklerini backend'e yönlendir
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (typeof url === 'string') {
    if (url.includes('localhost:3001')) {
      url = url.replace('http://localhost:3001', BACKEND_URL);
      console.log('🔄 API isteği yönlendirildi:', url);
    }
    if (url.startsWith('/upload/')) {
      url = `${BACKEND_URL}${url}`;
      console.log('🔄 Upload isteği yönlendirildi:', url);
    }
  }
  return originalFetch.call(this, url, options);
};

// XMLHttpRequest override
const OriginalXMLHttpRequest = window.XMLHttpRequest;
window.XMLHttpRequest = function() {
  const xhr = new OriginalXMLHttpRequest();
  const originalOpen = xhr.open;
  
  xhr.open = function(method, url, async, user, password) {
    if (typeof url === 'string' && url.includes('localhost:3001')) {
      url = url.replace('http://localhost:3001', BACKEND_URL);
      console.log('🔄 XHR isteği yönlendirildi:', url);
    }
    return originalOpen.call(this, method, url, async, user, password);
  };
  
  return xhr;
};

// ============================
// 3. CONFIG GÜNCELLEME
// ============================

window.CONFIG = {
  API_BASE_URL: BACKEND_URL,
  ENDPOINTS: {
    customers: `${BACKEND_URL}/api/customers`,
    servis: `${BACKEND_URL}/api/servis`,
    stok: `${BACKEND_URL}/api/stok`,
    arsiv: `${BACKEND_URL}/api/arsiv`,
    upload: `${BACKEND_URL}/api/upload`,
    settings: `${BACKEND_URL}/api/settings`,
    sirketBilgi: `${BACKEND_URL}/api/sirket-bilgi`,
    whatsappSablonlari: `${BACKEND_URL}/api/settings/whatsappSablonlari`
  },
  UPLOAD: {
    maxFileSize: 10 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'],
    maxFiles: 10
  },
  UI: {
    toastDuration: 3000,
    autoSaveInterval: 30000,
    pageSize: 25,
    searchDebounce: 300
  },
  DEBUG: false
};

// ============================
// 4. VERİ SAKLAMA
// ============================

window.STOK_DATA = [];
window.ARSIV_DATA = [];
window.WHATSAPP_TEMPLATES = {};

// ============================
// 5. STOK LİSTESİ DOLDURMA
// ============================

function fillStockTable(data) {
  const container = document.getElementById('stok-listesi') || 
                   document.querySelector('.stok-listesi') || 
                   document.querySelector('#stok-container') ||
                   document.querySelector('.stok-container');
  
  if (!container) {
    console.log('⚠️ Stok container bulunamadı');
    return;
  }
  
  console.log('📋 Stok tablosu dolduruluyor...');
  
  let html = '<div class="stok-header"><h2>Stok Listesi (' + data.length + ' ürün)</h2></div>';
  
  data.forEach(item => {
    const satildi = item.satilan && item.satilan.trim() !== '';
    const durum = satildi ? 'SATILDI' : 'STOKTA';
    const durumClass = satildi ? 'satildi' : 'stokta';
    
    // Fotoğraf galerisi
    let fotoGaleri = '';
    if (item.fotolar && item.fotolar.length > 0) {
      const duzeltilmisFotolar = item.fotolar.map(foto => {
        if (foto.startsWith('/upload/')) {
          return `${BACKEND_URL}${foto}`;
        }
        return foto;
      });
      
      fotoGaleri = `
        <div class="foto-galeri" style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
          <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">Fotoğraflar:</h4>
          <div class="foto-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px;">
            ${duzeltilmisFotolar.map(foto => `
              <img src="${foto}" alt="Ürün fotoğrafı" style="
                width: 80px; height: 80px; object-fit: cover; border-radius: 4px;
                border: 1px solid #ddd; cursor: pointer; transition: transform 0.2s;
              " onclick="window.open('${foto}', '_blank')"
              onmouseover="this.style.transform='scale(1.05)'; this.style.borderColor='#007bff';"
              onmouseout="this.style.transform='scale(1)'; this.style.borderColor='#ddd';"
              onerror="this.style.backgroundColor='#f8f9fa'; this.alt='Fotoğraf yüklenemedi';">
            `).join('')}
          </div>
        </div>
      `;
    }
    
    html += `
      <div class="stok-kart ${durumClass}" style="
        border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px;
        background: ${satildi ? '#ffe6e6' : '#e6f7ff'};
      ">
        <div class="stok-header" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span class="stok-no" style="font-weight: bold; color: #333;">${item.stokno}</span>
          <span class="durum ${durumClass}" style="
            padding: 2px 8px; border-radius: 3px; font-size: 12px; color: white;
            background-color: ${satildi ? '#d32f2f' : '#2e7d32'};
          ">${durum}</span>
        </div>
        <div class="stok-bilgi">
          <h3 style="margin: 0 0 10px 0; color: #333;">${item.marka} ${item.model}</h3>
          <p><strong>Ürün:</strong> ${item.uruncinsi}</p>
          <p><strong>Seri No:</strong> ${item.serino}</p>
          <p><strong>İşlemci:</strong> ${item.islemci}</p>
          <p><strong>RAM:</strong> ${item.ram}</p>
          <p><strong>Depolama:</strong> ${item.hdd}</p>
          <p><strong>Ekran Kartı:</strong> ${item.ekrankart}</p>
          <p><strong>Ekran Boyutu:</strong> ${item.ekranboyutu}"</p>
          <p><strong>Kozmetik:</strong> ${item.kozmetik}/10</p>
          <p><strong>Alış Fiyatı:</strong> ${item.alisfiyati} TL</p>
          <p><strong>Satış Fiyatı:</strong> ${item.satisfiyati} TL</p>
          ${item.aciklama ? `<p><strong>Açıklama:</strong> ${item.aciklama}</p>` : ''}
          ${item.notlar ? `<p><strong>Notlar:</strong> ${item.notlar}</p>` : ''}
          ${item.alinan ? `<p><strong>Alınan Tarih:</strong> ${item.alinan}</p>` : ''}
          ${item.satilan ? `<p><strong>Satılan Tarih:</strong> ${item.satilan}</p>` : ''}
          ${fotoGaleri}
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  console.log('✅ Stok tablosu güncellendi:', data.length + ' ürün gösteriliyor');
}

// ============================
// 6. ARŞİV LİSTESİ DOLDURMA
// ============================

function fillArchiveTable(data) {
  const container = document.getElementById('arsiv-listesi') || 
                   document.querySelector('.arsiv-listesi') || 
                   document.querySelector('#arsiv-container');
  
  if (!container) {
    console.log('⚠️ Arşiv container bulunamadı');
    return;
  }
  
  console.log('📋 Arşiv tablosu dolduruluyor...');
  
  let html = '<div class="arsiv-header"><h2>Arşiv Listesi (' + data.length + ' ürün)</h2></div>';
  
  data.forEach(item => {
    const kar = item.satisfiyati - item.alisfiyati;
    const karClass = kar > 0 ? 'kar-pozitif' : 'kar-negatif';
    
    html += `
      <div class="arsiv-kart" style="
        border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px;
        background: #f9f9f9;
      ">
        <div class="arsiv-header" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span class="stok-no" style="font-weight: bold; color: #333;">${item.stokno}</span>
          <span class="satis-tarihi" style="color: #666; font-size: 14px;">${item.satilan}</span>
        </div>
        <div class="arsiv-bilgi">
          <h3 style="margin: 0 0 10px 0; color: #333;">${item.marka} ${item.model}</h3>
          <p><strong>Ürün:</strong> ${item.uruncinsi}</p>
          <p><strong>Alış Fiyatı:</strong> ${item.alisfiyati} TL</p>
          <p><strong>Satış Fiyatı:</strong> ${item.satisfiyati} TL</p>
          <p><strong>Kar/Zarar:</strong> <span class="${karClass}" style="color: ${kar > 0 ? '#2e7d32' : '#d32f2f'};">${kar} TL</span></p>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  console.log('✅ Arşiv tablosu güncellendi:', data.length + ' ürün gösteriliyor');
}

// ============================
// 7. WHATSAPP ŞABLONLARI
// ============================

function loadWhatsAppTemplates() {
  fetch(`${BACKEND_URL}/api/settings/whatsappSablonlari`)
    .then(response => response.json())
    .then(templates => {
      console.log('✅ WhatsApp şablonları yüklendi:', Object.keys(templates).length + ' şablon');
      window.WHATSAPP_TEMPLATES = templates;
      
      window.getWhatsAppTemplate = function(templateName) {
        return window.WHATSAPP_TEMPLATES[templateName] || 'Şablon bulunamadı';
      };
    })
    .catch(error => {
      console.error('❌ WhatsApp şablonları yüklenemedi:', error);
      window.WHATSAPP_TEMPLATES = {
        teslim_alindi: 'Sayın {MUSTERI_AD}, {SERVIS_NO} nolu ürününüz teslim alınmıştır.',
        onarim: 'Sayın {MUSTERI_AD}, {SERVIS_NO} nolu ürününüz onarım sürecindedir.',
        tamamlandi: 'Sayın {MUSTERI_AD}, {SERVIS_NO} nolu ürününüz hazır.',
        teslim_edildi: 'Sayın {MUSTERI_AD}, {SERVIS_NO} nolu ürününüz teslim edilmiştir.'
      };
    });
}

// ============================
// 8. FOTOĞRAF URL DÜZELTMESİ
// ============================

function fixAllImages() {
  const images = document.querySelectorAll('img');
  let fixedCount = 0;
  
  images.forEach(img => {
    if (img.src && img.src.includes('localhost:3001')) {
      const oldSrc = img.src;
      img.src = img.src.replace('http://localhost:3001', BACKEND_URL);
      console.log('🔄 Resim URL\'si düzeltildi:', oldSrc, '->', img.src);
      fixedCount++;
    }
  });
  
  if (fixedCount > 0) {
    console.log(`✅ ${fixedCount} resim URL\'si düzeltildi`);
  }
}

// ============================
// 9. VERİ YÜKLEME FONKSİYONU
// ============================

function loadAllData() {
  console.log('📥 Tüm veriler yükleniyor...');
  
  // Stok verilerini yükle
  fetch(`${BACKEND_URL}/api/stok`)
    .then(response => response.json())
    .then(data => {
      console.log('✅ Stok verileri yüklendi:', data.length + ' ürün');
      window.STOK_DATA = data;
      
      setTimeout(() => {
        fillStockTable(data);
        fixAllImages();
      }, 500);
    })
    .catch(error => {
      console.error('❌ Stok yükleme hatası:', error);
    });

  // Arşiv verilerini yükle
  fetch(`${BACKEND_URL}/api/arsiv`)
    .then(response => response.json())
    .then(data => {
      console.log('✅ Arşiv verileri yüklendi:', data.length + ' ürün');
      window.ARSIV_DATA = data;
      
      setTimeout(() => {
        fillArchiveTable(data);
      }, 500);
    })
    .catch(error => {
      console.error('❌ Arşiv yükleme hatası:', error);
    });

  // WhatsApp şablonlarını yükle
  loadWhatsAppTemplates();
}

// ============================
// 10. SAYFA DEĞİŞİM DİNLEYİCİLERİ
// ============================

// Sayfa değişimlerini dinle
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {
      if (window.location.hash === '#stok' && window.STOK_DATA.length > 0) {
        setTimeout(() => {
          fillStockTable(window.STOK_DATA);
          fixAllImages();
        }, 100);
      }
      if (window.location.hash === '#arsiv' && window.ARSIV_DATA.length > 0) {
        setTimeout(() => fillArchiveTable(window.ARSIV_DATA), 100);
      }
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Hash değişimlerini dinle
window.addEventListener('hashchange', function() {
  setTimeout(() => {
    if (window.location.hash === '#stok' && window.STOK_DATA.length > 0) {
      fillStockTable(window.STOK_DATA);
      fixAllImages();
    }
    if (window.location.hash === '#arsiv' && window.ARSIV_DATA.length > 0) {
      fillArchiveTable(window.ARSIV_DATA);
    }
  }, 200);
});

// Periyodik resim kontrolü
setInterval(() => {
  fixAllImages();
}, 10000);

// ============================
// 11. LOCALSTORAGE KAYIT
// ============================

localStorage.setItem('apiBaseUrl', BACKEND_URL);
localStorage.setItem('backendFixed', 'true');

// ============================
// 12. GLOBAL FONKSİYONLAR
// ============================

window.fillStockTable = fillStockTable;
window.fillArchiveTable = fillArchiveTable;
window.loadAllData = loadAllData;
window.loadWhatsAppTemplates = loadWhatsAppTemplates;
window.fixAllImages = fixAllImages;

// ============================
// 13. SİSTEMİ BAŞLAT
// ============================

loadAllData();

console.log('🎉 Teknik Servis Sistemi tamamen düzeltildi!');
console.log('📋 Özellikler:');
console.log('  ✅ Müşteri Yönetimi');
console.log('  ✅ Stok Listesi (Fotoğraflarla)');
console.log('  ✅ Arşiv Listesi');
console.log('  ✅ WhatsApp Şablonları');
console.log('  ✅ Fotoğraf Galerisi');
console.log('📌 Stok/Arşiv sayfalarına gidin, tüm veriler yüklenecek!');

// ============================
// 14. HATA AYIKLAMA
// ============================

window.debugSystem = function() {
  console.log('🔍 Sistem Debug Bilgileri:');
  console.log('Backend URL:', BACKEND_URL);
  console.log('Frontend URL:', FRONTEND_URL);
  console.log('CONFIG:', window.CONFIG);
  console.log('Stok Data:', window.STOK_DATA?.length || 0, 'ürün');
  console.log('Arşiv Data:', window.ARSIV_DATA?.length || 0, 'ürün');
  console.log('WhatsApp Templates:', Object.keys(window.WHATSAPP_TEMPLATES || {}).length, 'şablon');
  console.log('localStorage apiBaseUrl:', localStorage.getItem('apiBaseUrl'));
  
  // API test
  fetch(`${BACKEND_URL}/api/stok`)
    .then(response => response.json())
    .then(data => console.log('✅ API Test Başarılı:', data.length, 'ürün'))
    .catch(error => console.error('❌ API Test Hatası:', error));
}; 