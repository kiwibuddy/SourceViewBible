/* @flow */
'use strict';

const {getChapterID, firstInitial, getSourceID, seedObjectSourceTypeWordCounts, seedObjectSphereWordCounts, seedObjectWordCloud, SPHERE_MAP} = require('../common');

const UUID = require('react-native-uuid');

const BOOKS = require('../books');

export async function seedBookObjects(emdros: Object, realm: Object) {
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

export async function seedBooks(emdros: Object, realm: Object) {
  console.log('Seeding Books...');

  await seedSources(emdros, realm);

  await seedSourceWordCloud(emdros, realm);

  await seedBookSphereCounts(emdros, realm);

  await seedBookWordCloud(emdros, realm);
}

async function seedSources(emdros, realm) {
  console.log('Seeding Book Sources...');
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
      for (let [index, book] of realm.objects('Book').entries()) {
        console.log(`Seeding ${book.name} Sources...`);

        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          realm.write(() => {
            const sourceData = bookData["Source"];

            const sourceTypeData = sourceData["source_color"];
            seedObjectSourceTypeWordCounts(realm, 'Book', book.id, sourceTypeData);

            const sourceNameData = sourceData["source_name"];
            let maxSourceWordCount = 0;
            const sourceRelations = [];
            Object.keys(sourceNameData).forEach((sourceName) => {
              const source = realm.objectForPrimaryKey('Source', getSourceID(sourceName));
              if (source != null) {
                const wordCount = sourceNameData[sourceName]["Token"] || 0;

                sourceRelations.push({
                  id: UUID.v4(),
                  source,
                  wordCount
                });

                if (wordCount > maxSourceWordCount) {
                  maxSourceWordCount = wordCount;
                }
              }
            });

            realm.create('Book', {id: book.id, maxSourceWordCount, sourceCount: sourceRelations.length, sourceRelations}, true);
          });
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedBookWordCloud(emdros, realm) {
  console.log('Seeding Book Word Cloud...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Token",
      "feature": "surface",
      "expression" : "is_word=true"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      realm.write(() => {
        for (let [index, book] of realm.objects('Book').entries()) {
          const bookData = data["Book"]["DJHRef"][book.DJHRef];
          if (bookData != null) {
            const wordData = bookData["Token"]["surface"];
            seedObjectWordCloud(realm, 'Book', book.id, wordData);
          }
        }
      });

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedSourceWordCloud(emdros, realm) {
  console.log('Seeding Book Source Word Cloud...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Source",
      "feature": "source_name",
      "buckets": {
        "objectTypeName": "Token",
        "feature": "surface",
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
          realm.write(() => {
            const sourceData = bookData["Source"]["source_name"];
            if (sourceData != null) {
              Object.keys(sourceData).forEach(sourceName => {
                const source = realm.objectForPrimaryKey('Source', getSourceID(sourceName));
                if (source != null) {
                  const sourceRelation = book.sourceRelations.find(sourceRelation => sourceRelation.source.id === source.id);
                  const wordData = sourceData[sourceName]["Token"]["surface"];
                  seedObjectWordCloud(realm, 'SourceRelation', sourceRelation.id, wordData);
                }
              });
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

async function seedBookSphereCounts(emdros, realm) {
  console.log('Seeding Book Sphere Word Counts...');
  const sphereFeatures = Object.keys(SPHERE_MAP).map(key => `"${key}"`).join(', ');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Token",
      "feature": [${sphereFeatures}],
      "expression" : "is_word=true"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of realm.objects('Book').entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          realm.write(() => {
            const spheresData = bookData["Token"];
            seedObjectSphereWordCounts(realm, 'Book', book.id, spheresData);
          });
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}
