/* @flow */
'use strict';

import Emdros from 'react-native-emdros';
let DB = null;

const HTML = `
<!DOCTYPE html>
<html>
  <head>
    <title></title>
  </head>
  <body>
    {{BODY}}
  </body>
</html>
`;

const SCRIPTURE_STYLESHEET = require('./scripture-stylesheet.json');

function openDatabase() {
  return new Promise((resolve, reject) => {
    Emdros.open({name: 'Datasets/en/NLT/SourceView.bpt'}).then((emdros) => {
      DB = emdros;
      resolve();
    }).catch((error) => {
      console.log(error);
      reject(error);
    });
  });
}

function query(query: string, options: Object) {
  if (DB == null) {
    const promise = new Promise((resolve, reject) => {
      reject('DB is null');
    });
    return promise;
  }

  return DB.query(query, options);
}

function scripture(options: Object) {
  const style = {stylesheet: JSON.stringify(SCRIPTURE_STYLESHEET)};

  let monadSet = options.monadSet;
  if (!monadSet) {
    const book = options.book;
    if (book) {
      const chapterNumber = options.chapterNumber || 1;
      const chapter = book.chapters[chapterNumber - 1];
      monadSet = chapter.monadSet;
    }
  }

  return new Promise((resolve, reject) => {
    if (DB == null) {
      reject('DB is null');
      return;
    }

    DB.string(monadSet.first, monadSet.last, style).then((result) => {
      const scripture = HTML.replace('{{BODY}}', result);
      resolve(scripture);
    }).catch((error) => {
      reject(error);
    });
  })
}

module.exports = {
  openDatabase,
  query,
  scripture
}
