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
        for (let [index, book] of realm.objects('Book').entries()) {
          const bookData = data["Book"]["DJHRef"][book.DJHRef];
          if (bookData != null) {
            const chapterCount = bookData["Chapter"] || 0;
            realm.create('Book', {id: book.id, chapterCount}, true);
          }
        }

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

  await seedSourceCounts(emdros, realm);

  await seedChapterSphereWordCount(emdros, realm);
  await seedSphereCounts(emdros, realm);

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
      for (let [index, book] of realm.objects('Book').entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            realm.write(() => {
              let maxChapterWordCount = 0;

              for (let [index, chapter] of book.chapters.entries()) {
                const wordCount = chapterData[chapter.chapterNumber.toString()]["Token"] || 0;
                chapter.wordCount = wordCount;
                if (wordCount > maxChapterWordCount) {
                  maxChapterWordCount = wordCount;
                }
              }

              book.maxChapterWordCount = maxChapterWordCount;
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

async function seedSourceCounts(emdros, realm) {
  console.log('Seeding Chapter Source Counts...');
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
      for (let [index, book] of realm.objects('Book').entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          console.log(`Seeding ${book.name} Chapter Source Type Word Counts...`);
          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            realm.write(() => {
              for (let [index, chapter] of book.chapters.entries()) {
                const sourceData = chapterData[chapter.chapterNumber.toString()]["Source"];

                const sourceTypeData = sourceData["source_color"];
                seedObjectSourceTypeWordCounts(realm, 'Chapter', chapter.id, sourceTypeData);

                const sourceNameData = sourceData["source_name"];
                if (sourceNameData != null) {
                  const sourceCount = Object.keys(sourceNameData).length;
                  realm.create('Chapter', {id: chapter.id, sourceCount}, true);
                }
              }
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

async function seedSphereCounts(emdros, realm) {
  console.log('Seeding Chapter Sphere Word Counts...');
  const sphereFeatures = Object.keys(SPHERE_MAP).map(key => `"${key}"`).join(', ');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter",
      "feature": "chapter",
      "buckets": {
        "objectTypeName": "Token",
        "feature": [${sphereFeatures}],
        "expression" : "is_word=true"
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of realm.objects('Book').entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            console.log(`Seeding ${book.name} Chapter Sphere Word Counts...`);
            realm.write(() => {
              for (let [index, chapter] of book.chapters.entries()) {
                const spheresData = chapterData[chapter.chapterNumber.toString()]["Token"];
                seedObjectSphereWordCounts(realm, 'Chapter', chapter.id, spheresData);
              }
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

async function seedChapterSphereWordCount(emdros, realm) {
  console.log('Seeding Chapter Sphere Word Count...');

  const sphereExpression = Object.keys(SPHERE_MAP).map(key => `${key}=true`).join(' OR ');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter",
      "feature": "chapter",
      "buckets": {
        "objectTypeName": "Token",
        "expression" : "is_word=true AND (${sphereExpression})"
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of realm.objects('Book').entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          realm.write(() => {
            const chapterData = bookData["Chapter"]["chapter"];
            if (chapterData != null) {
              for(let [index, chapter] of book.chapters.entries()) {
                const wordCount = chapterData[chapter.chapterNumber.toString()]["Token"] || 0;
                chapter.sphereWordCount = wordCount;
              }
            }
          });
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}
