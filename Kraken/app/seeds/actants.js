/* @flow */
'use strict';

const {getChapterID, firstInitial, seedObjectSphereWordCounts, seedObjectWordCloud, seedObjectSourceTypeWordCounts, SPHERE_MAP} = require('../common');

const ACTANTS = require('../../db/seeds/actants');

export async function seedActantObjects(emdros: Object, realm: Object) {
  console.log('Seeding Actant Objects...');

  realm.write(() => {
    ACTANTS.forEach(actant => {
      try {
        realm.create('Actant', actant, true);
      } catch(error) {
        console.log(actant);
        throw error;
      }
    });
  });
}

export async function seedActants(emdros: Object, realm: Object) {
  console.log('Seeding Actants...');

  await seedSourceTypes(emdros, realm);

  await seedActantWordCloud(emdros, realm);

  await seedSphereCounts(emdros, realm);
}

async function seedSourceTypes(emdros, realm) {
  console.log('Seeding Actant Source Types...');
  const query = `
  {
    "objectTypeName": "SourceActant",
    "feature": "actant_id",
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
      for (let [index, actant] of realm.objects('Actant').filtered('isSource = $0', true).entries()) {
        console.log(`Seeding ${actant.name} Source Types...`);

        const actantData = data["SourceActant"]["actant_id"][actant.id.toString()];
        if (actantData != null) {
          realm.write(() => {
            const sourceData = actantData["Source"];

            const sourceTypeData = sourceData["source_color"];
            seedObjectSourceTypeWordCounts(realm, 'Actant', actant.id, sourceTypeData);
          });
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedActantWordCloud(emdros, realm) {
  console.log('Seeding Actant Word Cloud...');
  const query = `
  {
    "objectTypeName": "SourceActant",
    "feature": "actant_id",
    "buckets": {
      "objectTypeName": "Token",
      "feature": "surface_fts",
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      const actantData = data["SourceActant"]["actant_id"];

      if (actantData != null) {
        Object.keys(actantData).forEach(actantID => {
          realm.write(() => {
            const actant = realm.objectForPrimaryKey('Actant', parseInt(actantID));
            if (actant) {
              const wordData = actantData[actantID]["Token"]["surface_fts"];
              seedObjectWordCloud(realm, 'Actant', actant.id, wordData);
            }
          });
        });
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedSphereCounts(emdros, realm) {
  console.log('Seeding Actant Sphere Word Counts...');
  const sphereFeatures = Object.keys(SPHERE_MAP).map(key => `"${key}"`).join(', ');
  const query = `
  {
    "objectTypeName": "SourceActant",
    "feature": "actant_id",
    "buckets": {
      "objectTypeName": "Token",
      "feature": [${sphereFeatures}],
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      const actantData = data["SourceActant"]["actant_id"];

      Object.keys(actantData).forEach(actantID => {
        realm.write(() => {
          const actant = realm.objectForPrimaryKey('Actant', parseInt(actantID));
          if (actant) {
            const spheresData = actantData[actantID]["Token"];
            seedObjectSphereWordCounts(realm, 'Actant', actant.id, spheresData);
          }
        });
      });

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}
