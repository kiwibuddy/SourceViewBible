/* @flow */
'use strict';

import Schema from './Schema';
import Realm from 'realm';
import Emdros from 'react-native-emdros';
import RNFS from 'react-native-fs';

const DATABASE_PATH = '/tmp/SourceView.realm';
const JSON_PATH='/tmp/SourceView.json';

const BIBLE = require('./books');
const SOURCE_TYPE_MAP = {
  "Black": "narrator",
  "Red": "god",
  "Green": "lead",
  "Blue": "support"
};

export function kraken() {
  console.log('Hello!');

  // const realm = new Realm({
  //   path: DATABASE_PATH,
  //   schema: Schema
  // });
  const realm = null;

  Emdros.open({name: 'Datasets/en/NLT/SourceView.bpt'}).then((emdros) => {
    seed(emdros);
  }).catch((error) => {
    console.log(error);
  });
}

function seed(emdros) {
  console.log('seeding...');
  seedBooks(emdros);
}

function seedBooks(emdros) {
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

  emdros.query(query, {count: true}).then((data) => {
    let bookObjects = [];

    for (let [index, book] of BIBLE.entries()) {
      const bookData = data["Book"]["DJHRef"][book.DJHRef];
      if (bookData != null) {
        let bookWordCount = 0;
        let chapters = [];
        let bookSourceTypeCounts = {
            "narrator": 0,
            "god": 0,
            "lead": 0,
            "support": 0
        };
        let bookSources = {};

        const chapterData = bookData["Chapter"]["chapter"];
        if (chapterData != null) {
          chapters = Object.keys(chapterData).map((chapterIndex) => {
            let chapterWordCount = 0;
            let sourceTypeCounts = {};
            let chapterSources = {};

            const sourceData = chapterData[chapterIndex]["Source"];
            if (sourceData != null) {
                const sourceTypeData = sourceData["source_color"];
                if (sourceTypeData != null) {
                  Object.keys(sourceTypeData).forEach(function(sourceColor, index) {
                    const tokenCount = sourceTypeData[sourceColor]["Token"];
                    if (tokenCount != null) {
                      const sourceType = SOURCE_TYPE_MAP[sourceColor];
                      sourceTypeCounts[sourceType] = tokenCount;
                      bookSourceTypeCounts[sourceType] += tokenCount;
                      chapterWordCount += tokenCount;
                    }
                  });
                }

                const sourceNameData = sourceData["source_name"];
                if (sourceNameData != null) {
                  Object.keys(sourceNameData).forEach(function(source, index) {
                    const tokenCount = sourceNameData[source]["Token"];
                    if (tokenCount != null) {
                      let chapterSourceTokenCount = chapterSources[source] || 0;
                      chapterSources[source] = chapterSourceTokenCount + tokenCount;

                      let bookSourceTokenCount = bookSources[source] || 0;
                      bookSources[source] = chapterSourceTokenCount + tokenCount;
                    }
                  });
                }
            }

            bookWordCount += chapterWordCount;

            const chapter = {
              wordCount: chapterWordCount,
              sourceTypeCounts: sourceTypeCounts,
              sourceCount: Object.keys(chapterSources).length,
              sources: chapterSources
            };
            return chapter;
          });
        }

        let bookObject = {...book, wordCount: bookWordCount, chapterCount: chapters.length, chapters: chapters, sourceTypeCounts: bookSourceTypeCounts, sourceCount:Object.keys(bookSources).length, sources: bookSources};
        bookObjects.push(bookObject);
      }
    }

    console.log(bookObjects);

    RNFS.writeFile(JSON_PATH, JSON.stringify(bookObjects), 'utf8').then((success) => {
      console.log('FILE WRITTEN!');
    }).catch((err) => {
      console.log(err.message);
    });

    console.log('Seeded books.')
  }).catch((error) => {
    console.log(error);
  })
}
