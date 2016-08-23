/* @flow */
'use strict';

import Emdros from 'react-native-emdros';
let DB = null;

const SCRIPTURE_STYLESHEET = require('./scripture-stylesheet.json');
const OCCURRENCE_STYLESHEET = require('./occurrence-stylesheet.json');

const SPHERE_CLASS_MAP = {
  'family': 'Fam',
  'economics': 'Eco',
  'government': 'Gov',
  'religion': 'Rel',
  'education': 'Edu',
  'communication': 'Com',
  'celebration': 'Cel'
};

const SPHERE_FEATURE_MAP = {
  'family': 'Family',
  'economics': 'Economics',
  'government': 'Government',
  'religion': 'Religion',
  'education': 'Education',
  'communication': 'MediaCom',
  'celebration': 'Celebration'
};

function highlightSpheres(feature: string, spheres: any, startingPosition: number) {
  if (spheres.length > 0) {
    const sphereClasses = spheres.map((sphere, index) => {
      const sphereClass = SPHERE_CLASS_MAP[sphere];
      return (`{{ if featureequal ${index + startingPosition} 'true' }} h${sphereClass}{{ endif }}`);
    });

    return `{{ setvar 'sphere_classes' }}${sphereClasses.join('')}{{ setvarend }}{{ if varequal 'sphere_classes' '' }}${feature}{{ else }}<span class="{{ emitvar 'sphere_classes' }}">${feature}</span>{{ endif }}`;
  } else {
    return feature;
  }
}

function openDatabase() {
  Emdros.open({name: 'Datasets/en/NLT/SourceView.bpt'}).then((emdros) => {
    DB = emdros;
  }).catch((error) => {
    console.log(error);
  });
}

function query(query: string, options: Object) {
  if (DB == null) {
    const promise = new Promise((resolve, reject) => {
      reject('DB is null');
    });
    return promise;
  }

  return DB.query(query, options);
}

function scripture(options: Object) {
  let stylesheet = null;
  if (options && options.stylesheet == 'occurrence') {
    stylesheet = OCCURRENCE_STYLESHEET;
  } else {
    stylesheet = JSON.parse(JSON.stringify(SCRIPTURE_STYLESHEET));
    const spheres = (options && options.spheres ? options.spheres : []);
    const sphereFeatures = spheres.map(sphere => SPHERE_FEATURE_MAP[sphere]);

    const base = stylesheet['fetchinfo']['base']['object_types'];
    base['Token']['start'] = base['Token']['start'].replace('{{SPHERES}}', highlightSpheres('{{ feature 0 }}', spheres, 1));
    base['Token']['get'] = base['Token']['get'].concat(sphereFeatures);
    base['NonWordToken'] = base['Token'];
    base['SpaceToken']['start'] = highlightSpheres(' ', options.spheres, 0);
    base['SpaceToken']['get'] = sphereFeatures;
    base['VerseNumberToken']['start'] = base['VerseNumberToken']['start'].replace('{{SPHERES}}', highlightSpheres('{{ featurenomangle 0 }}&#160;', spheres, 1));
    base['VerseNumberToken']['get'] = base['VerseNumberToken']['get'].concat(sphereFeatures);
    base['ChapterNumberToken']['start'] = base['ChapterNumberToken']['start'].replace('{{SPHERES}}', highlightSpheres('{{ featurenomangle 0 }}', spheres, 1));
    base['ChapterNumberToken']['get'] = base['ChapterNumberToken']['get'].concat(sphereFeatures);
  }
  const style = {stylesheet: JSON.stringify(stylesheet)};

  let monadSet = options.monadSet;
  if (!monadSet) {
    const book = options.book;
    if (book) {
      const chapterNumber = options.chapterNumber || 1;
      const chapter = book.chapters[chapterNumber - 1];
      monadSet = chapter.monadSet;
    }
  }

  return new Promise((resolve, reject) => {
    if (DB == null) {
      reject('DB is null');
      return;
    }

    DB.string(monadSet.first, monadSet.last, style).then((result) => {
      resolve(result.trim());
    }).catch((error) => {
      reject(error);
    });
  })
}

function words(options: Object) {
  if (DB == null) {
    const promise = new Promise((resolve, reject) => {
      reject('DB is null');
    });
    return promise;
  }

  return DB.words(options);
}

function wordCountsForContext(context: string, options: Object) {
  if (DB == null) {
    const promise = new Promise((resolve, reject) => {
      reject('DB is null');
    });
    return promise;
  }

  return DB.wordCountsForContext(context, options);
}

module.exports = {
  key: Emdros.key,
  preferencesKey: Emdros.preferencesKey,
  openDatabase,
  query,
  scripture,
  words,
  wordCountsForContext,
};
