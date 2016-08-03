/* @flow */
'use strict';

const ACTANT_METADATA = require('../../data/actant-meta-data');

export async function seedActantMetaDataObjects(realm: Object) {
  console.log('Seeding Actant MetaData Objects...');

  realm.write(() => {
    ACTANT_METADATA["professions"].forEach(profession => realm.create('Profession', profession));
  });
}
