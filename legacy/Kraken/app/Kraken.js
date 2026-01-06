/* @flow */
'use strict';

import SourceViewSchema from './SourceViewSchema';
import Realm from 'realm';
import Emdros from 'react-native-emdros';
import RNFS from 'react-native-fs';

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
const { seedBSOObjects, seedBSO } = require('./seeds/bso');
const { seedObjectWordCloud } = require('./common');

export async function release() {
  console.log('Release the Kraken!');

  const emdros = await Emdros.open({name: 'Datasets/en/NLT/SourceView.bpt'});

  await seed(emdros);

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
  await seedBSO(emdros, realm);
  await seedSpheres(emdros, realm);
  await seedBible(emdros, realm);
}

async function seedBaseObjects(emdros) {
  console.log('Seeding Base Objects');

  await seedActantMetaDataObjects(realm);
  await seedBookObjects(emdros, realm);
  await seedChapterObjects(emdros, realm);
  await seedActantObjects(emdros, realm);
  await seedBSOObjects(emdros, realm);
  await seedSphereObjects(emdros, realm);
}

async function seedBible(emdros: Object, realm) {
  console.log('Seeding Bible');

  const from = realm.objectForPrimaryKey('Book', 'genesis');
  const to = realm.objectForPrimaryKey('Book', 'revelation');
  const words = await emdros.words({from: from.firstMonad, to: to.lastMonad});

  realm.write(() => {
    seedObjectWordCloud(realm, 'Bible', 0, words);
  });
}
