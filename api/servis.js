const fs = require('fs');
const path = require('path');

// JSON dosya yolları
const servislerFile = path.join(process.cwd(), 'backend', 'servisler.json');

function loadData(file, fallback) {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading data:', e);
  }
  return fallback;
}

function saveData(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving data:', e);
  }
}

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let servisler = loadData(servislerFile, []);

  if (req.method === 'GET') {
    const musteri = req.query.musteri;
    if (musteri) {
      return res.json(servisler.filter(s => s.adsoyad === musteri));
    }
    res.json(servisler);
  } 
  else if (req.method === 'POST') {
    const { servisno, adsoyad, uruncinsi, marka, model, aciklama, durum, teslimalinan, teslimedilen, fiyat, not } = req.body;
    
    if (!servisno || !adsoyad || !uruncinsi || !marka || !model || !durum || !teslimalinan) {
      return res.status(400).json({ error: 'Zorunlu alanlar eksik.' });
    }

    const yeniKayit = { 
      servisno, adsoyad, uruncinsi, marka, model, aciklama, durum, teslimalinan, teslimedilen, fiyat, not 
    };
    
    servisler.unshift(yeniKayit);
    saveData(servislerFile, servisler);
    res.status(201).json(yeniKayit);
  } 
  else if (req.method === 'PUT') {
    const { servisno } = req.query;
    const idx = servisler.findIndex(s => s.servisno == servisno);
    
    if (idx === -1) {
      return res.status(404).json({ error: 'Kayıt bulunamadı.' });
    }

    servisler[idx] = { ...servisler[idx], ...req.body };
    saveData(servislerFile, servisler);
    res.json(servisler[idx]);
  } 
  else if (req.method === 'DELETE') {
    const { servisno } = req.query;
    const idx = servisler.findIndex(s => s.servisno == servisno);
    
    if (idx === -1) {
      return res.status(404).json({ error: 'Kayıt bulunamadı.' });
    }

    servisler.splice(idx, 1);
    saveData(servislerFile, servisler);
    res.json({ success: true });
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 