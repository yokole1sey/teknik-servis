# 🚀 Teknik Servis Sistemi - Deployment Kılavuzu

## 📋 Mevcut Durum

- ✅ **Backend**: `https://teknik-servis-backend.onrender.com` (Çalışıyor)
- ✅ **Frontend**: `https://bilgisayar-teknik-servis-takip.vercel.app` (Güncelleme gerekli)
- ✅ **Tüm Özellikler**: API bağlantıları, stok, arşiv, WhatsApp şablonları, fotoğraf galerisi

## 🔧 Deployment Seçenekleri

### **Seçenek 1: Vercel Dashboard (Önerilen)**

1. **Vercel Dashboard'a gidin**: [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Proje bulun**: `bilgisayar-teknik-servis-takip`
3. **Settings > General > Root Directory**: `.` (root olarak ayarlayın)
4. **Deployments** sekmesine gidin
5. **"Redeploy"** butonuna tıklayın
6. **Build Command**: `npm run build` (eğer varsa)
7. **Output Directory**: `dist` veya `build`

### **Seçenek 2: Git Push (Mevcut)**

**Sorun**: Git push çalışmıyor çünkü Vercel CLI interference var

**Çözüm**: Manuel deployment kullanın

### **Seçenek 3: Drag & Drop**

1. **Proje klasörünü zip yapın**
2. **Vercel'e gidin**: [vercel.com/new](https://vercel.com/new)
3. **ZIP dosyasını sürükleyin**
4. **Yeni deployment oluşturun**

### **Seçenek 4: GitHub Integration**

1. **GitHub repository oluşturun**
2. **Kodları push edin**
3. **Vercel'i GitHub'a bağlayın**
4. **Otomatik deployment kurun**

## 📁 Deployment Dosyaları

### **vercel.json**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "functions": {},
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### **package.json** (Eğer yoksa)
```json
{
  "name": "teknik-servis-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "python -m http.server 3000",
    "build": "echo 'No build needed for static site'",
    "start": "python -m http.server 3000"
  }
}
```

## 🛠️ Hızlı Deployment Komutu

**Eğer terminal çalışıyorsa**:
```bash
# Vercel CLI kullanmadan basit deployment
echo "Frontend ready for deployment"
ls -la src/
```

## 🧪 Deployment Sonrası Test

1. **Site açılımı**: `https://bilgisayar-teknik-servis-takip.vercel.app`
2. **API bağlantısı**: Console'da `CONFIG.API_BASE_URL` kontrol edin
3. **Stok listesi**: "Detaylı Arama" → Stok sayfası
4. **Arşiv listesi**: Arşiv sayfası
5. **Fotoğraflar**: Stok kartlarında fotoğraf galerisi
6. **WhatsApp**: Servis kayıtlarında şablon kontrolü

## 🔄 Güncelleme Süreci

1. **Kod değişikliği yapın**
2. **Deployment yapın** (yukarıdaki seçeneklerden biri)
3. **Cache temizleyin** (Ctrl+F5)
4. **Test edin**

## 🚨 Sorun Giderme

### **Eğer deployment sonrası sorun olursa**:

1. **Browser konsolunu açın**
2. **Emergency fix'i çalıştırın**:
   ```javascript
   // src/emergency-fix.js dosyasındaki tüm kodu yapıştırın
   ```

### **API Bağlantı Sorunları**:
- `localStorage.getItem('apiBaseUrl')` kontrol edin
- `debugSystem()` fonksiyonunu çalıştırın
- Backend URL'yi manuel olarak ayarlayın

## 📱 Sistem Özellikleri

- ✅ **Müşteri Yönetimi**: Ekleme, düzenleme, silme
- ✅ **Stok Yönetimi**: Listeleme, fotoğraf galerisi
- ✅ **Arşiv Yönetimi**: Satılmış ürünler, kar/zarar
- ✅ **WhatsApp Entegrasyonu**: Şablon mesajları
- ✅ **Fotoğraf Yönetimi**: Upload, galeri, büyütme
- ✅ **Responsive Design**: Mobil uyumlu

## 🔒 Güvenlik

- ✅ **HTTPS**: Tüm bağlantılar güvenli
- ✅ **API Güvenliği**: Backend CORS koruması
- ✅ **Veri Koruması**: localStorage şifrelemesi yok (gerekirse eklenebilir)

## 📞 Destek

**Deployment sorunları için**:
1. Vercel dashboard'daki deployment loglarını kontrol edin
2. Browser console'da hata mesajlarını inceleyin
3. `debugSystem()` fonksiyonunu çalıştırın
4. Backend API'nin çalışıp çalışmadığını kontrol edin: `https://teknik-servis-backend.onrender.com/api/stok` 