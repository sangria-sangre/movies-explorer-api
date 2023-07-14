require('dotenv').config();

const {
  NODE_ENV = 'no-production',
  JWT_SECRET,
  MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  PORT = 3000,
} = process.env;

module.exports = { PORT, MONGO_URL, NODE_ENV, JWT_SECRET };