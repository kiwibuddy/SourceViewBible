/**
 * Inspect newBibleNLT1.json structure to find scripture text
 * Run: node scripts/show-bible-structure.js
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../legacy/OtherSVB_Projects/newBibleNLT1.json');

console.log('Loading file...');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const keys = Object.keys(data);

console.log('\n=== OVERVIEW ===');
console.log('Total segments:', keys.length);
console.log('First 20 keys:', keys.slice(0, 20).join(', '));

console.log('\n=== S001 COMPLETE STRUCTURE ===');
const s001 = data['S001'];
if (s001) {
  console.log('Keys in S001:', Object.keys(s001).join(', '));
  
  for (const key of Object.keys(s001)) {
    const value = s001[key];
    console.log('\n--- ' + key + ' ---');
    
    if (Array.isArray(value)) {
      console.log('Type: Array with', value.length, 'items');
      console.log('First 3 items:');
      for (let i = 0; i < Math.min(3, value.length); i++) {
        console.log(`  [${i}]:`, JSON.stringify(value[i]).substring(0, 600));
      }
    } else if (typeof value === 'object' && value !== null) {
      console.log('Type: Object');
      console.log('Preview:', JSON.stringify(value).substring(0, 1000));
    } else {
      console.log('Type:', typeof value);
      console.log('Value:', value);
    }
  }
} else {
  console.log('S001 not found!');
}

console.log('\n=== DONE ===');

