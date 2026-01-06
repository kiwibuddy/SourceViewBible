/**
 * Analyze available data sources to understand what word-level features we have
 * Run: node scripts/analyze-available-data.js
 */
const fs = require('fs');
const path = require('path');

// Load all data sources
console.log('Loading data sources...');

const bso = JSON.parse(fs.readFileSync(path.join(__dirname, '../legacy/Kraken/db/seeds/bso.json'), 'utf8'));
const bsoWordCounts = JSON.parse(fs.readFileSync(path.join(__dirname, '../legacy/Kraken/db/seeds/bso_word_counts.json'), 'utf8'));
const actants = JSON.parse(fs.readFileSync(path.join(__dirname, '../legacy/Kraken/db/seeds/actants.json'), 'utf8'));
const newBible = JSON.parse(fs.readFileSync(path.join(__dirname, '../legacy/OtherSVB_Projects/newBibleNLT1.json'), 'utf8'));
const verseIndex = JSON.parse(fs.readFileSync(path.join(__dirname, '../legacy/OtherSVB_Projects/verseIndex.json'), 'utf8'));

console.log('\n=== DATA SOURCE SUMMARY ===\n');

// BSO Analysis
console.log('1. BSO (BookSourceOccurrence) - bso.json');
console.log(`   Total entries: ${bso.length}`);
console.log('   Sample entry:', JSON.stringify(bso[0], null, 2));
console.log('   Fields: id, first (monad), last (monad), book_id, source_id, occurrence_id, role_id, word_count, name, reference');

// BSO Word Counts Analysis  
console.log('\n2. BSO Word Counts - bso_word_counts.json');
console.log(`   Total entries: ${bsoWordCounts.length}`);
console.log('   Sample entry:', JSON.stringify(bsoWordCounts[0], null, 2));
console.log('   Fields: id (matches BSO), wordCount, sphereCounts (array with family, economics, government, religion, education, communication, celebration)');

// Actants Analysis
console.log('\n3. Actants (Characters) - actants.json');
console.log(`   Total entries: ${actants.length}`);
console.log('   Sample entry:', JSON.stringify(actants[0], null, 2));
console.log('   Fields: id, name, gender_id, natures, professions, chronologies, isSource, isRecipient');

// newBibleNLT1 Analysis
const bibleKeys = Object.keys(newBible);
console.log('\n4. newBibleNLT1.json (Scripture with Source Attribution)');
console.log(`   Total segments: ${bibleKeys.length}`);
console.log('   Segment types: I### (Introductions), S### (Stories)');
const s001 = newBible['S001'];
if (s001) {
  console.log('   S001 structure:', Object.keys(s001).join(', '));
  console.log('   S001 content blocks:', s001.content?.length || 0);
  if (s001.content?.[0]) {
    console.log('   Sample content block:', JSON.stringify(s001.content[0], null, 2).substring(0, 500));
  }
}

// Verse Index Analysis
const verseKeys = Object.keys(verseIndex);
console.log('\n5. verseIndex.json (Verse to Segment Mapping)');
console.log(`   Total entries: ${verseKeys.length}`);
console.log('   Sample entry:', JSON.stringify(verseIndex[verseKeys[0]], null, 2));
console.log('   Fields: segmentId, blockIndex, position, book, chapter, verse, content, segmentTitle');

// Cross-reference analysis
console.log('\n=== CROSS-REFERENCE ANALYSIS ===\n');

// Can we match BSO to newBible content?
const firstBso = bso[0]; // Genesis 1:3, God speaking
console.log('Attempting to match BSO entry to Scripture block:');
console.log(`BSO: ${firstBso.name} speaking in ${firstBso.reference} (monads ${firstBso.first}-${firstBso.last})`);

// Find corresponding verse in verseIndex
const gen13 = verseIndex['Genesis-1-3'];
if (gen13) {
  console.log(`Verse Index for Gen 1:3: segment=${gen13.segmentId}, blockIndex=${gen13.blockIndex}`);
  
  // Get the content block from newBible
  const segment = newBible[gen13.segmentId];
  if (segment && segment.content) {
    console.log(`Content blocks in ${gen13.segmentId}: ${segment.content.length}`);
    // Find God's speaking block
    for (let i = 0; i < segment.content.length; i++) {
      const block = segment.content[i];
      if (block.source?.sourceName === 'God') {
        console.log(`Found God speaking at index ${i}:`, JSON.stringify(block, null, 2).substring(0, 600));
        break;
      }
    }
  }
}

console.log('\n=== CONCLUSION ===\n');
console.log('Available data allows us to:');
console.log('✅ Display scripture text with source attribution (newBibleNLT1.json)');
console.log('✅ Know which character is speaking and their role/color');
console.log('✅ Get sphere word counts per speech block (bso_word_counts.json)');
console.log('✅ Link sources to detailed character info (actants.json: gender, nature, professions)');
console.log('✅ Navigate by verse (verseIndex.json)');
console.log('');
console.log('What we CANNOT do without Emdros:');
console.log('❌ Per-word sphere attribution (we have per-block, not per-word)');
console.log('❌ Search for specific words and get their monad positions');
console.log('❌ Highlight individual words within a block by sphere');
console.log('');
console.log('Workaround options:');
console.log('1. Use block-level sphere attribution (most common use case)');
console.log('2. Build word index from text for search (approximate positions)');
console.log('3. Accept that per-word sphere coloring becomes per-block coloring');

