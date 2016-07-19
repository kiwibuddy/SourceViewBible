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

}
