/**
 * Script to inspect the structure of newBibleNLT1.json
 * Run with: node scripts/inspect-bible-json.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../legacy/OtherSVB_Projects/newBibleNLT1.json');

console.log('Reading file...');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('\n=== TOP-LEVEL KEYS ===');
const keys = Object.keys(data);
console.log(`Total segments: ${keys.length}`);
console.log(`First 20 keys: ${keys.slice(0, 20).join(', ')}`);

console.log('\n=== FIRST SEGMENT (I001) STRUCTURE ===');
const firstSegment = data['I001'];
if (firstSegment) {
  console.log('Keys in I001:', Object.keys(firstSegment));
  
  // Show sources summary
  if (firstSegment.sources) {
    const sourceNames = Object.keys(firstSegment.sources);
    console.log(`\nSources in I001: ${sourceNames.length}`);
    console.log('First 5 sources:', sourceNames.slice(0, 5));
  }
  
  // Check for text/blocks/content
  for (const key of Object.keys(firstSegment)) {
    if (key !== 'sources') {
      console.log(`\n${key}:`, typeof firstSegment[key] === 'object' 
        ? JSON.stringify(firstSegment[key]).substring(0, 200) + '...'
        : firstSegment[key]);
    }
  }
}

console.log('\n=== FIRST STORY SEGMENT (S001) STRUCTURE ===');
const storySegment = data['S001'];
if (storySegment) {
  console.log('Keys in S001:', Object.keys(storySegment));
  
  // Show all non-sources keys with sample data
  for (const key of Object.keys(storySegment)) {
    if (key !== 'sources') {
      const value = storySegment[key];
      if (Array.isArray(value)) {
        console.log(`\n${key}: Array with ${value.length} items`);
        if (value.length > 0) {
          console.log('First item:', JSON.stringify(value[0]).substring(0, 500));
        }
      } else if (typeof value === 'object') {
        console.log(`\n${key}:`, JSON.stringify(value).substring(0, 500) + '...');
      } else {
        console.log(`\n${key}:`, value);
      }
    }
  }
}

// Check a few more segments to understand the pattern
console.log('\n=== CHECKING FOR TEXT CONTENT ===');
const sampleKeys = ['S001', 'S002', 'S050', 'S100'];
for (const key of sampleKeys) {
  if (data[key]) {
    const segKeys = Object.keys(data[key]);
    const hasBlocks = segKeys.includes('blocks');
    const hasText = segKeys.includes('text');
    const hasContent = segKeys.includes('content');
    const hasVerses = segKeys.includes('verses');
    console.log(`${key}: blocks=${hasBlocks}, text=${hasText}, content=${hasContent}, verses=${hasVerses}, keys=${segKeys.join(',')}`);
  }
}

console.log('\n=== DONE ===');

