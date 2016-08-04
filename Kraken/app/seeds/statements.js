/* @flow */
'use strict';

const {getChapterID, firstInitial, seedObjectSphereWordCounts, seedObjectWordCloud, SPHERE_MAP} = require('../common');

const STATEMENTS = require('../../data/statements');

export async function seedStatementObjects(emdros: Object, realm: Object) {
  console.log('Seeding Statement Objects...');

  realm.write(() => {
    STATEMENTS.forEach(statement => {
      if (statement.recipientID) {
        statement.recipient = realm.objectForPrimaryKey('Actant', statement.recipientID);
      }
      delete statement.recipientID;

      if (statement.sourceID) {
        statement.source = realm.objectForPrimaryKey('Actant', statement.sourceID);
      }
      delete statement.sourceID;

      statement.book = realm.objects('Book').filtered('firstMonad <= $0 AND lastMonad >= $0', statement.firstMonad)[0];
      realm.create('Statement', statement)
    });
  });
}

export async function seedStatements(emdros: Object, realm: Object) {
  console.log('Seeding Statements...');

  await seedStatementWordCounts(emdros, realm);
}

async function seedStatementWordCounts(emdros: Object, realm: Object) {
  console.log('Seeding Statement Word Counts...');

  const statements = [];
  for (let statement of STATEMENTS) {
    const emdrosID = statement.emdrosID.toString();
    const wordCountsForContext = await emdros.wordCountsForContext('Statement', {from: statement.firstMonad, to: statement.lastMonad});
    const counts = wordCountsForContext[emdrosID];
    const wordCount = counts.wordCount;
    delete counts.wordCount;

    const sphereCounts = Object.keys(counts).map(key => ({string: key, count: counts[key]}));
    const spheres = Object.keys(counts).filter(key => counts[key] > 0).map(key => key);
    const sphereValues = spheres.length > 0 ? ` ${spheres.join(' ')} ` : null;

    statements.push({
      id: statement.id,
      wordCount,
      sphereCounts,
      sphereValues
    });
  }

  realm.write(() => {
    statements.forEach(statement => realm.create('Statement', statement, true));
  });
}

async function seedSphereCounts(emdros, realm) {
  console.log('Seeding Statement Sphere Word Counts...');

}
