/* @flow */
'use strict';

const {getChapterID, firstInitial, getSourceID, seedObjectSourceTypeWordCounts, seedObjectSphereWordCounts, seedObjectWordCloud, SPHERE_MAP} = require('../common');

const SPHERES = [
  { id: "family", name: "Family", position: 1 },
  { id: "economics", name: "Economics", position: 2 },
  { id: "government", name: "Government", position: 3 },
  { id: "religion", name: "Religion", position: 4 },
  { id: "education", name: "Education", position: 5 },
  { id: "communication", name: "Communication", position: 6 },
  { id: "celebration", name: "Celebration", position: 7 },
];

const SPHERE_DESCRIPTIONS = require('../spheres');
const SPHERE_PASSAGES = require('../../db/seeds/sphere-key-passages');

export async function seedSphereObjects(emdros: Object, realm: Object) {
  console.log('Seeding Sphere Objects...');

  realm.write(() => {
    const description = SPHERE_DESCRIPTIONS.foundational.description;
    const passages = SPHERE_PASSAGES['Foundational'].map(passage => {
      const book = realm.objects('Book').find(book => book.name === passage.monads[0].bookName);
      if (!book) console.log(`No book ${passage.monads[0].bookName}`);
      const monads = passage.monads.map(monad => ({...monad, book}));
      return {...passage, monads};
    });
    realm.create('Sphere', {id: "foundational", name: "Foundational", description, position: 0, passages});
  });

  SPHERES.forEach(sphere => {
    realm.write(() => {
      const description = SPHERE_DESCRIPTIONS[sphere.id].description;
      const passages = SPHERE_PASSAGES[sphere.name].map(passage => {
        const book = realm.objects('Book').find(book => book.name === passage.monads[0].bookName);
        if (!book) console.log(`No book ${passage.monads[0].bookName}`);
        const monads = passage.monads.map(monad => ({...monad, book}));
        return {...passage, monads};
      });
      realm.create('Sphere', {...sphere, description, passages});
    });
  })
}

export async function seedSpheres(emdros: Object, realm: Object) {
  console.log('Seeding Spheres...');

  await seedSphereWordCounts(emdros, realm);

  const sphereNames = Object.keys(SPHERE_MAP);
  for (let sphereName of sphereNames) {
    await seedSphereWordCloud(sphereName, emdros, realm);
  }
}

async function seedSphereWordCounts(emdros, realm) {
  console.log('Seeding Spheres Word Counts...');

  return new Promise((resolve, reject) => {
    realm.objects('Sphere').filtered('position > 0').forEach(sphere => {
      realm.write(() => {
        let bookCount = 0;
        const bookCounts = [];

        for (let [index, book] of realm.objects('Book').entries()) {
          const wordCount = book.sphereCounts.find(count => count.string === sphere.id).count || 0;
          bookCounts.push({
            string: book.id,
            count: wordCount
          });

          if (wordCount > 0) {
            bookCount++;
          }
        }

        bookCounts.sort((countA, countB) => {
          const bookA = realm.objectForPrimaryKey('Book', countA.string);
          const bookAWordCount = countA.count;
          const bookAPercent = (bookAWordCount / bookA.wordCount) * 100;

          const bookB = realm.objectForPrimaryKey('Book', countB.string);
          const bookBWordCount = countB.count;
          const bookBPercent = (bookBWordCount / bookB.wordCount) * 100;

          if (bookAPercent == bookBPercent) {
            return bookAWordCount > bookBWordCount ? -1 : 1;
          }
          return bookAPercent > bookBPercent ? -1 : 1;
        });


        let sourceCount = 0;

        const sourceCounts = [];
        const sourceTypes = {};

        for (let [index, actant] of realm.objects('Actant').filtered('isSource = $0', true).entries()) {
          const sphereCount = actant.sphereCounts.find(count => count.string === sphere.id)
          const wordCount = (sphereCount ? sphereCount.count : 0);
          sourceCounts.push({
            string: actant.id.toString(),
            count: wordCount
          });

          if (wordCount > 0) {
            sourceCount++;

            actant.sourceTypeCounts.forEach(sourceTypeCount => {
              if (sourceTypeCount.count > 0) {
                const count = sourceTypes[sourceTypeCount.string] || 0;
                sourceTypes[sourceTypeCount.string] = count + sourceTypeCount.count;
              }
            });
          }
        }

        const sourceTypeCounts = Object.keys(sourceTypes).map(sourceType => {
          return {string: sourceType, count: sourceTypes[sourceType]};
        });
        const sourceTypeCount = sourceTypeCounts.length;

        sourceCounts.sort((countA, countB) => {
          return countA.count > countB.count ? -1 : 1;
          // const sourceA = realm.objectForPrimaryKey('Actant', parseInt(countA.string));
          // const sourceAWordCount = countA.count;
          // const sourceAPercent = (sourceAWordCount / sourceA.wordCount) * 100;
          //
          // const sourceB = realm.objectForPrimaryKey('Actant', parseInt(countB.string));
          // const sourceBWordCount = countB.count;
          // const sourceBPercent = (sourceBWordCount / sourceB.wordCount) * 100;
          //
          // if (sourceAPercent == sourceBPercent) {
          //   return sourceAWordCount > sourceBWordCount ? -1 : 1;
          // }
          // return sourceAPercent > sourceBPercent ? -1 : 1;
        });


        realm.create('Sphere', {id: sphere.id, bookCount, bookCounts, sourceCount, sourceCounts, sourceTypeCount, sourceTypeCounts}, true);
      });
    });

    resolve();
  });
}


async function seedSphereWordCloud(sphereName, emdros, realm) {
  const sphere = realm.objectForPrimaryKey('Sphere', SPHERE_MAP[sphereName]);
  console.log(`Seeding Sphere: ${sphere.name} Word Cloud...`);
  const query = `
  {
      "objectTypeName": "Token",
      "feature": ["surface_fts"],
      "expression" : "${sphereName}=true"
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      realm.write(() => {
        const wordData = data["Token"]["surface_fts"];
        seedObjectWordCloud(realm, 'Sphere', sphere.id, wordData);
      });

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}
