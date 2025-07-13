const fs = require('fs');
const path = require('path');

// JSON dosya yolları
const stokFile = path.join(process.cwd(), 'backend', 'stok.json');

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

  let stoklar = loadData(stokFile, []);

  if (req.method === 'GET') {
    res.json(stoklar);
  } 
  else if (req.method === 'POST') {
    const stok = req.body;
    
    if (!stok.stokno || !stok.uruncinsi || !stok.marka || !stok.model) {
      return res.status(400).json({ error: 'Zorunlu alanlar eksik.' });
    }

    stok.vitrinfoto = stok.vitrinfoto || '';
    stoklar.unshift(stok);
    saveData(stokFile, stoklar);
    res.status(201).json(stok);
  } 
  else if (req.method === 'PUT') {
    const { stokno } = req.query;
    const idx = stoklar.findIndex(s => s.stokno == stokno);
    
    if (idx === -1) {
      return res.status(404).json({ error: 'Kayıt bulunamadı.' });
    }

    stoklar[idx] = { 
      ...stoklar[idx], 
      ...req.body, 
      vitrinfoto: req.body.vitrinfoto || '' 
    };
    
    saveData(stokFile, stoklar);
    res.json(stoklar[idx]);
  } 
  else if (req.method === 'DELETE') {
    const { stokno } = req.query;
    const idx = stoklar.findIndex(s => s.stokno == stokno);
    
    if (idx === -1) {
      return res.status(404).json({ error: 'Kayıt bulunamadı.' });
    }

    stoklar.splice(idx, 1);
    saveData(stokFile, stoklar);
    res.json({ success: true });
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 