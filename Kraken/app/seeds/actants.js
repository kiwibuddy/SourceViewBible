/* @flow */
'use strict';

const {getChapterID, firstInitial, seedObjectSphereWordCounts, seedObjectWordCloud, SPHERE_MAP} = require('../common');

const ACTANTS = require('../../data/actants');

export async function seedActantObjects(emdros: Object, realm: Object) {
  console.log('Seeding Actant Objectss...');

  realm.write(() => {
    ACTANTS.forEach(actant => realm.create('Actant', actant));
  });
}

export async function seedActants(emdros: Object, realm: Object) {
  console.log('Seeding Actants...');

  // await seedActantWordCloud(emdros, realm);

  // await seedActantOccurrences(emdros, realm);
}

async function seedActantWordCloud(emdros, realm) {
  console.log('Seeding Actant Word Cloud...');
  const query = `
  {
    "objectTypeName": "Actant",
    "feature": "actant_name",
    "buckets": {
      "objectTypeName": "Token",
      "feature": "surface",
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      const actantData = data["Actant"]["actant_name"];
      if (actantData != null) {
        Object.keys(actantData).forEach(actantName => {
          realm.write(() => {
            let actant = realm.objects('Actant').find(actant => actant.name === actantName);
            const wordData = actantData[actantName]["Token"]["surface"];
            seedObjectWordCloud(realm, 'Actant', actant.id, wordData);
          });
        });
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedActantOccurrences(emdros, realm) {
  console.log('Seeding Actant Occurrences...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter",
      "feature": "chapter",
      "buckets": {
        "objectTypeName": "Actant",
        "feature": "actant_name",
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of realm.objects('Book').entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const actants = book.actants;
          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            for (let [index, chapter] of book.chapters.entries()) {
              const chapterNumber = chapter.chapterNumber;
              const actantData = chapterData[chapterNumber.toString()]["Actant"]["actant_name"];
              if (actantData != null) {
                Object.keys(actantData).forEach((actantName) => {
                  realm.write(() => {
                    const actant = realm.objects('Actant').find(actant => actant.name === actantName);
                    let occurrence = actant.occurrences.find(occurrence => occurrence.book.id == book.id);
                    const count = actantData[actantName];
                    if (!occurrence) {
                      actant.occurrences.push({
                        book,
                        count
                      });
                    } else {
                      occurrence.count += count;
                    }
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
