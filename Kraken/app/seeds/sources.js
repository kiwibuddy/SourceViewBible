/* @flow */
'use strict';

const {getChapterID, firstInitial, getSourceID, seedObjectSourceTypeWordCounts, seedObjectSphereWordCounts, seedObjectWordCloud, SPHERE_MAP} = require('../common');

export async function seedSourceObjects(emdros: Object, realm: Object) {
  console.log('Seeding Sources...');

  await seedSourceNames(emdros, realm);
}

async function seedSourceNames(emdros: Object, realm: Object) {
  console.log('Seeding Source Names...');
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
