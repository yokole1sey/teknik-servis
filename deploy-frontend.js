const fs = require('fs');
const path = require('path');

// Simple deployment helper
console.log('🚀 Preparing frontend deployment...');

// Check if config is correct
const configPath = path.join(__dirname, 'src', 'config.js');
const configContent = fs.readFileSync(configPath, 'utf8');

if (configContent.includes('teknik-servis-backend.onrender.com')) {
  console.log('✅ Configuration is correct - backend URL points to Render');
} else {
  console.log('❌ Configuration needs updating');
}

// Create deployment info
const deployInfo = {
  timestamp: new Date().toISOString(),
  backend: 'https://teknik-servis-backend.onrender.com',
  frontend: 'https://bilgisayar-teknik-servis-takip.vercel.app'
};

fs.writeFileSync('deployment-info.json', JSON.stringify(deployInfo, null, 2));

console.log('📋 Deployment info created');
console.log('👉 Please manually redeploy on Vercel dashboard or use:');
console.log('   vercel --prod'); 