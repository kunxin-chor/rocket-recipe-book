const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

async function connectToMongoDB() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(process.env.MONGO_DB);
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    throw error;
  }
}

function getDb() {
    return db;
}

module.exports = { connectToMongoDB, getDb };