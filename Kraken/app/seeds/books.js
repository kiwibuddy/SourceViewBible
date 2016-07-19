/* @flow */
'use strict';

const UUID = require('react-native-uuid');

const BOOKS = require('../books');

export async function seedBooks(emdros: Object, realm: Object) {
  console.log('Seeding Books...');

  await seedNames(realm);

  await seedChapterCounts(emdros, realm);
  await seedChapters(emdros, realm);

  await seedSources(emdros, realm);
}

async function seedNames(realm) {
  console.log('Seeding Book Names...');
  return new Promise((resolve, reject) => {
    realm.write(() => {
      BOOKS.forEach((bookInfo, index) => {
        const book = {
          id: bookInfo.id,
          DJHRef: bookInfo.DJHRef,
          name: bookInfo.name,
          testament: bookInfo.testament,
          textOrder: index + 1,
          overview: bookInfo.overview,
        };
        realm.create('Book', book);
      });
    });

    resolve();
  });
};

async function seedChapterCounts(emdros, realm) {
  console.log('Seeding Book Chapter Counts...');

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
      realm.write(() => {
        realm.objects('Book').forEach(book => {
          const bookData = data["Book"]["DJHRef"][book.DJHRef];
          if (bookData != null) {
            const chapterCount = bookData["Chapter"] || 0;
            realm.create('Book', {id: book.id, chapterCount}, true);
          }
        });

        resolve();
      });
    }).catch((error) => {
      console.log(error);
    });
  });
}

async function seedChapters(emdros, realm) {
  console.log(`Seeding Book Chapters...`);

  const books = [];
  const bookChapters = {};
  for (let [index, book] of realm.objects('Book').entries()) {
    const chapterCount = book.chapterCount;
    const chapters = [];
    for (let i = 0; i < chapterCount; i++) {
      const chapterNumber = i + 1;
      const monadSet = await seedBookChapterMonadSet(emdros, book, chapterNumber);
      const chapter = {
        id: `${book.DJHRef}-${chapterNumber}`,
        chapterNumber: chapterNumber,
        principalSourceType: 'narrator',
        firstMonad: monadSet.first,
        lastMonad: monadSet.last
      };
      chapters.push(chapter);
    }
    bookChapters[book.id] = chapters;
    books.push(book);
  }

  realm.write(() => {
    books.forEach(book => {
      console.log(`Seeding ${book.name} Chapters...`);
      const chapters = bookChapters[book.id];
      realm.create('Book', {id: book.id, chapters}, true);
    });
  });
}

async function seedBookChapterMonadSet(emdros, book, chapterNumber) {
  console.log(`Seeding ${book.DJHRef} ${chapterNumber} MonadSet...`);
  const query = `
    SELECT ALL OBJECTS
    WHERE
    [Chapter DJHBook='${book.DJHRef}' AND chapter = ${chapterNumber}]
  `;

  return await emdros.monadSet({query});
}

async function seedSources(emdros, realm) {
  console.log('Seeding Book Sources...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Source",
      "feature": "source_name"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      realm.write(() => {
        realm.objects('Book').forEach(book => {
          const bookData = data["Book"]["DJHRef"][book.DJHRef];
          if (bookData != null) {
            const sources = [];
            const sourceData = bookData["Source"]["source_name"];
            if (sourceData != null) {
              Object.keys(sourceData).forEach((sourceName) => {
                sources.push({id: sourceID(sourceName), name: sourceName, firstInitial: firstInitial(sourceName)});
              });
            }

            realm.create('Book', {id: book.id, sourceCount: sources.length, sources}, true);
          }
        });
      });

      resolve();
    }).catch((error) => {
      console.log(error);
    });
  });
}

function firstInitial(name: string) {
  const firstInitial = name.charAt(0);
  return isNumber(firstInitial) ? null : firstInitial;
}

function sourceID(name: string) {
  return name;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
