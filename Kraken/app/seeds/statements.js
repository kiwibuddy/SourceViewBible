/* @flow */
'use strict';

const {getChapterID, firstInitial, seedObjectSphereWordCounts, seedObjectWordCloud, SPHERE_MAP, SPHERES} = require('../common');

const STATEMENTS = require('../../db/seeds/statements');
import RNFS from 'react-native-fs';

export async function seedStatementObjects(emdros: Object, realm: Object) {
  console.log('Seeding Statement Objects...');

  realm.write(() => {
    STATEMENTS.forEach(statement => {
      if (statement.sourceID) {
        statement.source = realm.objectForPrimaryKey('Actant', statement.sourceID);
      }
      delete statement.sourceID;

      statement.recipients = statement.recipients.map(recipientID => realm.objectForPrimaryKey('Actant', recipientID));

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
  const sphereStatements = [];
  for (let statement of STATEMENTS) {
    const wordCountsForContext = await emdros.wordCountsForContext('Statement', {from: statement.firstMonad, to: statement.lastMonad});
    const counts = wordCountsForContext[statement.id.toString()];
    const wordCount = counts.wordCount;
    delete counts.wordCount;

    const sphereCounts = Object.keys(counts).map(key => ({string: key, count: counts[key]}));
    const spheres = Object.keys(counts).filter(key => counts[key] > 0).map(key => key);

    statements.push({
      id: statement.id,
      wordCount,
      sphereCounts,
    });

    spheres.forEach(key => {
      const sphereID = SPHERES.indexOf(key) + 1;
      if (sphereID > 0) {
        sphereStatements.push({
          id: sphereID,
          statement_id: statement.id
        });
      }
    });
  }

  realm.write(() => {
    statements.forEach(statement => realm.create('Statement', statement, true));
  });

  RNFS.writeFile('/tmp/sphere-statements.json', JSON.stringify(sphereStatements), 'utf8').then((success) => {
    console.log('Seeded /tmp/sphere-statements.json');
  }).catch((err) => {
    console.log(err.message);
  });

  RNFS.writeFile('/tmp/statement-word-counts.json', JSON.stringify(statements), 'utf8').then((success) => {
    console.log('Seeded /tmp/statement-word-counts.json');
  }).catch((err) => {
    console.log(err.message);
  });
}
