/**
 * Test script using older Realm version
 */

const Realm = require('realm');
const path = require('path');
const fs = require('fs');

const realmPath = path.join(__dirname, '../../assets/Datasets/en/NLT/SourceView.realm');

// Encryption key from legacy RCTEmdros.m
const KEY_STRING = '3fab2edcd8663c6baa91ffeb928ec61e011b19ed866d7365e7d194e43dc47264';

console.log('Testing Realm encryption key formats...\n');

// Test 1: Key as ASCII string bytes (64 chars = 64 bytes)
console.log('Test 1: ASCII string bytes (64 bytes)...');
try {
  const key = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    key[i] = KEY_STRING.charCodeAt(i);
  }
  console.log('Key (first 16 bytes):', Array.from(key.slice(0, 16)));
  
  const realm = new Realm({ path: realmPath, encryptionKey: key });
  console.log('✅ SUCCESS with ASCII key!');
  console.log('Schema:', realm.schema.map(s => s.name));
  realm.close();
  process.exit(0);
} catch (error) {
  console.log('❌ Failed:', error.message.slice(0, 150));
}

console.log('');

// Test 2: Hex decoded to 32 bytes, zero-padded to 64
console.log('Test 2: Hex-decoded (32 bytes, zero-padded to 64)...');
try {
  const hexBytes = Buffer.from(KEY_STRING, 'hex');
  const key = new Uint8Array(64);
  for (let i = 0; i < 32; i++) {
    key[i] = hexBytes[i];
  }
  console.log('Key (first 16 bytes):', Array.from(key.slice(0, 16)));
  
  const realm = new Realm({ path: realmPath, encryptionKey: key });
  console.log('✅ SUCCESS with hex-padded key!');
  console.log('Schema:', realm.schema.map(s => s.name));
  realm.close();
  process.exit(0);
} catch (error) {
  console.log('❌ Failed:', error.message.slice(0, 150));
}

console.log('');

// Test 3: Hex decoded to 32 bytes, repeated to make 64
console.log('Test 3: Hex-decoded (32 bytes, repeated to make 64)...');
try {
  const hexBytes = Buffer.from(KEY_STRING, 'hex');
  const key = new Uint8Array(64);
  for (let i = 0; i < 32; i++) {
    key[i] = hexBytes[i];
    key[i + 32] = hexBytes[i];
  }
  console.log('Key (first 16 bytes):', Array.from(key.slice(0, 16)));
  
  const realm = new Realm({ path: realmPath, encryptionKey: key });
  console.log('✅ SUCCESS with repeated hex key!');
  console.log('Schema:', realm.schema.map(s => s.name));
  realm.close();
  process.exit(0);
} catch (error) {
  console.log('❌ Failed:', error.message.slice(0, 150));
}

console.log('');

// Test 4: Try the raw int array from RCTEmdros.m directly
console.log('Test 4: Raw int array from Objective-C...');
try {
  const rawKey = new Uint8Array([51, 102, 97, 98, 50, 101, 100, 99, 100, 56, 54, 54, 51, 99, 54, 98, 97, 97, 57, 49, 102, 102, 101, 98, 57, 50, 56, 101, 99, 54, 49, 101, 48, 49, 49, 98, 49, 57, 101, 100, 56, 54, 54, 100, 55, 51, 54, 53, 101, 55, 100, 49, 57, 52, 101, 52, 51, 100, 99, 52, 55, 50, 54, 52]);
  console.log('Key length:', rawKey.length);
  console.log('Key as string:', String.fromCharCode(...rawKey));
  
  const realm = new Realm({ path: realmPath, encryptionKey: rawKey });
  console.log('✅ SUCCESS with raw int array!');
  console.log('Schema:', realm.schema.map(s => s.name));
  realm.close();
  process.exit(0);
} catch (error) {
  console.log('❌ Failed:', error.message.slice(0, 150));
}

console.log('');
console.log('All encryption key formats failed.');
console.log('The file may be encrypted with a different key or use a different Realm version.');
