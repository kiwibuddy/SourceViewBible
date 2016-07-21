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

export async function seedSphereObjects(emdros: Object, realm: Object) {
  SPHERES.forEach(sphere => {
    realm.write(() => {
      realm.create('Sphere', sphere);
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
    realm.objects('Sphere').forEach(sphere => {
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

        realm.create('Sphere', {id: sphere.id, bookCount, bookCounts}, true);
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
      "feature": ["surface"],
      "expression" : "is_word=true AND ${sphereName}=true"
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      realm.write(() => {
        const wordData = data["Token"]["surface"];
        seedObjectWordCloud(realm, 'Sphere', sphere.id, wordData);
      });

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}
