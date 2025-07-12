#!/bin/bash

# Kariyer Teknik Servis - Production Deploy Script
# Sunucuya deploy etmek için bu scripti çalıştırın

echo "🚀 Kariyer Teknik Servis - Production Deploy Başlatılıyor..."

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Hata durumunda scripti durdur
set -e

# Proje dizinini kontrol et
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Hata: package.json bulunamadı. Lütfen proje dizininde olduğunuzdan emin olun.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Sistem Bilgileri:${NC}"
echo "   - Node.js: $(node --version)"
echo "   - npm: $(npm --version)"
echo "   - Tarih: $(date)"

# Node.js version check
NODE_VERSION=$(node --version | cut -d'v' -f2)
if [ "$(printf '%s\n' "14.0.0" "$NODE_VERSION" | sort -V | head -n1)" != "14.0.0" ]; then
    echo -e "${RED}❌ Node.js v14.0.0 veya üzeri gerekli. Mevcut: v$NODE_VERSION${NC}"
    exit 1
fi

# PM2 kontrolü
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️ PM2 bulunamadı. Yükleniyor...${NC}"
    npm install -g pm2
fi

# Backend dependencies
echo -e "${BLUE}📦 Backend bağımlılıkları yükleniyor...${NC}"
cd backend
npm install --production

# Upload ve logs dizinlerini oluştur
echo -e "${BLUE}📁 Dizin yapısı oluşturuluyor...${NC}"
mkdir -p upload logs

# Dosya izinlerini ayarla
chmod 755 upload
chmod 755 logs

# Geri ana dizine dön
cd ..

# Frontend config dosyasını kontrol et
if [ ! -f "src/config.js" ]; then
    echo -e "${RED}❌ Frontend config dosyası bulunamadı!${NC}"
    exit 1
fi

# Önceki PM2 process'ini durdur
echo -e "${BLUE}🔄 Önceki servis durdurulıyor...${NC}"
cd backend
pm2 delete kariyer-backend 2>/dev/null || true

# Production modunda başlat
echo -e "${BLUE}🚀 Production servisi başlatılıyor...${NC}"
pm2 start ecosystem.config.js --env production

# PM2 startup (sistem yeniden başlatıldığında otomatik başlatma)
echo -e "${BLUE}⚙️ Otomatik başlatma ayarlanıyor...${NC}"
pm2 startup
pm2 save

# Durum kontrolü
echo -e "${BLUE}📊 Servis durumu:${NC}"
pm2 status

# Backend geri dön
cd ..

echo -e "${GREEN}✅ Deploy başarıyla tamamlandı!${NC}"
echo ""
echo -e "${BLUE}🔗 Bağlantı Bilgileri:${NC}"
echo "   - Backend API: http://localhost:3001"
echo "   - Frontend: Web server üzerinden erişilebilir"
echo ""
echo -e "${BLUE}🛠️ Yönetim Komutları:${NC}"
echo "   - Durum: pm2 status"
echo "   - Loglar: pm2 logs kariyer-backend"
echo "   - Restart: pm2 restart kariyer-backend"
echo "   - Stop: pm2 stop kariyer-backend"
echo ""
echo -e "${YELLOW}📋 Hatırlatmalar:${NC}"
echo "   - Domain ayarlarını backend/config.js'de güncelleyin"
echo "   - Web server reverse proxy ayarlarını yapın"
echo "   - SSL sertifikasını kurun"
echo "   - Firewall port 3001'i açın"
echo ""
echo -e "${GREEN}🎉 Sistem kullanıma hazır!${NC}" 