/* @flow */
'use strict';

const {getChapterID, firstInitial, getSourceID, seedObjectSourceTypeWordCounts, seedObjectSphereWordCounts, seedObjectWordCloud, SPHERE_MAP} = require('../common');

const SPHERES = [
  { id: "family", name: "Family" },
  { id: "economics", name: "Economics" },
  { id: "government", name: "Government" },
  { id: "religion", name: "Religion" },
  { id: "education", name: "Education" },
  { id: "communication", name: "Communication" },
  { id: "celebration", name: "Celebration" },
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
