require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ev-charging',
  sessionSecret: process.env.SESSION_SECRET || 'default-secret',
  payos: {
    clientId: process.env.PAYOS_CLIENT_ID,
    apiKey: process.env.PAYOS_API_KEY,
    checksumKey: process.env.PAYOS_CHECKSUM_KEY
  },
  baseUrl: process.env.BASE_URL || 'http://localhost:3000'
};
