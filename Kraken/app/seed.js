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

  RNFS.writeFile(JSON_PATH, JSON.stringify(objects), 'utf8').then((success) => {
    console.log('Done Seeding.');
    console.log(objects);
  }).catch((err) => {
    console.log(err.message);
  });
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
  await seedChapterSourceWordCounts(emdros, objects);
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
          seedObjectSourceWordCounts(book, sourceData);
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedChapterSourceWordCounts(emdros, objects) {
  console.log('Seeding Chapter Source Word Counts');
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

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      let bookObjects = [];

      for (let [index, book] of objects.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            book.chapters.forEach((chapter, index) => {
              const sourceData = chapterData[chapter.chapterNumber.toString()]["Source"];
              seedObjectSourceWordCounts(chapter, sourceData);
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

function seedObjectSourceWordCounts(object, sourceData) {
  if (sourceData != null) {
    object.sourceTypeCounts = {};
    const sourceTypeData = sourceData["source_color"];
    if (sourceTypeData != null) {
      Object.keys(sourceTypeData).forEach(function(sourceColor, index) {
        const wordCount = sourceTypeData[sourceColor]["Token"] || 0;
        const sourceType = SOURCE_TYPE_MAP[sourceColor];
        object.sourceTypeCounts[sourceType] = wordCount;
      });
    }

    object.sourceCounts = {};
    const sourceNameData = sourceData["source_name"];
    if (sourceNameData != null) {
      const sourceCounts = {};
      Object.keys(sourceNameData).forEach(function(sourceName, index) {
        const wordCount = sourceNameData[sourceName]["Token"] || 0;
        sourceCounts[sourceName] = wordCount;
      });

      object.sourceCounts = Object.keys(sourceCounts).sort((a, b) => sourceCounts[a] > sourceCounts[b] ? -1 : 1).map((source) => {
        return {name: source, wordCount: sourceCounts[source]};
      });

      object.sourceCount = object.sourceCounts.length;
    }
  }
}
