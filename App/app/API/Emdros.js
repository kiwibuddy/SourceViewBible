/* @flow */
'use strict';

import Emdros from 'react-native-emdros';
let DB = null;

const SCRIPTURE_STYLESHEET = require('./scripture-stylesheet.json');

function openDatabase() {
  Emdros.open({name: 'Datasets/en/NLT/SourceView.bpt'}).then((emdros) => {
    DB = emdros;
  }).catch((error) => {
    console.log(error);
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

function scripture(book: Object, chapterNumber: number) {
  const options = {stylesheet: JSON.stringify(SCRIPTURE_STYLESHEET)};
  const chapter = book.chapters[chapterNumber - 1];

  return new Promise((resolve, reject) => {
    if (DB == null) {
      reject('DB is null');
      return;
    }

    DB.string(chapter.monadSet.first, chapter.monadSet.last, options).then((result) => {
      const scripture = 'React.createElement(View, {}, ' + result.slice(0, -1) + ')';
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
