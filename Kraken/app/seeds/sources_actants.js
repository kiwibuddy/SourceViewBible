/* @flow */
'use strict';

const {getChapterID, firstInitial, seedObjectSphereWordCounts, seedObjectWordCloud, SPHERE_MAP, SPHERES} = require('../common');

const SOURCES_ACTANTS = require('../../db/seeds/sources_actants');
import RNFS from 'react-native-fs';

export async function seedSourcesActants(emdros: Object, realm: Object) {
  console.log('Seeding Source Actants...');

  await seedSourceActantWordCounts(emdros, realm);
}

async function seedSourceActantWordCounts(emdros: Object, realm: Object) {
  console.log('Seeding SourceActant Word Counts...');

  const sourceActants = [];
  for (let sourceActant of SOURCES_ACTANTS) {
    const context = sourceActant.is_source ? 'SourceActant' : 'RecipientActant';
    const wordCountsForContext = await emdros.wordCountsForContext(context, {from: sourceActant.first, to: sourceActant.last});
    const counts = wordCountsForContext[sourceActant.id.toString()];

    const wordCount = counts.wordCount;
    delete counts.wordCount;
    const sphereCounts = Object.keys(counts).map(key => ({string: key, count: counts[key]}));

    sourceActants.push({
      id: sourceActant.id,
      wordCount,
      sphereCounts,
    });
  }

  RNFS.writeFile('/tmp/sources_actants_word_counts.json', JSON.stringify(sourceActants), 'utf8').then((success) => {
    console.log('Seeded /tmp/sources_actants_word_counts.json');
  }).catch((err) => {
    console.log(err.message);
  });
}
