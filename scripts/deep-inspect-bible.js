/**
 * Deep inspection of newBibleNLT1.json to find scripture text
 * Run with: node scripts/deep-inspect-bible.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../legacy/OtherSVB_Projects/newBibleNLT1.json');
const outputPath = path.join(__dirname, '../bible-inspect-output.txt');

// Redirect console.log to file
const output = [];
const originalLog = console.log;
console.log = (...args) => {
  output.push(args.join(' '));
  originalLog(...args);
};

process.on('exit', () => {
  fs.writeFileSync(outputPath, output.join('\n'));
  originalLog(`\nOutput written to: ${outputPath}`);
});

console.log('Reading and parsing file...');
const raw = fs.readFileSync(filePath, 'utf8');
console.log(`File size: ${(raw.length / 1024 / 1024).toFixed(2)} MB`);

const data = JSON.parse(raw);

const keys = Object.keys(data);
console.log(`\n=== TOP-LEVEL STRUCTURE ===`);
console.log(`Total top-level keys: ${keys.length}`);
console.log(`First 10 keys: ${keys.slice(0, 10).join(', ')}`);
console.log(`Last 10 keys: ${keys.slice(-10).join(', ')}`);

// Examine first segment completely
const firstKey = keys[0];
console.log(`\n=== COMPLETE STRUCTURE OF ${firstKey} ===`);
console.log(JSON.stringify(data[firstKey], null, 2).substring(0, 3000));
console.log('...(truncated)');

// Examine a story segment (S001)
if (data['S001']) {
  console.log(`\n=== COMPLETE STRUCTURE OF S001 ===`);
  const s001 = data['S001'];
  const s001Keys = Object.keys(s001);
  console.log(`Keys in S001: ${s001Keys.join(', ')}`);
  
  for (const key of s001Keys) {
    const value = s001[key];
    if (typeof value === 'string') {
      console.log(`\n${key} (string): "${value.substring(0, 500)}${value.length > 500 ? '...' : ''}"`);
    } else if (Array.isArray(value)) {
      console.log(`\n${key} (array of ${value.length} items):`);
      if (value.length > 0) {
        console.log(`  First item: ${JSON.stringify(value[0]).substring(0, 500)}`);
        if (value.length > 1) {
          console.log(`  Second item: ${JSON.stringify(value[1]).substring(0, 500)}`);
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      const objStr = JSON.stringify(value);
      console.log(`\n${key} (object): ${objStr.substring(0, 1000)}${objStr.length > 1000 ? '...' : ''}`);
    } else {
      console.log(`\n${key}: ${value}`);
    }
  }
}

// Search for any key that might contain scripture text
console.log(`\n=== SEARCHING FOR TEXT CONTENT ===`);
const textKeys = ['text', 'content', 'scripture', 'verse', 'html', 'body', 'passage', 'blocks', 'segments'];
for (const searchKey of textKeys) {
  let found = false;
  for (const segKey of keys.slice(0, 50)) { // Check first 50 segments
    const segment = data[segKey];
    if (segment && segment[searchKey]) {
      console.log(`Found "${searchKey}" in ${segKey}: ${JSON.stringify(segment[searchKey]).substring(0, 200)}`);
      found = true;
      break;
    }
  }
  if (!found) {
    // Also check nested
    for (const segKey of keys.slice(0, 10)) {
      const segment = data[segKey];
      if (segment) {
        for (const innerKey of Object.keys(segment)) {
          const inner = segment[innerKey];
          if (typeof inner === 'object' && inner !== null && !Array.isArray(inner)) {
            if (inner[searchKey]) {
              console.log(`Found nested "${searchKey}" in ${segKey}.${innerKey}`);
              found = true;
              break;
            }
          }
        }
      }
      if (found) break;
    }
  }
}

// Look for any strings longer than 100 chars (likely scripture)
console.log(`\n=== SEARCHING FOR LONG TEXT STRINGS ===`);
function findLongStrings(obj, path = '', depth = 0) {
  if (depth > 5) return;
  if (typeof obj === 'string' && obj.length > 100) {
    console.log(`Long string at ${path}: "${obj.substring(0, 200)}..."`);
    return true;
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < Math.min(obj.length, 5); i++) {
      if (findLongStrings(obj[i], `${path}[${i}]`, depth + 1)) return true;
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key of Object.keys(obj).slice(0, 20)) {
      if (findLongStrings(obj[key], `${path}.${key}`, depth + 1)) return true;
    }
  }
  return false;
}

// Check first few segments
for (const segKey of keys.slice(0, 5)) {
  findLongStrings(data[segKey], segKey);
}

console.log(`\n=== DONE ===`);

