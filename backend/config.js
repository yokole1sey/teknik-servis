// Production Configuration
const config = {
  development: {
    port: process.env.PORT || 3001,
    host: '0.0.0.0',
    cors: {
      origin: ['http://localhost:8080', 'http://127.0.0.1:8080']
    },
    uploadDir: './upload',
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  
  production: {
    port: process.env.PORT || 3001,
    host: '0.0.0.0',
    cors: {
      origin: process.env.CORS_ORIGIN || '*'
    },
    uploadDir: process.env.UPLOAD_DIR || './upload',
    maxFileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024, // 10MB
    security: {
      sessionSecret: process.env.SESSION_SECRET || 'change-this-in-production',
      apiKey: process.env.API_KEY || 'change-this-in-production'
    }
  }
};

const environment = process.env.NODE_ENV || 'development';
module.exports = config[environment]; 