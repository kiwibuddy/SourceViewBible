/* @flow */
'use strict';

import Schema from './Schema';
import Realm from 'realm';
import Emdros from 'react-native-emdros';

const DATABASE_PATH = '/tmp/SourceView.realm';
const BIBLE = require('./books');

export function kraken() {
  console.log('Hello!');

  const realm = new Realm({
    path: DATABASE_PATH,
    schema: Schema
  });

  Emdros.open({name: 'Datasets/en/NLT/SourceView.bpt'}).then((emdros) => {
    seed(emdros, realm);
  }).catch((error) => {
    console.log(error);
  });
}

function seed(emdros, realm) {
  console.log('seeding...');
  seedBooks(emdros, realm);
}

function seedBooks(emdros, realm) {
  console.log('seeding books...');

  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter",
      "feature": "chapter",
      "buckets": {
        "objectTypeName": "Source",
        "feature": ["source_color", "source_name"],
        "buckets": {
          "objectTypeName": "Token",
          "expression" : "is_word=true"
        }
      }
    }
  }
  `;

  // DJHRef: 'string',
  // chapters: {type: 'list', objectType: 'Chapter'},
  // sources: {type: 'list', objectType: 'Source'},
  // spheres: {type: 'list', objectType: 'Sphere'},
  // wordCount: 'int',
  // words: {type: 'list', objectType: 'WordCount'},

  emdros.query(query, {count: true}).then((data) => {
    realm.write(() => {
      for (let [index, book] of BIBLE.entries()) {
        const bookData = data["Book"]["DJHRef"][book.djhref];
        let chapters = null;
        let sources = null;

        if (bookData != null) {
          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            chapters = Object.keys(chapterData).map((chapterIndex) => {
              let chapterSources = null;
              const sourceData = chapterData[chapterIndex]["Source"];
              if (sourceData != null) {
                  const sourceNameData = sourceData["source_name"];
                  if (sourceNameData != null) {
                    
                  }
              }

              const chapter = {
                chapter: parseInt(chapterIndex),
                DJHRef: '',
                sources: chapterSources,
              };
              return chapter;
            });
          }
        }

        realm.create('Book', {name: book.name, DJHRef: book.djhref, chapters: chapters, sources: sources});
      }

      console.log('Seeded books.')
    });
  }).catch((error) => {
    console.log(error);
  })
}
