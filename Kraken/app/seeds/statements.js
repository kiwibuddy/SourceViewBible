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

  const wordCountByStatement = {};
  for (let statement of STATEMENTS) {
    const statements = await emdros.statements({from: statement.firstMonad, to: statement.lastMonad, });

    const wordCounts = await emdros.wordCounts({from: statement.firstMonad, to: statement.lastMonad});
    wordCountByStatement[statement.id] = wordCounts.reduce((sum, word) => sum += word.count, 0);
  }

  realm.write(() => {
    Object.keys(wordCountByStatement).forEach(statementID => {
      const wordCount = wordCountByStatement[statementID];
      realm.create('Statement', {id: parseInt(statementID), wordCount}, true);
    });
  })
}

async function seedSphereCounts(emdros, realm) {
  console.log('Seeding Statement Sphere Word Counts...');

}
