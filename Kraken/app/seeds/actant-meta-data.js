/* @flow */
'use strict';

const PROFESSIONS = require('../../db/seeds/professions');
const CHRONOLOGIES = require('../../db/seeds/chronologies');
const NATURES = require('../../db/seeds/natures');

export async function seedActantMetaDataObjects(realm: Object) {
  console.log('Seeding Actant MetaData Objects...');

  realm.write(() => {
    PROFESSIONS.forEach(profession => realm.create('Profession', profession));
    CHRONOLOGIES.forEach(chronology => realm.create('Chronology', chronology));
    NATURES.forEach(nature => realm.create('Nature', nature));
  });
}
