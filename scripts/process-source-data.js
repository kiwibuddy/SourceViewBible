/**
 * Process BSO data to generate source word counts
 * Run with: node scripts/process-source-data.js
 */

const fs = require('fs');
const path = require('path');

// Load data
const bsoPath = path.join(__dirname, '../assets/data/bso.json');
const actantsPath = path.join(__dirname, '../assets/data/actants.json');
const outputPath = path.join(__dirname, '../assets/data/source-word-counts.json');

console.log('Loading BSO data...');
const bsoData = JSON.parse(fs.readFileSync(bsoPath, 'utf8'));

console.log('Loading actants data...');
const actantsData = JSON.parse(fs.readFileSync(actantsPath, 'utf8'));

// Create a map of actant id -> name
const actantNames = {};
actantsData.forEach(a => {
  actantNames[a.id] = a.name;
});

// Role ID to source type mapping (from legacy code)
// 1 = narrator (gray), 2 = god (red), 3 = lead (green), 4 = support (blue)
const roleToSourceType = {
  1: 'narrator',
  2: 'god',
  3: 'lead',
  4: 'support',
};

// Process BSO data to calculate word counts per source
console.log('Processing speech data...');
const sourceStats = {};

bsoData.forEach(speech => {
  const sourceId = speech.source_id;
  const wordCount = speech.word_count || 0;
  const roleId = speech.role_id;
  const bookId = speech.book_id;
  
  if (!sourceStats[sourceId]) {
    sourceStats[sourceId] = {
      id: sourceId,
      name: actantNames[sourceId] || `Source ${sourceId}`,
      totalWordCount: 0,
      speechCount: 0,
      sourceTypeCounts: { narrator: 0, god: 0, lead: 0, support: 0 },
      bookAppearances: new Set(),
    };
  }
  
  sourceStats[sourceId].totalWordCount += wordCount;
  sourceStats[sourceId].speechCount += 1;
  
  const sourceType = roleToSourceType[roleId] || 'support';
  sourceStats[sourceId].sourceTypeCounts[sourceType] += wordCount;
  
  sourceStats[sourceId].bookAppearances.add(bookId);
});

// Convert to array and determine principal source type
const sourceWordCounts = Object.values(sourceStats).map(s => {
  // Find principal source type (most words)
  let principalSourceType = 'support';
  let maxWords = 0;
  Object.entries(s.sourceTypeCounts).forEach(([type, count]) => {
    if (count > maxWords) {
      maxWords = count;
      principalSourceType = type;
    }
  });
  
  return {
    id: s.id,
    name: s.name,
    wordCount: s.totalWordCount,
    speechCount: s.speechCount,
    principalSourceType,
    sourceTypeCounts: s.sourceTypeCounts,
    bookCount: s.bookAppearances.size,
  };
});

// Sort by word count (descending)
sourceWordCounts.sort((a, b) => b.wordCount - a.wordCount);

console.log(`Processed ${sourceWordCounts.length} sources`);
console.log('Top 20 sources by word count:');
sourceWordCounts.slice(0, 20).forEach((s, i) => {
  console.log(`  ${i+1}. ${s.name}: ${s.wordCount.toLocaleString()} words (${s.principalSourceType})`);
});

// Write output
fs.writeFileSync(outputPath, JSON.stringify(sourceWordCounts, null, 2));
console.log(`\nOutput written to: ${outputPath}`);

