/* @flow */
'use strict';

const Book = {
  name: 'Book',
  properties: {
    name: 'string',
    DJHRef: 'string',
    chapters: {type: 'list', objectType: 'Chapter'},
    sources: {type: 'list', objectType: 'Source'},
    spheres: {type: 'list', objectType: 'Count'},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

const Chapter = {
  name: 'Chapter',
  properties: {
    chapter: 'int',
    DJHRef: 'string',
    sources: {type: 'list', objectType: 'Source'},
    spheres: {type: 'list', objectType: 'Sphere'},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'WordCount'},
  }
};

const Source = {
  name: 'Source',
  properties: {
    name: 'string'
  }
};

const Sphere = {
  name: 'Sphere',
  properties: {
    name: 'string'
  }
};

const Count = {
  name: 'Count',
  properties: {
    type: 'string',
    count: {type: 'int', default: 0},
  }
}

const Schema = [Book, Chapter, Source, Sphere, Count];
export default Schema;
