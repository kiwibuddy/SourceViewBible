/* @flow */
'use strict';

const Book = {
  name: 'Book',
  properties: {
    name: 'string',
    DJHRef: 'string',
    chapterCount: {type: 'int', default: 0},
    chapters: {type: 'list', objectType: 'Chapter'},
    sourceCount: {type: 'int', default: 0},
    sourceCounts: {type: 'list', objectType: 'Count'},
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
    words: {type: 'list', objectType: 'Count'},
  }
};

const Source = {
  name: 'Source',
  properties: {
    name: 'string'
  }
};

const Count = {
  name: 'Count',
  properties: {
    name: 'string',
    count: {type: 'int', default: 0},
  }
}

const Schema = [Book, Chapter, Source, Count];
export default Schema;
