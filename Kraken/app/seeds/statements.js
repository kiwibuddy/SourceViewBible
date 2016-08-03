/* @flow */
'use strict';

const {getChapterID, firstInitial, seedObjectSphereWordCounts, seedObjectWordCloud, SPHERE_MAP} = require('../common');

const STATEMENTS = require('../../data/statements');

export async function seedStatementObjects(emdros: Object, realm: Object) {
  console.log('Seeding Statement Objectss...');

  realm.write(() => {
    STATEMENTS.forEach(statement => {
      statement.recipient = realm.objectForPrimaryKey('Actant', statement.recipientID);
      delete statement.recipientID;

      statement.source = realm.objectForPrimaryKey('Actant', statement.sourceID);
      delete statement.sourceID;

      realm.create('Statement', statement)
    });
  });
}

export async function seedStatements(emdros: Object, realm: Object) {
  console.log('Seeding Statements...');

}
