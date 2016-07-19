/* @flow */
'use strict';

const {getChapterID, firstInitial, getSourceID, seedObjectSourceTypeWordCounts, seedObjectSphereWordCounts, seedObjectWordCloud, SPHERE_MAP} = require('../common');

export async function seedChapterObjects(emdros: Object, realm: Object) {
  console.log('Seeding Chapter Objects...');

  await seedChapterCounts(emdros, realm);
  await seedBookChapters(emdros, realm);
}

async function seedChapterCounts(emdros: Object, realm: Object) {
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

async function seedBookChapters(emdros, realm) {
  const books = [];
  const bookChapters = {};
  for (let [index, book] of realm.objects('Book').entries()) {
    const chapterCount = book.chapterCount;
    const chapters = [];
    for (let i = 0; i < chapterCount; i++) {
      const chapterNumber = i + 1;
      const monadSet = await seedBookChapterMonadSet(emdros, book, chapterNumber);
      const chapter = {
        id: getChapterID(book, chapterNumber),
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

export async function seedChapters(emdros: Object, realm: Object) {
  console.log('Seeding Chapters...');

  await seedSourceTypeCounts(emdros, realm);

  await seedSources(emdros, realm);

  await seedWordCounts(emdros, realm);
}

async function seedWordCounts(emdros, realm) {
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
      realm.write(() => {
        realm.objects('Book').forEach(book => {
          const bookData = data["Book"]["DJHRef"][book.DJHRef];
          if (bookData != null) {
            const chapterData = bookData["Chapter"]["chapter"];
            if (chapterData != null) {
              let maxChapterWordCount = 0;

              book.chapters.forEach((chapter, index) => {
                const wordCount = chapterData[chapter.chapterNumber.toString()]["Token"] || 0;
                chapter.wordCount = wordCount;
                if (wordCount > maxChapterWordCount) {
                  maxChapterWordCount = wordCount;
                }
              });

              book.maxChapterWordCount = maxChapterWordCount;
            }
          }
        });
      });

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedSourceTypeCounts(emdros, realm) {
  console.log('Seeding Chapter Source Type Word Counts...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter",
      "feature": "chapter",
      "buckets": {
        "objectTypeName": "Source",
        "feature": "source_color",
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

      realm.write(() => {
        realm.objects('Book').forEach(book => {
          const bookData = data["Book"]["DJHRef"][book.DJHRef];
          if (bookData != null) {
            console.log(`Seeding ${book.name} Chapter Source Type Word Counts...`);
            const chapterData = bookData["Chapter"]["chapter"];
            if (chapterData != null) {
              book.chapters.forEach((chapter, index) => {
                const sourceData = chapterData[chapter.chapterNumber.toString()]["Source"]["source_color"];
                seedObjectSourceTypeWordCounts(chapter, sourceData);
              });
            }
          }
        });
      });

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedSources(emdros, realm) {
  console.log('Seeding Chapter Sources...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter",
      "feature": "chapter",
      "buckets": {
        "objectTypeName": "Source",
        "feature": "source_name"
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      realm.write(() => {
        realm.objects('Book').forEach(book => {
          const bookData = data["Book"]["DJHRef"][book.DJHRef];
          if (bookData != null) {
            const chapterData = bookData["Chapter"]["chapter"];
            if (chapterData != null) {
              book.chapters.forEach((chapter, index) => {
                const sources = [];
                const sourceData = chapterData[chapter.chapterNumber.toString()]["Source"];
                if (sourceData != null) {
                  Object.keys(sourceData).forEach((sourceName) => {
                    const source = realm.objectForPrimaryKey('Source', getSourceID(sourceName));
                    if (source != null) {
                      sources.push(source);
                    }
                  });
                }

                realm.create('Chapter', {id: chapter.id, sourceCount: sources.length, sources}, true);
              });
            }
          }
        });
      });

      resolve();
    }).catch((error) => {
      console.log(error);
    });
  });
}
