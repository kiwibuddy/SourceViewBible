/* @flow */
'use strict';

import Emdros from 'react-native-emdros';
let DB = null;

const SCRIPTURE_STYLESHEET = require('./scripture-stylesheet.json');
const OCCURRENCE_STYLESHEET = require('./occurrence-stylesheet.json');

// "Token" : {
//    "docindexfeature" : "docindex",
//    "end" : "",
//    "get" : [
//          "surface",
//          "sphere_color_number",
//          "Family",
//          "Economics",
//          "Government",
//          "Religion",
//          "Education",
//          "MediaCom",
//          "Celebration",
//          "black_override"
//       ],
//    "start" : "{{ if varequal 'EndParagraph' 'true' }}</p>{{ setvar 'EndParagraph' }}{{ setvarend }}{{ setvar 'css' }}{{ setvarend }}{{ endif }}{{ if varequal 'StartParagraph' 'true' }}<p class="{{ emitvar 'ParagraphType' }}">{{ setvar 'StartParagraph' }}{{ setvarend }}{{ if varequal 'TextKind' 'Prose' }}{{ setvar 'ParagraphType' }}FlushLeft{{ setvarend }}{{ endif }}{{ endif }}{{ setvar 'new_css' }}{{ if featureequal 1 '0' }}{{ else }}{{ if featureequal 2 'true' }}Fam{{ endif }}{{ if featureequal 3 'true' }}Eco{{ endif }}{{ if featureequal 4 'true' }}Gov{{ endif }}{{ if featureequal 5 'true' }}Rel{{ endif }}{{ if featureequal 6 'true' }}Edu{{ endif }}{{ if featureequal 7 'true' }}Com{{ endif }}{{ if featureequal 8 'true' }}Cel{{ endif }}{{ endif }}{{ setvarend }}{{ if varequal 'new_css' '' }}<span>{{ else }}<span class="spv-{{ emitvar 'new_css' }}">{{ endif }}{{ setvar 'css' }}{{ emitvar 'new_css' }}{{ setvarend }}{{ if varequal 'Italics' 'On' }}<i>{{ endif }}{{ if varequal 'Bold' 'On' }}<b>{{ endif }}{{ if varequal 'SmallCaps' 'On' }}<span class="small-caps">{{ endif }}{{ if featureequal 9 'true' }}<span class="src-clr-Black">{{ endif }}<span class="dmy{{ emitvar 'embedded_document' }}{{ emitvar 'embedded_quotation' }}">{{ feature 0 }}</span>{{ if featureequal 9 'true' }}</span>{{ endif }}{{ if varequal 'SmallCaps' 'On' }}</span>{{ endif }}{{ if varequal 'Bold' 'On' }}</b>{{ endif }}{{ if varequal 'Italics' 'On' }}</i>{{ endif }}</span>"
// },

function highlightSpheres(spheres: any) {
  // {{ setvar 'new_css' }}{{ if featureequal 1 '0' }}{{ else }}{{ if featureequal 2 'true' }}Fam{{ endif }}{{ if featureequal 3 'true' }}Eco{{ endif }}{{ if featureequal 4 'true' }}Gov{{ endif }}{{ if featureequal 5 'true' }}Rel{{ endif }}{{ if featureequal 6 'true' }}Edu{{ endif }}{{ if featureequal 7 'true' }}Com{{ endif }}{{ if featureequal 8 'true' }}Cel{{ endif }}{{ endif }}{{ setvarend }}{{ if varequal 'new_css' '' }}<span>{{ else }}<span class="spv-{{ emitvar 'new_css' }}">{{ endif }}
  const start = `{{ if varequal 'StartParagraph' 'true' }}<p class="{{ emitvar 'ParagraphType' }}">{{ setvar 'StartParagraph' }}{{ setvarend }}{{ if varequal 'TextKind' 'Prose' }}{{ setvar 'ParagraphType' }}{{ setvarend }}{{ endif }}{{ endif }}{{ feature 0 }}`;

  return {
    "docindexfeature": "docindex",
    "end": "",
    "get": ["surface"].concat(spheres),
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

    if (options && options.spheres) {
      const base = SCRIPTURE_STYLESHEET['fetchinfo']['base']['object_types'];
      base['Token'] = highlightSpheres(['Family', 'Education']);
      console.log('token', SCRIPTURE_STYLESHEET['fetchinfo']['base']['object_types']['Token']);
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
