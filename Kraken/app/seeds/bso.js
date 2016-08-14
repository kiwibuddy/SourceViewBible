/* @flow */
'use strict';

const BOOK_SOURCE_OCCURRENCES = require('../../db/seeds/bso');
import RNFS from 'react-native-fs';

export async function seedBSO(emdros: Object, realm: Object) {
  console.log('Seeding BSO...');

  await seedBSOWordCounts(emdros, realm);
}

async function seedBSOWordCounts(emdros: Object, realm: Object) {
  console.log('Seeding BSO Word Counts...');

  const bookSourceOccurrences = [];
  for (let bso of BOOK_SOURCE_OCCURRENCES) {
    const wordCountsForContext = await emdros.wordCountsForContext('Source', {from: bso.first, to: bso.last});
    const counts = wordCountsForContext[bso.id.toString()];

    const wordCount = counts.wordCount;
    delete counts.wordCount;
    const sphereCounts = Object.keys(counts).map(key => ({string: key, count: counts[key]}));

    bookSourceOccurrences.push({
      id: bso.id,
      wordCount,
      sphereCounts,
    });
  }

  RNFS.writeFile('/tmp/bso_word_counts.json', JSON.stringify(bookSourceOccurrences), 'utf8').then((success) => {
    console.log('Seeded /tmp/bso_word_counts.json');
  }).catch((err) => {
    console.log(err.message);
  });
}
