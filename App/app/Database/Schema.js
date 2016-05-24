/* @flow */
'use strict';

const Book = {
  name: 'Book',
  properties: {
    name: 'string',
    DJHRef: 'string',
    testament: 'int',
    chapterCount: {type: 'int', default: 0},
    chapters: {type: 'list', objectType: 'Chapter'},
    sourceCount: {type: 'int', default: 0},
    sources: {type: 'list', objectType: 'Source'},
    sourceTypesCounts: {type: 'list', objectType: 'Count'},
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
    principalSphere: 'string',
    wordCount: {type: 'int', default: 0},
    wordCounts: {type: 'list', objectType: 'Count'},
  }
};

const Chapter = {
  name: 'Chapter',
  properties: {
    chapter: 'int',
    DJHRef: 'string',
    sourceCount: {type: 'int', default: 0},
    sources: {type: 'list', objectType: 'Source'},
    sourceTypesCounts: {type: 'list', objectType: 'Count'},
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
    wordCount: {type: 'int', default: 0},
    wordCounts: {type: 'list', objectType: 'Count'},
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

module.exports = {
  Schema: [Book, Chapter, Source, Count]
}
