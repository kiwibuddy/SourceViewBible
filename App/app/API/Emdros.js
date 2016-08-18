/* @flow */
'use strict';

import Emdros from 'react-native-emdros';
let DB = null;

const SCRIPTURE_STYLESHEET = require('./scripture-stylesheet.json');
const OCCURRENCE_STYLESHEET = require('./occurrence-stylesheet.json');

function highlightSpheres(spheres: any) {
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

  const features = ['surface'];

  let value = null;
  if (spheres.length > 0) {
    const featureLength = features.length;
    const sphereClasses = spheres.map((sphere, index) => {
      const sphereClass = SPHERE_CLASS_MAP[sphere];
      return (`{{ if featureequal ${index + featureLength} 'true' }} h${sphereClass}{{ endif }}`);
    });

    value = `{{ setvar 'sphere_classes' }}${sphereClasses.join('')}{{ setvarend }}{{ if varequal 'sphere_classes' '' }}{{ feature 0 }}{{ else }}<span class="{{ emitvar 'sphere_classes' }}">{{ feature 0 }}</span>{{ endif }}`;
  } else {
    value = '{{ feature 0 }}';
  }
  const start = `{{ if varequal 'StartParagraph' 'true' }}<p class="{{ emitvar 'ParagraphType' }}">{{ setvar 'StartParagraph' }}{{ setvarend }}{{ if varequal 'TextKind' 'Prose' }}{{ setvar 'ParagraphType' }}{{ setvarend }}{{ endif }}{{ endif }}${value}`;

  return {
    "docindexfeature": "docindex",
    "end": "",
    "get": features.concat(spheres.map(sphere => SPHERE_FEATURE_MAP[sphere])),
    "start": start
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
    stylesheet = SCRIPTURE_STYLESHEET;

    if (options && options.spheres && options.spheres.length > 0) {
      const base = SCRIPTURE_STYLESHEET['fetchinfo']['base']['object_types'];
      base['Token'] = highlightSpheres(options.spheres);
      base['NonWordToken'] = highlightSpheres(options.spheres);
    }
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
      resolve(result);
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
  openDatabase,
  query,
  scripture,
  words,
  wordCountsForContext,
};
