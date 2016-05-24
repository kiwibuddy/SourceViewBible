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

  // name: 'string',
  // DJHRef: 'string',
  // testament: 'int',
  // chapterCount: {type: 'int', default: 0},
  // chapters: {type: 'list', objectType: 'Chapter'},
  // sourceCount: {type: 'int', default: 0},
  // sources: {type: 'list', objectType: 'Source'},
  // sourceTypesCounts: {type: 'list', objectType: 'Count'},
  // sphereCount: {type: 'int', default: 0},
  // sphereCounts: {type: 'list', objectType: 'Count'},
  // principalSphere: 'string',
  // wordCount: {type: 'int', default: 0},
  // wordCounts: {type: 'list', objectType: 'Count'},

  emdros.query(query, {count: true}).then((data) => {
    realm.write(() => {
      for (let [index, book] of BIBLE.entries()) {
        const bookData = data["Book"]["DJHRef"][book.djhref];
        if (bookData != null) {
          let chapters = null;
          let sources = null;
          let bookWordCount = 0;

          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            let chapterWordCount = 0;

            chapters = Object.keys(chapterData).map((chapterIndex) => {
              let chapterSources = null;
              const sourceData = chapterData[chapterIndex]["Source"];
              if (sourceData != null) {
                  const sourceTypeData = sourceData["source_color"];
                  if (sourceTypeData != null) {
                    Object.keys(sourceTypeData).forEach(function(sourceType, index) {
                      const tokenData = sourceTypeData[sourceType]["Token"];
                      if (tokenData != null) {
                        chapterWordCount += tokenData;
                      }
                    });
                  }

                  const sourceNameData = sourceData["source_name"];
                  if (sourceNameData != null) {
                    Object.keys(sourceNameData).forEach(function(source, index) {
                      const tokenData = sourceNameData[source]["Token"];
                      if (tokenData != null) {

                      }
                    });
                  }
              }

              bookWordCount += chapterWordCount;

              const chapter = {
                chapter: parseInt(chapterIndex),
                DJHRef: '',
                wordCount: chapterWordCount
              };
              return chapter;
            });
          }

          let bookObject = {name: book.name, DJHRef: book.djhref, chapters: chapters, sources: sources, wordCount: bookWordCount}
          console.log(bookObject);
          realm.create('Book', bookObject);
        }
      }

      console.log('Seeded books.')
    });
  }).catch((error) => {
    console.log(error);
  })
}
