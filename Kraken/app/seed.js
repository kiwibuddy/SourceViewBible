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

export async function kraken() {
  console.log('Hello!');

  // const realm = new Realm({
  //   path: DATABASE_PATH,
  //   schema: Schema
  // });
  const realm = null;

  const emdros = await Emdros.open({name: 'Datasets/en/NLT/SourceView.bpt'});
  let objects = BIBLE;
  await seed(emdros, BIBLE);
  console.log('Done Seeding.');

  console.log(objects);

    // RNFS.writeFile(JSON_PATH, JSON.stringify(objects), 'utf8').then((success) => {
    //   console.log('Done Seeding.');
    // }).catch((err) => {
    //   console.log(err.message);
    // });
}

async function seed(emdros, objects) {
  console.log('Seeding...');

  await seedChapters(emdros, objects);
  await seedWordCounts(emdros, objects)
}

async function seedChapters(emdros, objects) {
  console.log('Seeding Chapters...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of objects.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const chapterCount = bookData["Chapter"] || 0;
          const chapters = []
          for (let i = 0; i < chapterCount; i++) {
            const chapterNumber = i + 1;
            chapters.push({chapterNumber: chapterNumber});
          }
          book["chapterCount"] = chapters.length;
          book["chapters"] = chapters;
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    });
  });
}

async function seedWordCounts(emdros, objects) {
  await seedBookWordCounts(emdros, objects);
  await seedChapterWordCounts(emdros, objects);
  await seedBookSourceWordCounts(emdros, objects);
}

async function seedBookWordCounts(emdros, objects) {
  console.log('Seeding Book Word Counts...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Token",
      "expression" : "is_word=true"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of objects.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const wordCount = bookData["Token"] || 0;
          book["wordCount"] = wordCount;
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedChapterWordCounts(emdros, objects) {
  console.log('Seeding Chapter Word Counts...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter",
      "feature": "chapter",
      "buckets": {
        "objectTypeName": "Token",
        "expression" : "is_word=true"
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of objects.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            book.chapters.forEach((chapter, index) => {
              const wordCount = chapterData[chapter.chapterNumber.toString()]["Token"] || 0;
              chapter["wordCount"] = wordCount;
            });
          }
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedBookSourceWordCounts(emdros, objects) {
  console.log('Seeding Book Source Word Counts');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Source",
      "feature": ["source_color", "source_name"],
      "buckets": {
        "objectTypeName": "Token",
        "expression" : "is_word=true"
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      let bookObjects = [];

      for (let [index, book] of objects.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const sourceData = bookData["Source"];
          if (sourceData != null) {
            book.sourceTypeCounts = {};
            const sourceTypeData = sourceData["source_color"];
            if (sourceTypeData != null) {
              Object.keys(sourceTypeData).forEach(function(sourceColor, index) {
                const wordCount = sourceTypeData[sourceColor]["Token"] || 0;
                const sourceType = SOURCE_TYPE_MAP[sourceColor];
                book.sourceTypeCounts[sourceType] = wordCount;
              });
            }

            book.sourceCounts = {};
            const sourceNameData = sourceData["source_name"];
            if (sourceNameData != null) {
              Object.keys(sourceNameData).forEach(function(sourceName, index) {
                const wordCount = sourceNameData[sourceName]["Token"] || 0;
                book.sourceCounts[sourceName] = wordCount;
              });
            }
          }
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedSourceWordCounts(emdros, objects) {
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

    for (let [index, book] of objects.entries()) {
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

  }).catch((error) => {
    console.log(error);
  })
}
