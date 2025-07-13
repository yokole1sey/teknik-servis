const fs = require('fs');
const path = require('path');

// JSON dosya yolları
const customersFile = path.join(process.cwd(), 'backend', 'customers.json');

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

  let customers = loadData(customersFile, []);
  let idCounter = customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1;

  if (req.method === 'GET') {
    res.status(200).json(customers);
  } 
  else if (req.method === 'POST') {
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
  } 
  else if (req.method === 'PUT') {
    const { id } = req.query;
    const { adsoyad, telefon, mail, notlar } = req.body;
    
    const idx = customers.findIndex(c => c.id == id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Kayıt bulunamadı.' });
    }

    customers[idx] = { 
      ...customers[idx], 
      adsoyad, 
      telefon, 
      mail: mail || '', 
      notlar: notlar || '' 
    };
    
    saveData(customersFile, customers);
    res.json(customers[idx]);
  } 
  else if (req.method === 'DELETE') {
    const { id } = req.query;
    const idx = customers.findIndex(c => c.id == id);
    
    if (idx === -1) {
      return res.status(404).json({ error: 'Kayıt bulunamadı.' });
    }

    customers.splice(idx, 1);
    saveData(customersFile, customers);
    res.json({ success: true });
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 