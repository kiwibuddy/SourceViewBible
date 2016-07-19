/* @flow */
'use strict';

const {getChapterID, firstInitial, getSourceID, seedObjectSourceTypeWordCounts, seedObjectSphereWordCounts, seedObjectWordCloud, SPHERE_MAP} = require('../common');

export async function seedSourceObjects(emdros: Object, realm: Object) {
  console.log('Seeding Source Objects...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Source",
      "feature": "source_name",
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      const sources = {};
      const bookData = data["Book"]["DJHRef"];
      Object.keys(bookData).map(DJHRef => {
        const sourceData = bookData[DJHRef]["Source"]["source_name"];
        Object.keys(sourceData).map(sourceName => {
          const sourceID = getSourceID(sourceName);
          sources[sourceID] = {
            id: sourceID,
            name: sourceName,
            firstInitial: firstInitial(sourceName)
          };
        });
      });

      realm.write(() => {
        Object.keys(sources).forEach(sourceID => realm.create('Source', sources[sourceID]));
      });

      resolve();
    }).catch((error) => {
      console.log(error);
    });
  });
}

export async function seedSources(emdros: Object, realm: Object) {
  console.log('Seeding Sources...');

  await seedSourceWordCloud(emdros, realm);
}

async function seedSourceWordCloud(emdros, realm) {
  console.log('Seeding Source Word Cloud...');
  const query = `
  {
    "objectTypeName": "Source",
    "feature": "source_name",
    "buckets": {
      "objectTypeName": "Token",
      "feature": "surface",
      "expression" : "is_word=true"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      const sourceData = data["Source"]["source_name"];
      if (sourceData != null) {
        Object.keys(sourceData).forEach(sourceName => {
          realm.write(() => {
            let source = realm.objects('Source').find(source => source.name === sourceName);
            const wordData = sourceData[sourceName]["Token"]["surface"];
            seedObjectWordCloud(realm, 'Source', source.id, wordData);
          });
        });
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedSourceOccurrences(emdros, bible) {
  console.log('Seeding Source Occurrences...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter",
      "feature": "chapter",
      "buckets": {
        "objectTypeName": "Source",
        "feature": "source_name",
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of bible.books.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const sources = book.sources;
          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            for (let [index, chapter] of book.chapters.entries()) {
              const chapterNumber = chapter.chapterNumber;
              const sourceData = chapterData[chapterNumber.toString()]["Source"]["source_name"];
              if (sourceData != null) {
                Object.keys(sourceData).forEach((sourceName) => {
                  const source = sources.find(source => source.name === sourceName);
                  if (!source.occurrences) source.occurrences = [];
                  source.occurrences.push({
                    chapterNumber: chapterNumber
                  });
                });
              }
            }
          }
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    });
  });
}
