# Node.js Projenizi Railway'e Yükleme Rehberi

## 1. Proje Hazırlığı

### package.json düzenlemesi
```json
{
  "scripts": {
    "start": "cd backend && node server.js",
    "build": "echo 'No build needed'"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### Backend config.js düzenlemesi
```javascript
module.exports = {
  port: process.env.PORT || 3001,
  cors: {
    origin: process.env.FRONTEND_URL || "*"
  },
  uploadDir: process.env.UPLOAD_DIR || "upload",
  maxFileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024
};
```

## 2. Railway Deployment

### Adım 1: Railway'e Kaydolun
1. [railway.app](https://railway.app) adresine gidin
2. GitHub hesabınızla giriş yapın

### Adım 2: Proje Yükleme
1. "New Project" tıklayın
2. "Deploy from GitHub repo" seçin
3. Projenizi seçin

### Adım 3: Environment Variables
```
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-domain.up.railway.app
```

### Adım 4: Domain Ayarları
1. Railway dashboard'da "Settings" seçin
2. "Domains" kısmında custom domain ekleyin
3. Otomatik SSL sertifikası alınır

## 3. Alternatif: Vercel Deployment

### Adım 1: vercel.json oluşturun
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "src/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "src/$1"
    }
  ]
}
```

### Adım 2: Vercel CLI ile Deploy
```bash
npm install -g vercel
vercel --prod
```

## 4. Shared Hosting Alternatifi

Eğer mutlaka shared hosting kullanmak istiyorsanız:

### Node.js Destekli Hostinglar:
- **Hostinger** (Node.js desteği var)
- **A2 Hosting** (Node.js desteği var)
- **SiteGround** (Node.js desteği var)

### Dosya Yükleme:
1. Dosyaları zip olarak yükleyin
2. cPanel'den extract edin
3. Node.js uygulamasını başlatın

## 5. Ücretsiz Alternatifler

### Railway (Önerilen)
- ✅ Ücretsiz 500 saat/ay
- ✅ Otomatik SSL
- ✅ Custom domain
- ✅ Database desteği

### Render
- ✅ Ücretsiz static hosting
- ✅ Otomatik deployment
- ✅ SSL sertifikası

### Vercel
- ✅ Ücretsiz frontend hosting
- ✅ Serverless functions
- ✅ Otomatik deployment

## Hangi Seçeneği Öneriyorum?

**Railway** - En kolay ve güvenilir seçenek
- Projenizi GitHub'a yükleyin
- Railway'e bağlayın
- 5 dakikada yayında!

Bu rehberi takip ederek projenizi kolayca yayınlayabilirsiniz. Hangi seçeneği tercih ederseniz, adım adım yardımcı olabilirim. 