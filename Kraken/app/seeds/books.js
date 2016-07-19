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

  await seedSourceTypeCounts(emdros, realm);

  await seedSources(emdros, realm);

  await seedBookSphereCounts(emdros, realm);

  await seedWordCounts(emdros, realm);

  await seedBookWordCloud(emdros, realm);
}

async function seedSourceTypeCounts(emdros, realm) {
  console.log('Seeding Book Source Type Word Counts...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Source",
      "feature": "source_color",
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
            const sourceData = bookData["Source"]["source_color"];
            seedObjectSourceTypeWordCounts(realm, 'Book', book.id, sourceData);
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
                const source = realm.objectForPrimaryKey('Source', getSourceID(sourceName));
                if (source != null) {
                  sources.push(source);
                }
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
      realm.write(() => {
        realm.objects('Book').forEach(book => {
          const bookData = data["Book"]["DJHRef"][book.DJHRef];
          if (bookData != null) {
            const spheresData = bookData["Token"];
            seedObjectSphereWordCounts(book, spheresData);
          }
        });
      });

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedWordCounts(emdros, realm) {
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
      realm.write(() => {
        realm.objects('Book').forEach(book => {
          const bookData = data["Book"]["DJHRef"][book.DJHRef];
          if (bookData != null) {
            const wordCount = bookData["Token"] || 0;
            book.wordCount = wordCount;
          }
        });
      });

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
        realm.objects('Book').forEach(book => {
          const bookData = data["Book"]["DJHRef"][book.DJHRef];
          if (bookData != null) {
            const wordData = bookData["Token"]["surface"];
            seedObjectWordCloud(book, wordData);
          }
        });
      });

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}
