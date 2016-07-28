/* @flow */
'use strict';

import Emdros from 'react-native-emdros';
let DB = null;

const HTML = `
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <style type="text/css">
      body {
        font-family: georgia;
        font-size: 15pt;
        color: #323B43;
        line-height: 26pt;
      }
      table {
        margin:0;
        padding:0;
        border-spacing: 0;
        border-collapse: collapse;
        // margin-left: -135pt;
      }
      .showSource {
        margin-right: -135pt;
        margin-left: 0;
      }
      tr {
        margin:0;
        padding:0;
      }
      td {
        margin:0;
        padding:0;
        vertical-align: top;
        margin-top: -10pt;
      }
      .sourceBlack {
        color: #323B43;
      }
      .sourceRed {
        color: #E8302C;
      }
      .sourceBlue {
        color: #1D99DF;
      }
      .sourceGreen {
        color: #16C658;
      }
      .sourceTitle {
        font-family: -apple-system, "Helvetica Neue", "Lucida Grande";
        font-size: 10pt;
        color: #9B9B9B;
        text-align: right;
        white-space: nowrap;
        padding-top: 2pt;
        padding-right: 15pt;
        text-transform: uppercase;
      }
      .textTitle {
        font-family: georgia;
        font-weight: bold;
        font-style: italic;
        font-size: 15pt;
        color: #323B43;
        text-align: Center;
      }
      .textChapter {
        font-family: charter;
        color: #CF1E00;
        font-size: 16pt;
        position: relative;
        top: -0.05em;
      }
      .textVerse {
        font-size: 11pt;
        position: relative;
        top: -0.4em;
      }
      .textIndent {
        padding-left: 2em;
      }
    </style>
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
