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

  await seedSourceTypes(emdros, realm);

  await seedSources(emdros, realm);
  await seedSourceSourceTypes(emdros, realm);

  await seedSourceWordCloud(emdros, realm);

  await seedBookSphereWordCount(emdros, realm);
  await seedBookSphereCounts(emdros, realm);

  await seedBookWordCloud(emdros, realm);

  await seedSourceRelationSphereWordCount(emdros, realm);
  await seedSourceRelationSphereCounts(emdros, realm);
}

async function seedSourceTypes(emdros, realm) {
  console.log('Seeding Book Source Types...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Source",
      "feature": ["source_color"],
      "buckets": {
        "objectTypeName": "Token",
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of realm.objects('Book').entries()) {
        console.log(`Seeding ${book.name} Source Types...`);

        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          realm.write(() => {
            const sourceData = bookData["Source"];

            const sourceTypeData = sourceData["source_color"];
            seedObjectSourceTypeWordCounts(realm, 'Book', book.id, sourceTypeData);
          });
        }
      }

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
      "objectTypeName": "SourceActant",
      "feature": ["actant_id"],
      "buckets": {
        "objectTypeName": "Token",
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
            const sourceData = bookData["SourceActant"]["actant_id"];
            if (sourceData != null) {
              let maxSourceWordCount = 0;
              const sourceRelations = [];
              Object.keys(sourceData).forEach((actantID) => {
                const actant = realm.objectForPrimaryKey('Actant', parseInt(actantID));
                if (actant != null) {
                  const wordCount = sourceData[actantID]["Token"] || 0;
                  if (wordCount > 0) {
                    sourceRelations.push({
                      id: UUID.v4(),
                      book,
                      source: actant,
                      wordCount
                    });
                  }

                  if (wordCount > maxSourceWordCount) {
                    maxSourceWordCount = wordCount;
                  }
                }
              });

              realm.create('Book', {id: book.id, maxSourceWordCount, sourceCount: sourceRelations.length, sourceRelations}, true);
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

async function seedBookWordCloud(emdros, realm) {
  console.log('Seeding Book Word Cloud...');

  for (let [index, book] of realm.objects('Book').entries()) {
    const words = await emdros.words({from: book.firstMonad, to: book.lastMonad});
    realm.write(() => {
      seedObjectWordCloud(realm, 'Book', book.id, words);
    });
  }
}


async function seedSourceSourceTypes(emdros, realm) {
  console.log('Seeding Book Source Relation Source Types...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "SourceActant",
      "feature": ["actant_id"],
      "buckets": {
        "objectTypeName": "Source",
        "feature": ["source_color"],
        "buckets": {
          "objectTypeName": "Token",
        }
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of realm.objects('Book').entries()) {
        console.log(`Seeding ${book.name} Source Relation Sources Types...`);

        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const actantData = bookData["SourceActant"]["actant_id"];
          if (actantData != null) {
            Object.keys(actantData).forEach(actantID => {
              const sourceRelation = book.sourceRelations.find(sourceRelation => sourceRelation.source.id === parseInt(actantID));
              if (sourceRelation) {
                const sourceData = actantData[actantID]["Source"];
                if (sourceData != null) {
                  realm.write(() => {
                    const sourceTypeData = sourceData["source_color"];
                    seedObjectSourceTypeWordCounts(realm, 'SourceRelation', sourceRelation.id, sourceTypeData);
                  });
                }
              } else {
                console.log('No Source Relation??');
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

async function seedSourceWordCloud(emdros, realm) {
  console.log('Seeding Book Source Word Cloud...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "SourceActant",
      "feature": "actant_id",
      "buckets": {
        "objectTypeName": "Token",
        "feature": "surface_fts",
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
            const sourceData = bookData["SourceActant"]["actant_id"];
            if (sourceData != null) {
              Object.keys(sourceData).forEach(actantID => {
                const actant = realm.objectForPrimaryKey('Actant', parseInt(actantID));
                if (actant != null) {
                  const sourceRelation = book.sourceRelations.find(sourceRelation => sourceRelation.source.id === actant.id);
                  const wordData = sourceData[actantID]["Token"]["surface_fts"];
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

async function seedBookSphereWordCount(emdros, realm) {
  console.log('Seeding Book Sphere Word Count...');

  const sphereExpression = Object.keys(SPHERE_MAP).map(key => `${key}=true`).join(' OR ');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Token",
      "expression" : "(${sphereExpression})"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      realm.write(() => {
        for (let [index, book] of realm.objects('Book').entries()) {
          const bookData = data["Book"]["DJHRef"][book.DJHRef];
          if (bookData != null) {
            const wordCount = bookData["Token"];
            if (wordCount) {
              book.sphereWordCount = wordCount;
            }
          }
        }
      });

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

async function seedSourceRelationSphereWordCount(emdros, realm) {
  console.log('Seeding Source Relation Sphere Word Count...');

  const sphereExpression = Object.keys(SPHERE_MAP).map(key => `${key}=true`).join(' OR ');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "SourceActant",
      "feature": ["actant_id"],
      "buckets": {
        "objectTypeName": "Token",
        "expression" : "(${sphereExpression})"
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
            const sourceData = bookData["SourceActant"]["actant_id"];
            if (sourceData != null) {
              Object.keys(sourceData).forEach(actantID => {
                const actant = realm.objectForPrimaryKey('Actant', parseInt(actantID));
                if (actant != null) {
                  const sourceRelation = book.sourceRelations.find(sourceRelation => sourceRelation.source.id === actant.id);
                  const wordCount = sourceData[actantID]["Token"];
                  if (wordCount && wordCount > 0) {
                    sourceRelation.sphereWordCount = wordCount;
                  }
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

async function seedSourceRelationSphereCounts(emdros, realm) {
  console.log('Seeding Source Relation Sphere Word Counts...');
  const sphereFeatures = Object.keys(SPHERE_MAP).map(key => `"${key}"`).join(', ');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "SourceActant",
      "feature": ["actant_id"],
      "buckets": {
        "objectTypeName": "Token",
        "feature": [${sphereFeatures}],
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
            const sourceData = bookData["SourceActant"]["actant_id"];
            if (sourceData != null) {
              Object.keys(sourceData).forEach(actantID => {
                const actant = realm.objectForPrimaryKey('Actant', parseInt(actantID));
                if (actant != null) {
                  const sourceRelation = book.sourceRelations.find(sourceRelation => sourceRelation.source.id === actant.id);
                  const spheresData = sourceData[actantID]["Token"];
                  seedObjectSphereWordCounts(realm, 'SourceRelation', sourceRelation.id, spheresData);
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
