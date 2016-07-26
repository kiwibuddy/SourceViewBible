/* @flow */
'use strict';

import Emdros from 'react-native-emdros';
let DB = null;

const SCRIPTURE_STYLESHEET = require('./scripture-stylesheet.json');
// const SCRIPTURE_STYLESHEET = require('./html-stylesheet.json');

function openDatabase() {
  return new Promise((resolve, reject) => {
    Emdros.open({name: 'SVB2/SourceView.bpt'}).then((emdros) => {
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
      const from = result.indexOf('React.create');
      const scripture = 'React.createElement(View, {}, ' + result.slice(from, -1) + ')';

      // const scripture = result;
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
