require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const DATA_DIR = path.join(__dirname, 'data');
const FILES = [
  { file: 'tags.json', collection: 'tags' },
  { file: 'cuisine.json', collection: 'cuisine' },
  { file: 'recipes.json', collection: 'recipes' },
  { file: 'users.json', collection: 'users' },
  { file: 'reviews.json', collection: 'reviews' }
];

const MONGO_URL = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB;

if (!MONGO_URL || !MONGO_DB) {
  console.error('Please set MONGO_URL and MONGO_DB in your .env file');
  process.exit(1);
}

function convertExtendedJSON(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertExtendedJSON);
  } else if (obj && typeof obj === 'object') {
    if ('$oid' in obj && Object.keys(obj).length === 1) {
      return new ObjectId(obj['$oid']);
    }
    if ('$date' in obj && Object.keys(obj).length === 1) {
      return new Date(obj['$date']);
    }
    const out = {};
    for (const key in obj) {
      out[key] = convertExtendedJSON(obj[key]);
    }
    return out;
  }
  return obj;
}

async function importCollection(db, collectionName, data) {
  const col = db.collection(collectionName);
  await col.deleteMany({});
  if (data.length > 0) {
    const converted = convertExtendedJSON(data);
    await col.insertMany(converted);
  }
}

async function main() {
  const client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(MONGO_DB);
    for (const { file, collection } of FILES) {
      const filePath = path.join(DATA_DIR, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
      }
      const raw = fs.readFileSync(filePath, 'utf-8');
      let data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        console.error(`Failed to parse ${file}:`, e.message);
        continue;
      }
      console.log(`Importing ${data.length} documents into ${collection}...`);
      await importCollection(db, collection, data);
      console.log(`Imported ${data.length} documents into ${collection}`);
    }
    console.log('All data imported successfully!');
  } catch (err) {
    console.error('Import failed:', err);
  } finally {
    await client.close();
  }
}

main();
