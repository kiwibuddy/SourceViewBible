/* @flow */
'use strict';

import Schema from './Schema';
import Realm from 'realm';
import Emdros from 'react-native-emdros';
import RNFS from 'react-native-fs';

const now = require('performance-now');
const DATABASE_PATH = '/tmp/SourceView.realm';
const JSON_PATH='/tmp/SourceView.json';

const realm = new Realm({
  path: DATABASE_PATH,
  schema: Schema
});

const uuid = require('react-native-uuid');

const BIBLE = {
  books: require('./books'),
  sources: [],
  spheres: [
    { id: "family", name: "Family", bookCount: 0, bookCounts: {}, wordCount: 0, words: [] },
    { id: "economics", name: "Economics", bookCount: 0, bookCounts: {}, wordCount: 0, words: [] },
    { id: "government", name: "Government", bookCount: 0, bookCounts: {}, wordCount: 0, words: [] },
    { id: "religion", name: "Religion", bookCount: 0, bookCounts: {}, wordCount: 0, words: [] },
    { id: "education", name: "Education", bookCount: 0, bookCounts: {}, wordCount: 0, words: [] },
    { id: "communication", name: "Communication", bookCount: 0, bookCounts: {}, wordCount: 0, words: [] },
    { id: "celebration", name: "Celebration", bookCount: 0, bookCounts: {}, wordCount: 0, words: [] },
  ],
  wordCount: 0,
};

const STOP_WORDS = ["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","s","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"];
const WORD_CLOUD_LIMIT = 20;
const MINIMUM_WORD_LENGTH = 2;

const SOURCE_TYPE_MAP = {
  "Black": "narrator",
  "Red": "god",
  "Green": "lead",
  "Blue": "support"
};

const SPHERE_MAP = {
  "family": "family",
  "economics": "economics",
  "government": "government",
  "religion": "religion",
  "education": "education",
  "mediacom": "communication",
  "celebration": "celebration"
};

const SPHERE_KEYS = BIBLE.spheres.map(sphere => Object.keys(SPHERE_MAP).find(key => SPHERE_MAP[key] === sphere.id));

const { seedBookObjects, seedBooks } = require('./seeds/books');
const { seedChapterObjects, seedChapters } = require('./seeds/chapters');
const { seedSourceObjects, seedSources } = require('./seeds/sources');
const { seedSphereObjects, seedSpheres } = require('./seeds/spheres');

export async function release() {
  console.log('Release the Kraken!');

  const emdros = await Emdros.open({name: 'Datasets/en/NLT/SourceView.bpt'});

  const startTime = now();

  await seed(emdros);

  const endTime = now();
  const elapsedTime = (endTime - startTime) / 1000;

  console.log(`Kraken has been released in ${elapsedTime.toFixed(3)}s!`);
  // RNFS.writeFile(JSON_PATH, JSON.stringify(objects), 'utf8').then((success) => {
  //   console.log('Done Seeding.');
  //   console.log(objects);
  // }).catch((err) => {
  //   console.log(err.message);
  // });
}

async function seed(emdros) {
  await seedBaseObjects(emdros);

  await seedBooks(emdros, realm);

  await seedChapters(emdros, realm);

  await seedSources(emdros, realm);

  await seedSpheres(emdros, realm);
}

async function seedBaseObjects(emdros) {
  console.log('Seeding Base Objects');
  await seedBookObjects(emdros, realm);
  await seedChapterObjects(emdros, realm);
  await seedSourceObjects(emdros, realm);
  await seedSphereObjects(emdros, realm);
}
