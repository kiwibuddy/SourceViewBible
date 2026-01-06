/**
 * Test script to verify Realm database connection
 * Run with: node scripts/test-realm.js
 */

const Realm = require('realm');
const path = require('path');

// Encryption key from legacy RCTEmdros.m
// This is stored as 64 ASCII characters, which gives us 64 bytes for Realm
const KEY_STRING = '3fab2edcd8663c6baa91ffeb928ec61e011b19ed866d7365e7d194e43dc47264';

function getEncryptionKey() {
  // The key is 64 ASCII characters - each character becomes one byte
  const buf = new ArrayBuffer(64);
  const bufView = new Uint8Array(buf);

  for (let i = 0; i < 64; i++) {
    bufView[i] = KEY_STRING.charCodeAt(i);
  }
  return new Int8Array(buf);
}

async function testConnection() {
  const realmPath = path.join(__dirname, '../assets/Datasets/en/NLT/SourceView.realm');
  
  console.log('Testing Realm database connection...');
  console.log('Path:', realmPath);
  console.log('');

  try {
    const encryptionKey = getEncryptionKey();
    console.log('Encryption key length:', encryptionKey.length, 'bytes');
    
    // Open the Realm database - allow upgrade from older format
    const realm = await Realm.open({
      path: realmPath,
      encryptionKey: encryptionKey,
      // Don't use readOnly to allow format upgrade
    });

    console.log('✅ Successfully connected to Realm database!');
    console.log('');
    
    // List all object types
    const schema = realm.schema;
    console.log('Schema contains', schema.length, 'object types:');
    schema.forEach(s => {
      const count = realm.objects(s.name).length;
      console.log(`  - ${s.name}: ${count} objects`);
    });
    console.log('');

    // Sample data from key collections
    const books = realm.objects('Book');
    if (books.length > 0) {
      console.log('Sample Books:');
      for (let i = 0; i < Math.min(5, books.length); i++) {
        const book = books[i];
        console.log(`  ${i + 1}. ${book.name} (${book.chapterCount} chapters, ${book.wordCount} words)`);
      }
      if (books.length > 5) {
        console.log('  ... and', books.length - 5, 'more');
      }
    }
    console.log('');

    const sources = realm.objects('Actant').filtered('isSource = true');
    if (sources.length > 0) {
      console.log('Sample Sources (first 5):');
      for (let i = 0; i < Math.min(5, sources.length); i++) {
        const source = sources[i];
        console.log(`  ${i + 1}. ${source.name} (${source.wordCount} words)`);
      }
      if (sources.length > 5) {
        console.log('  ... and', sources.length - 5, 'more');
      }
    }
    console.log('');

    const spheres = realm.objects('Sphere');
    if (spheres.length > 0) {
      console.log('Spheres:');
      spheres.forEach(sphere => {
        console.log(`  - ${sphere.name}: ${sphere.wordCount} words`);
      });
    }

    realm.close();
    console.log('');
    console.log('✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to connect to Realm database:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testConnection();
