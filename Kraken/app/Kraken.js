/* @flow */
'use strict';

import SourceViewSchema from './SourceViewSchema';
import Realm from 'realm';
import Emdros from 'react-native-emdros';
import RNFS from 'react-native-fs';

const now = require('performance-now');
const DATABASE_PATH = '/tmp/SourceView.realm';
const JSON_PATH = '/tmp/SourceView.json';

const realm = new Realm({
  path: DATABASE_PATH,
  schema: SourceViewSchema,
  encryptionKey: Emdros.key
});

const { seedActantMetaDataObjects } = require('./seeds/actant_meta_data');
const { seedBookObjects, seedBooks } = require('./seeds/books');
const { seedChapterObjects, seedChapters } = require('./seeds/chapters');
const { seedActantObjects, seedActants } = require('./seeds/actants');
const { seedSphereObjects, seedSpheres } = require('./seeds/spheres');
const { seedBSO } = require('./seeds/bso');

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
  await seedActants(emdros, realm);
  await seedSpheres(emdros, realm);
  await seedBible(emdros, realm);
}

async function seedBaseObjects(emdros) {
  console.log('Seeding Base Objects');

  await seedActantMetaDataObjects(realm);
  await seedBookObjects(emdros, realm);
  await seedChapterObjects(emdros, realm);
  await seedActantObjects(emdros, realm);
  await seedBSO(emdros, realm);
  await seedSphereObjects(emdros, realm);
}

async function seedBible(emdros: Object, realm) {
  console.log('Seeding Bible');

  realm.write(() => {
    const wordCount = realm.objects('Book').reduce((sum, book) => sum += book.wordCount, 0);
    realm.create('Bible', {wordCount});
  })
}
