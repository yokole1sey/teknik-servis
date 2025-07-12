const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const config = require('./config');
const app = express();

// CORS ayarları - Production için güvenli
const corsOptions = {
  origin: config.cors.origin,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const customersFile = path.join(__dirname, 'customers.json');
const servislerFile = path.join(__dirname, 'servisler.json');
const stokFile = path.join(__dirname, 'stok.json');
const settingsFile = path.join(__dirname, 'settings.json');
const sirketBilgiFile = path.join(__dirname, 'sirket-bilgi.json');

// Upload ayarları - Production için güvenli
const uploadDir = path.join(__dirname, config.uploadDir || 'upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    cb(null, name + '-' + Date.now() + ext);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: config.maxFileSize || 10 * 1024 * 1024 // 10MB varsayılan
  },
  fileFilter: (req, file, cb) => {
    // Güvenli dosya türleri
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Sadece resim, PDF ve doküman dosyaları yüklenebilir!'));
    }
  }
});

app.use('/upload', express.static(uploadDir));

function loadData(file, fallback) {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (e) {}
  return fallback;
}
function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

let customers = loadData(customersFile, []);
let idCounter = customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1;
let servisler = loadData(servislerFile, []);
let stoklar = loadData(stokFile, []);
let settings = loadData(settingsFile, {
  tema: 'dark',
  whatsappSablonlari: {
    pdf: 'Merhaba! {URUN_CINSI} {MARKA} {MODEL} için hazırladığımız PDF dosyasını gönderiyoruz.\n\nFiyat: {FIYAT}\n\nDetaylı bilgi için aramaktan çekinmeyin.',
    teslim_alindi: 'Sayın {MUSTERI_AD},\n\nKariyer Bilgisayar ve Güvenlik Sistemlerini tercih ettiğiniz için teşekkürler.\n\n{SERVIS_NO} nolu ürününüz teslim alınmıştır. Bizi tercih ettiğiniz için teşekkür ederiz.\n\nÜrününüzün durumu ile ilgili tüm gelişmelerde sizi bilgilendireceğiz.\n\nDetaylı bilgi ve sorularınız için 0553 187 34 35 numaralı telefondan bize ulaşabilirsiniz.',
    onarim: 'Sayın {MUSTERI_AD},\n\nKariyer Bilgisayar ve Güvenlik Sistemlerini tercih ettiğiniz için teşekkürler.\n\n{SERVIS_NO} nolu ürününüz Onarım sürecindedir. Bizi tercih ettiğiniz için teşekkür ederiz.\n\nÜrününüzün durumu ile ilgili tüm gelişmelerde sizi bilgilendireceğiz.\n\nDetaylı bilgi ve sorularınız için 0553 187 34 35 numaralı telefondan bize ulaşabilirsiniz.',
    tamamlandi: 'Sayın {MUSTERI_AD},\n\nKariyer Bilgisayar ve Güvenlik Sistemlerini tercih ettiğiniz için teşekkürler.\n\n{SERVIS_NO} nolu ürününüz Onarım süreci tamamlanmıştır.\n\nBizi tercih ettiğiniz için teşekkür ederiz.\n\nÜrününüzü Hafta içi her gün 10:00 - 18:00 saatleri arasında teslim alabilirsiniz.\n\nDetaylı bilgi ve sorularınız için 0553 187 34 35 numaralı telefondan bize ulaşabilirsiniz.',
    teslim_edildi: 'Sayın {MUSTERI_AD},\n\nKariyer Bilgisayar ve Güvenlik Sistemlerini tercih ettiğiniz için teşekkürler.\n\n{SERVIS_NO} nolu ürününüz teslim edilmiştir. Bizi tercih ettiğiniz için teşekkür ederiz.\n\nMemnuniyetiniz bizim için çok önemli. Google\'da değerlendirmenizi paylaşarak diğer müşterilerimize yardımcı olabilirsiniz:\n\nhttps://g.page/r/CUOWK40sRX2aEBM/review\n\nDetaylı bilgi ve sorularınız için 0553 187 34 35 numaralı telefondan bize ulaşabilirsiniz.',
    iade_edildi: 'Sayın {MUSTERI_AD},\n\nKariyer Bilgisayar ve Güvenlik Sistemlerini tercih ettiğiniz için teşekkürler.\n\n{SERVIS_NO} nolu ürününüz iade edilmiştir. Anlayışınız için teşekkür ederiz.\n\nDetaylı bilgi ve sorularınız için 0553 187 34 35 numaralı telefondan bize ulaşabilirsiniz.',
    beklemede: 'Sayın {MUSTERI_AD},\n\n{SERVIS_NO} nolu cihazınız için güncelleme:\n\n📋 Ürün: {URUN_CINSI} {MARKA} {MODEL}\n📊 Durum: İşlem Bekliyor\n📄 Açıklama: {ACIKLAMA}\n\nİşlem tamamlandığında bilgilendirileceksiniz.\n\nKariyer Bilgisayar ve Güvenlik Sistemleri\n📞 0553 187 34 35',
    iptal: 'Sayın {MUSTERI_AD},\n\n{SERVIS_NO} nolu servis kaydınız iptal edilmiştir.\n\n📋 Ürün: {URUN_CINSI} {MARKA} {MODEL}\n📄 İptal Sebebi: {ACIKLAMA}\n\nAnlayışınız için teşekkür ederiz.\n\nKariyer Bilgisayar ve Güvenlik Sistemleri\n📞 0553 187 34 35',
    servis: 'Sayın {MUSTERI_AD},\n\n{SERVIS_NO} nolu servis kaydınız için bilgilendirme:\n\n📋 Ürün: {URUN_CINSI} {MARKA} {MODEL}\n📊 Durum: {DURUM}\n📄 Açıklama: {ACIKLAMA}\n\nKariyer Bilgisayar ve Güvenlik Sistemleri\n📞 0553 187 34 35'
  },
  makbuzSablonu: {
    firmaAd: 'Kariyer Bilgisayar ve Güvenlik Sistemleri',
    telefon: 'Tel: 0553 187 34 35 - 0216 379 99 72',
    uyariMetni: '30 gun icinde alinmayan urunlerden firmamiz sorumlu degildir.'
  },
  sistem: {
    sayfaBoyutu: 25,
    otomatikYenileme: true,
    bildirimler: true
  },
  yedekleme: {
    otomatikYedekleme: false,
    yedeklemeSaati: '02:00',
    yedeklemeAraligi: 'gunluk'
  },
  yazdirma: {
    varsayilanYazici: '',
    kagitBoyutu: 'A4',
    yonlendirme: 'dikey'
  }
});

// Şirket bilgilerini yükle
let sirketBilgi = loadData(sirketBilgiFile, {
  sirketAdi: 'Kariyer Bilisim',
  sirketLogo: 'K',
  sirketAciklama: 'Teknik Servis & Bilgisayar Hizmetleri',
  sirketTelefon: '0553 187 34 35 - 0216 379 99 72',
  sirketWebsite: '',
  raporBaslik: 'Servis Kayitlari Raporu'
});

// Müşteri ekle
app.post('/api/customers', (req, res) => {
  const { adsoyad, telefon, mail, notlar } = req.body;
  if (!adsoyad || !telefon) {
    return res.status(400).json({ error: 'Ad Soyad ve Telefon zorunludur.' });
  }
  const newCustomer = {
    id: idCounter++,
    adsoyad,
    telefon,
    mail: mail || '',
    notlar: notlar || ''
  };
  customers.unshift(newCustomer);
  saveData(customersFile, customers);
  res.status(201).json(newCustomer);
});

// Müşteri güncelle
app.put('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  const { adsoyad, telefon, mail, notlar } = req.body;
  const idx = customers.findIndex(c => c.id == id);
  if (idx === -1) return res.status(404).json({ error: 'Kayıt bulunamadı.' });
  customers[idx] = { ...customers[idx], adsoyad, telefon, mail: mail || '', notlar: notlar || '' };
  saveData(customersFile, customers);
  res.json(customers[idx]);
});

// Müşteri sil
app.delete('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  const idx = customers.findIndex(c => c.id == id);
  if (idx === -1) return res.status(404).json({ error: 'Kayıt bulunamadı.' });
  const musteri = customers[idx];
  // Servis kaydı kontrolü
  const servisKaydiVar = servisler.some(s => s.adsoyad === musteri.adsoyad);
  if (servisKaydiVar) {
    return res.status(409).json({ error: 'Servis kaydı olduğu için silinemez. İlk önce servis kaydını siliniz.' });
  }
  customers.splice(idx, 1);
  saveData(customersFile, customers);
  res.json({ success: true });
});

// Müşteri listesi
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

// Servis kaydı ekle
app.post('/api/servis', (req, res) => {
  const { servisno, adsoyad, uruncinsi, marka, model, aciklama, durum, teslimalinan, teslimedilen, fiyat, not } = req.body;
  if (!servisno || !adsoyad || !uruncinsi || !marka || !model || !durum || !teslimalinan) {
    return res.status(400).json({ error: 'Zorunlu alanlar eksik.' });
  }
  const yeniKayit = { servisno, adsoyad, uruncinsi, marka, model, aciklama, durum, teslimalinan, teslimedilen, fiyat, not };
  servisler.unshift(yeniKayit);
  saveData(servislerFile, servisler);
  res.status(201).json(yeniKayit);
});

// Servis kaydı güncelle
app.put('/api/servis/:servisno', (req, res) => {
  const { servisno } = req.params;
  const idx = servisler.findIndex(s => s.servisno == servisno);
  if (idx === -1) return res.status(404).json({ error: 'Kayıt bulunamadı.' });
  servisler[idx] = { ...servisler[idx], ...req.body };
  saveData(servislerFile, servisler);
  res.json(servisler[idx]);
});

// Servis kayıtlarını listele (isteğe bağlı müşteri filtresi)
app.get('/api/servis', (req, res) => {
  const musteri = req.query.musteri;
  if (musteri) {
    return res.json(servisler.filter(s => s.adsoyad === musteri));
  }
  res.json(servisler);
});

// Servis kaydı sil
app.delete('/api/servis/:servisno', (req, res) => {
  const { servisno } = req.params;
  const idx = servisler.findIndex(s => s.servisno == servisno);
  if (idx === -1) return res.status(404).json({ error: 'Kayıt bulunamadı.' });
  servisler.splice(idx, 1);
  saveData(servislerFile, servisler);
  res.json({ success: true });
});

// Stok ekle
app.post('/api/stok', (req, res) => {
  const stok = req.body;
  if (!stok.stokno || !stok.uruncinsi || !stok.marka || !stok.model) {
    return res.status(400).json({ error: 'Zorunlu alanlar eksik.' });
  }
  stok.vitrinfoto = stok.vitrinfoto || '';
  stoklar.unshift(stok);
  saveData(stokFile, stoklar);
  res.status(201).json(stok);
});
// Stok güncelle
app.put('/api/stok/:stokno', (req, res) => {
  const { stokno } = req.params;
  const idx = stoklar.findIndex(s => s.stokno == stokno);
  if (idx === -1) return res.status(404).json({ error: 'Kayıt bulunamadı.' });
  stoklar[idx] = { ...stoklar[idx], ...req.body, vitrinfoto: req.body.vitrinfoto || '' };
  saveData(stokFile, stoklar);
  res.json(stoklar[idx]);
});
// Stok sil
app.delete('/api/stok/:stokno', (req, res) => {
  const { stokno } = req.params;
  const idx = stoklar.findIndex(s => s.stokno == stokno);
  if (idx === -1) return res.status(404).json({ error: 'Kayıt bulunamadı.' });
  stoklar.splice(idx, 1);
  saveData(stokFile, stoklar);
  res.json({ success: true });
});
// Stok listele
app.get('/api/stok', (req, res) => {
  res.json(stoklar);
});

// Arşiv listele (satılmış ürünler)
app.get('/api/arsiv', (req, res) => {
  // Satış tarihi olan ürünleri arşiv olarak döndür
  const arsivUrunler = stoklar.filter(stok => stok.satilan && stok.satilan.trim() !== '');
  res.json(arsivUrunler);
});

app.post('/api/upload', upload.array('files', 10), (req, res) => {
  const urls = req.files.map(f => '/upload/' + f.filename);
  res.json({ urls });
});

// === SETTINGS API ===

// Tüm ayarları al
app.get('/api/settings', (req, res) => {
  res.json(settings);
});

// Belirli kategori ayarlarını al
app.get('/api/settings/:category', (req, res) => {
  const { category } = req.params;
  
  if (!settings[category]) {
    return res.status(404).json({ error: 'Kategori bulunamadı' });
  }
  
  res.json(settings[category]);
});

// Ayarları güncelle
app.put('/api/settings/:category', (req, res) => {
  const { category } = req.params;
  const newSettings = req.body;
  
  if (!settings[category]) {
    return res.status(404).json({ error: 'Kategori bulunamadı' });
  }
  
  // Ayarları güncelle
  settings[category] = { ...settings[category], ...newSettings };
  
  // Dosyaya kaydet
  saveData(settingsFile, settings);
  
  res.json(settings[category]);
});

// Tüm ayarları sıfırla
app.post('/api/settings/reset', (req, res) => {
  const defaultSettings = {
    tema: 'dark',
    whatsappSablonlari: {
      pdf: 'Merhaba! {URUN_CINSI} {MARKA} {MODEL} için hazırladığımız PDF dosyasını gönderiyoruz.\n\nFiyat: {FIYAT}\n\nDetaylı bilgi için aramaktan çekinmeyin.',
      teslim_alindi: 'Sayın {MUSTERI_AD},\n\nKariyer Bilgisayar ve Güvenlik Sistemlerini tercih ettiğiniz için teşekkürler.\n\n{SERVIS_NO} nolu ürününüz teslim alınmıştır. Bizi tercih ettiğiniz için teşekkür ederiz.\n\nÜrününüzün durumu ile ilgili tüm gelişmelerde sizi bilgilendireceğiz.\n\nDetaylı bilgi ve sorularınız için 0553 187 34 35 numaralı telefondan bize ulaşabilirsiniz.',
      onarim: 'Sayın {MUSTERI_AD},\n\nKariyer Bilgisayar ve Güvenlik Sistemlerini tercih ettiğiniz için teşekkürler.\n\n{SERVIS_NO} nolu ürününüz Onarım sürecindedir. Bizi tercih ettiğiniz için teşekkür ederiz.\n\nÜrününüzün durumu ile ilgili tüm gelişmelerde sizi bilgilendireceğiz.\n\nDetaylı bilgi ve sorularınız için 0553 187 34 35 numaralı telefondan bize ulaşabilirsiniz.',
      tamamlandi: 'Sayın {MUSTERI_AD},\n\nKariyer Bilgisayar ve Güvenlik Sistemlerini tercih ettiğiniz için teşekkürler.\n\n{SERVIS_NO} nolu ürününüz Onarım süreci tamamlanmıştır.\n\nBizi tercih ettiğiniz için teşekkür ederiz.\n\nÜrününüzü Hafta içi her gün 10:00 - 18:00 saatleri arasında teslim alabilirsiniz.\n\nDetaylı bilgi ve sorularınız için 0553 187 34 35 numaralı telefondan bize ulaşabilirsiniz.',
      teslim_edildi: 'Sayın {MUSTERI_AD},\n\nKariyer Bilgisayar ve Güvenlik Sistemlerini tercih ettiğiniz için teşekkürler.\n\n{SERVIS_NO} nolu ürününüz teslim edilmiştir. Bizi tercih ettiğiniz için teşekkür ederiz.\n\nMemnuniyetiniz bizim için çok önemli. Google\'da değerlendirmenizi paylaşarak diğer müşterilerimize yardımcı olabilirsiniz:\n\nhttps://g.page/r/CUOWK40sRX2aEBM/review\n\nDetaylı bilgi ve sorularınız için 0553 187 34 35 numaralı telefondan bize ulaşabilirsiniz.',
      iade_edildi: 'Sayın {MUSTERI_AD},\n\nKariyer Bilgisayar ve Güvenlik Sistemlerini tercih ettiğiniz için teşekkürler.\n\n{SERVIS_NO} nolu ürününüz iade edilmiştir. Anlayışınız için teşekkür ederiz.\n\nDetaylı bilgi ve sorularınız için 0553 187 34 35 numaralı telefondan bize ulaşabilirsiniz.',
      beklemede: 'Sayın {MUSTERI_AD},\n\n{SERVIS_NO} nolu cihazınız için güncelleme:\n\n📋 Ürün: {URUN_CINSI} {MARKA} {MODEL}\n📊 Durum: İşlem Bekliyor\n📄 Açıklama: {ACIKLAMA}\n\nİşlem tamamlandığında bilgilendirileceksiniz.\n\nKariyer Bilgisayar ve Güvenlik Sistemleri\n📞 0553 187 34 35',
      iptal: 'Sayın {MUSTERI_AD},\n\n{SERVIS_NO} nolu servis kaydınız iptal edilmiştir.\n\n📋 Ürün: {URUN_CINSI} {MARKA} {MODEL}\n📄 İptal Sebebi: {ACIKLAMA}\n\nAnlayışınız için teşekkür ederiz.\n\nKariyer Bilgisayar ve Güvenlik Sistemleri\n📞 0553 187 34 35',
      servis: 'Sayın {MUSTERI_AD},\n\n{SERVIS_NO} nolu servis kaydınız için bilgilendirme:\n\n📋 Ürün: {URUN_CINSI} {MARKA} {MODEL}\n📊 Durum: {DURUM}\n📄 Açıklama: {ACIKLAMA}\n\nKariyer Bilgisayar ve Güvenlik Sistemleri\n📞 0553 187 34 35'
    },
    makbuzSablonu: {
      firmaAd: 'Kariyer Bilgisayar ve Güvenlik Sistemleri',
      telefon: 'Tel: 0553 187 34 35 - 0216 379 99 72',
      uyariMetni: '30 gun icinde alinmayan urunlerden firmamiz sorumlu degildir.'
    },
    sistem: {
      sayfaBoyutu: 25,
      otomatikYenileme: true,
      bildirimler: true
    },
    yedekleme: {
      otomatikYedekleme: false,
      yedeklemeSaati: '02:00',
      yedeklemeAraligi: 'gunluk'
    },
    yazdirma: {
      varsayilanYazici: '',
      kagitBoyutu: 'A4',
      yonlendirme: 'dikey'
    }
  };
  
  settings = defaultSettings;
  saveData(settingsFile, settings);
  
  res.json({ message: 'Ayarlar sıfırlandı', settings });
});

// === ŞİRKET BİLGİLERİ API ===

// Şirket bilgilerini al
app.get('/api/sirket-bilgi', (req, res) => {
  res.json(sirketBilgi);
});

// Şirket bilgilerini güncelle
app.post('/api/sirket-bilgi', (req, res) => {
  const { sirketAdi, sirketLogo, sirketAciklama, sirketTelefon, sirketWebsite, raporBaslik } = req.body;
  
  sirketBilgi = {
    sirketAdi: sirketAdi || sirketBilgi.sirketAdi,
    sirketLogo: sirketLogo || sirketBilgi.sirketLogo,
    sirketAciklama: sirketAciklama || sirketBilgi.sirketAciklama,
    sirketTelefon: sirketTelefon || sirketBilgi.sirketTelefon,
    sirketWebsite: sirketWebsite || sirketBilgi.sirketWebsite,
    raporBaslik: raporBaslik || sirketBilgi.raporBaslik
  };
  
  saveData(sirketBilgiFile, sirketBilgi);
  
  res.json(sirketBilgi);
});

// Şirket bilgilerini sıfırla
app.post('/api/sirket-bilgi/reset', (req, res) => {
  const defaultSirketBilgi = {
    sirketAdi: 'Kariyer Bilisim',
    sirketLogo: 'K',
    sirketAciklama: 'Teknik Servis & Bilgisayar Hizmetleri',
    sirketTelefon: '0553 187 34 35 - 0216 379 99 72',
    sirketWebsite: '',
    raporBaslik: 'Servis Kayitlari Raporu'
  };
  
  sirketBilgi = defaultSirketBilgi;
  saveData(sirketBilgiFile, sirketBilgi);
  
  res.json({ message: 'Şirket bilgileri sıfırlandı', sirketBilgi });
});

// Vercel serverless functions için export
module.exports = app;

// Local development için server başlatma
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(config.port, config.host, () => {
    console.log(`🚀 Backend API çalışıyor:`);
    console.log(`   URL: http://${config.host}:${config.port}`);
    console.log(`   Ortam: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   CORS: ${JSON.stringify(config.cors.origin)}`);
    console.log(`   Tarih: ${new Date().toLocaleString('tr-TR')}`);
  });

  // Graceful shutdown - Production için güvenli kapatma
  process.on('SIGTERM', () => {
    console.log('🔄 Sunucu kapatılıyor...');
    server.close(() => {
      console.log('✅ Sunucu güvenli şekilde kapatıldı');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('🔄 Sunucu kapatılıyor...');
    server.close(() => {
      console.log('✅ Sunucu güvenli şekilde kapatıldı');
      process.exit(0);
    });
  });
}