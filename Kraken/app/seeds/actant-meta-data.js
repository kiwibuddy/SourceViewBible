/* @flow */
'use strict';

const PROFESSIONS = require('../../db/seeds/professions');

export async function seedActantMetaDataObjects(realm: Object) {
  console.log('Seeding Actant MetaData Objects...');

  realm.write(() => {
    PROFESSIONS.forEach(profession => realm.create('Profession', profession));
  });
}
