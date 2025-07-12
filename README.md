# Kariyer Teknik Servis Yönetim Sistemi

🔧 **Profesyonel Teknik Servis ve Müşteri Yönetim Platformu**

## 📋 Özellikler

- 👥 **Müşteri Yönetimi** - Detaylı müşteri kayıtları
- 🔧 **Servis Takip** - Cihaz onarım süreçleri
- 📦 **Stok Yönetimi** - Ürün ve fiyat takibi
- 📊 **Raporlama** - Gelişmiş analiz ve raporlar
- 📱 **WhatsApp Entegrasyonu** - Otomatik müşteri bilgilendirme
- 🖨️ **Makbuz Sistemi** - Profesyonel teslim makbuzları
- 🔒 **Güvenlik** - Production ortamı için optimize

## 🚀 Hosting'e Yükleme Rehberi

### 1. Sistem Gereksinimleri

- **Node.js**: v14.0.0 veya üzeri
- **npm**: v6.0.0 veya üzeri
- **PM2**: Process manager (otomatik yüklenecek)

### 2. Sunucuya Yükleme

#### A. Dosyaları Yükleme
```bash
# Projeyi sunucuya yükleyin (FTP/SFTP ile)
# Ana dizin: /home/username/kariyer-teknik-servis/

# Veya Git ile klonlayın
git clone https://github.com/youruser/kariyer-teknik-servis.git
cd kariyer-teknik-servis
```

#### B. Bağımlılıkları Yükleme
```bash
# Backend bağımlılıklarını yükle
npm run install-deps

# PM2'yi global yükle (gerekirse)
npm install -g pm2
```

### 3. Konfigürasyon

#### A. Domain Ayarları
`backend/config.js` dosyasında:
```javascript
production: {
  cors: {
    origin: 'https://yourdomain.com'  // ← Kendi domain'inizi yazın
  }
}
```

#### B. PM2 Ayarları
`backend/ecosystem.config.js` dosyasında:
```javascript
env_production: {
  CORS_ORIGIN: 'https://yourdomain.com'  // ← Kendi domain'inizi yazın
}
```

### 4. Production Başlatma

```bash
# Uygulamayı production modunda başlat
npm run deploy

# Durum kontrol et
npm run pm2-status

# Logları görüntüle
npm run pm2-logs
```

### 5. Web Server Ayarları

#### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
RewriteRule ^(.*)$ /index.html [L]
```

#### Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        root /home/username/kariyer-teknik-servis/src;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. SSL Sertifikası

```bash
# Let's Encrypt ile ücretsiz SSL
certbot --nginx -d yourdomain.com
```

## 🛠️ Yönetim Komutları

```bash
# Uygulamayı başlat
npm run pm2-start

# Uygulamayı durdur
npm run pm2-stop

# Uygulamayı yeniden başlat
npm run pm2-restart

# Uygulamayı sil
npm run pm2-delete

# Durum kontrol
npm run pm2-status

# Logları görüntüle
npm run pm2-logs

# Güncelleme (Git'ten çek ve restart)
npm run update
```

## 🔧 Sorun Giderme

### Port Kontrolü
```bash
# Port 3001 kullanımda mı?
lsof -i :3001

# Process'i sonlandır
kill -9 PID
```

### Log Kontrolü
```bash
# Backend logları
npm run pm2-logs

# Sistem logları
tail -f /var/log/messages
```

### Yeniden Başlatma
```bash
# Tam yeniden başlatma
npm run pm2-delete
npm run pm2-start
```

## 📱 Kullanım

1. **Ana Sayfa**: `https://yourdomain.com`
2. **Müşteri Ekle**: Sol menüden "Müşteri Ekle"
3. **Servis Ekle**: Müşteri seçip "Servis Ekle"
4. **WhatsApp**: Servis durumu güncellendiğinde otomatik mesaj
5. **Raporlar**: "Raporlar" menüsünden detaylı analizler

## 🔒 Güvenlik

- ✅ CORS koruması
- ✅ Dosya yükleme filtreleme
- ✅ Güvenli session yönetimi
- ✅ Production ortamı optimize

## 📞 Destek

- **GitHub**: Issues açabilirsiniz
- **Email**: support@kariyer.com

## 📄 Lisans

MIT License - Ticari kullanım için uygundur.

---

**🎯 Başarılı Deploy için son kontrol:**
- [ ] Domain ayarları yapıldı
- [ ] SSL sertifikası yüklendi
- [ ] PM2 servisi çalışıyor
- [ ] Web server reverse proxy ayarlandı
- [ ] Firewall port 3001 açık
- [ ] Log dosyaları kontrol edildi 