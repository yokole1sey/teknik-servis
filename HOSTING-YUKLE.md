# 🚀 HOSTING'E YÜKLEME REHBERİ

---**Kariyer Teknik Servis Yönetim Sistemi**


## 📋 ÖN HAZIRLIK

### **Gereksinimler**
- ✅ **Node.js**: v14.0.0 veya üzeri
- ✅ **npm**: v6.0.0 veya üzeri  
- ✅ **SSH erişimi** olan hosting
- ✅ **Domain adı** (SSL ile)

### **Kontrol Listesi**
- [ ] Hosting hesabı hazır
- [ ] Domain DNS ayarları yapıldı
- [ ] SSH/FTP bilgileri mevcut
- [ ] Proje dosyaları hazır

---

## 🌐 ADIM 1: DOMAIN AYARLARI

### **A. DNS Ayarları**
```
A Record: @ → Hosting IP adresi
A Record: www → Hosting IP adresi
```

### **B. Backend Config Dosyası**
**`backend/config.js`** dosyasını düzenleyin:
```javascript
production: {
  cors: {
    origin: 'https://yourdomain.com'  // ← KENDİ DOMAIN'İNİZİ YAZIN
  }
}
```

### **C. PM2 Config Dosyası**
**`backend/ecosystem.config.js`** dosyasını düzenleyin:
```javascript
env_production: {
  CORS_ORIGIN: 'https://yourdomain.com'  // ← KENDİ DOMAIN'İNİZİ YAZIN
}
```

---

## 📁 ADIM 2: DOSYALARI YÜKLEME

### **Seçenek A: FTP/SFTP ile**
```
1. FileZilla veya benzeri FTP programı ile bağlanın
2. Tüm proje dosyalarını ana dizine yükleyin
3. Dizin yapısı şöyle olmalı:
   /home/username/
   ├── backend/
   ├── src/
   ├── public/
   ├── package.json
   ├── deploy.sh
   └── README.md
```

### **Seçenek B: Git ile (Önerilen)**
```bash
# SSH ile sunucuya bağlanın
ssh username@your-server.com

# Proje dizinine gidin
cd /home/username/

# Git ile projeyi klonlayın
git clone https://github.com/youruser/kariyer-teknik-servis.git
cd kariyer-teknik-servis
```

---

## ⚙️ ADIM 3: SUNUCU KURULUMU

### **A. Node.js Kontrolü**
```bash
# Node.js versiyonunu kontrol edin
node --version  # v14.0.0+ olmalı
npm --version   # v6.0.0+ olmalı

# Eğer yüklü değilse:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### **B. PM2 Kurulumu**
```bash
# PM2'yi global olarak yükleyin
sudo npm install -g pm2
```

### **C. Otomatik Deploy**
```bash
# Deploy scriptini çalıştırılabilir yapın
chmod +x deploy.sh

# Deploy scriptini çalıştırın
./deploy.sh
```

**VEYA Manuel Kurulum:**
```bash
# Backend bağımlılıklarını yükle
cd backend
npm install --production

# Upload ve logs dizinlerini oluştur
mkdir -p upload logs
chmod 755 upload logs

# Production modunda başlat
pm2 start ecosystem.config.js --env production

# Otomatik başlatma ayarla
pm2 startup
pm2 save
```

---

## 🌐 ADIM 4: WEB SERVER AYARLARI

### **Apache (.htaccess)**
Ana dizinde **`.htaccess`** dosyası oluşturun:
```apache
RewriteEngine On

# API isteklerini backend'e yönlendir
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

# Upload dosyalarını backend'e yönlendir
RewriteRule ^upload/(.*)$ http://localhost:3001/upload/$1 [P,L]

# Diğer tüm istekleri frontend'e yönlendir
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /src/index.html [L]
```

### **Nginx (Alternatif)**
**`/etc/nginx/sites-available/yourdomain.com`** dosyası:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /home/username/kariyer-teknik-servis/src;
    index index.html;
    
    # Frontend dosyalar
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Upload dosyaları proxy
    location /upload {
        proxy_pass http://localhost:3001;
    }
}
```

**Nginx'i etkinleştir:**
```bash
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 ADIM 5: SSL SERTİFİKASI

### **Let's Encrypt (Ücretsiz SSL)**
```bash
# Certbot kurulumu
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Otomatik yenileme kontrolü
sudo systemctl status certbot.timer
```

### **Apache için SSL**
```bash
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
```

---

## 🔧 ADIM 6: GÜVENLİK AYARLARI

### **Firewall Ayarları**
```bash
# UFW firewall kuralları
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3001
sudo ufw enable
```

### **Dosya İzinleri**
```bash
# Doğru izinleri ayarla
chmod -R 755 /home/username/kariyer-teknik-servis
chmod -R 777 /home/username/kariyer-teknik-servis/backend/upload
chmod -R 755 /home/username/kariyer-teknik-servis/backend/logs
```

---

## ✅ ADIM 7: TEST VE DOĞRULAMA

### **A. Servis Durumu**
```bash
# PM2 durumu kontrol et
pm2 status

# Logları kontrol et
pm2 logs kariyer-backend

# Restart (gerekirse)
pm2 restart kariyer-backend
```

### **B. Web Testi**
```bash
# API testi
curl http://localhost:3001/api/customers

# Web sitesi testi
curl https://yourdomain.com
```

### **C. Browser Testi**
1. `https://yourdomain.com` adresine gidin
2. Console'da API bağlantısını kontrol edin
3. Müşteri ekleme/listeleme test edin
4. WhatsApp entegrasyonu test edin

---

## 🛠️ YÖNETİM KOMUTLARI

### **Günlük Kullanım**
```bash
# Durum kontrol
pm2 status

# Logları görüntüle
pm2 logs kariyer-backend

# Yeniden başlat
pm2 restart kariyer-backend

# Durdur
pm2 stop kariyer-backend

# Sil
pm2 delete kariyer-backend
```

### **Güncelleme**
```bash
# Git'ten son değişiklikleri çek
git pull origin main

# Backend bağımlılıklarını güncelle
cd backend && npm install --production

# Servisi yeniden başlat
pm2 restart kariyer-backend
```

### **Yedekleme**
```bash
# Veritabanı dosyalarını yedekle
cp backend/*.json backup/

# Upload dosyalarını yedekle
tar -czf backup/upload-$(date +%Y%m%d).tar.gz backend/upload/
```

---

## ⚠️ SORUN GİDERME

### **Port 3001 Kullanımda**
```bash
# Port kontrolü
lsof -i :3001

# Process'i sonlandır
kill -9 PID_NUMBER
```

### **PM2 Çalışmıyor**
```bash
# PM2'yi yeniden yükle
npm install -g pm2

# Tüm process'leri sil ve yeniden başlat
pm2 kill
pm2 start backend/ecosystem.config.js --env production
```

### **SSL Sertifikası Yenilenemez**
```bash
# Manuel yenileme
sudo certbot renew

# Nginx yeniden yükle
sudo systemctl reload nginx
```

### **API Bağlantı Hatası**
1. **Backend çalışıyor mu?** → `pm2 status`
2. **Port açık mı?** → `lsof -i :3001`
3. **CORS ayarları doğru mu?** → `backend/config.js`
4. **Firewall açık mı?** → `sudo ufw status`

---

## 📞 DESTEK

### **Log Dosyaları**
- **PM2 Logs**: `~/.pm2/logs/`
- **Web Server**: `/var/log/nginx/` veya `/var/log/apache2/`
- **System Logs**: `/var/log/syslog`

### **Önemli Dosyalar**
- **Config**: `backend/config.js`
- **PM2**: `backend/ecosystem.config.js`
- **Frontend Config**: `src/config.js`
- **Web Server**: `.htaccess` veya nginx config

---

## 🎉 BAŞARILI DEPLOY SONRASI

✅ **Kontrol Listesi:**
- [ ] https://yourdomain.com açılıyor
- [ ] API istekleri çalışıyor
- [ ] Müşteri ekleme/listeleme çalışıyor
- [ ] Servis kayıtları çalışıyor
- [ ] WhatsApp entegrasyonu çalışıyor
- [ ] Dosya yükleme çalışıyor
- [ ] SSL sertifikası aktif
- [ ] PM2 servisi çalışıyor

**🎯 Sisteminiz artık canlı ve kullanıma hazır!**

---

## 📋 HIZLI REFERANS

### **Önemli Dizinler**
- **Proje**: `/home/username/kariyer-teknik-servis/`
- **Backend**: `/home/username/kariyer-teknik-servis/backend/`
- **Frontend**: `/home/username/kariyer-teknik-servis/src/`
- **Upload**: `/home/username/kariyer-teknik-servis/backend/upload/`

### **Önemli Komutlar**
```bash
# Durum
pm2 status

# Loglar
pm2 logs kariyer-backend

# Restart
pm2 restart kariyer-backend

# Güncelleme
git pull && cd backend && npm install && pm2 restart kariyer-backend
```

### **Acil Durum**
```bash
# Tüm servisleri durdur
pm2 stop all

# Yeniden başlat
pm2 start all

# Reset
pm2 kill
./deploy.sh
```

---

**📅 Bu rehberi kaydedin ve hosting işlemi yaparken adım adım takip edin!** 