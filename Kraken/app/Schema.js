/* @flow */
'use strict';

const Book = {
  name: 'Book',
  primaryKey: 'id',
  properties: {
    id: 'string',
    DJHRef: 'string',
    name: 'string',
    testament: 'int',
    textOrder: 'int',
    chapterCount: {type: 'int', default: 0},
    chapters: {type: 'list', objectType: 'Chapter'},
    sourceCount: {type: 'int', default: 0},
    sources: {type: 'list', objectType: 'Source'},
    sourceTypeCounts: {type: 'list', objectType: 'Count'},
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
    overview: {type: 'list', objectType: 'Content'},
  }
};

const Chapter = {
  name: 'Chapter',
  primaryKey: 'id',
  properties: {
    id: 'string',
    chapterNumber: 'int',
    firstMonad: {type: 'int', default: 0},
    lastMonad: {type: 'int', default: 0},
    principalSourceType: 'string',
    sourceCount: {type: 'int', default: 0},
    sourceTypes: {type: 'list', objectType: 'Count'},
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

const Source = {
  name: 'Source',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    firstInitial: {type: 'string', optional: true},
    occurrences: {type: 'list', objectType: 'Occurrence'},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

const Sphere = {
  name: 'Sphere',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    bookCount: {type: 'int', default: 0},
    bookCounts: {type: 'list', objectType: 'Count'},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

const Count = {
  name: 'Count',
  properties: {
    countableID: {type: 'int', indexed: true},
    countableType: {type: 'string', indexed: true},
    string: 'string',
    count: {type: 'int', default: 0},
  }
};

const Content = {
  name: 'Content',
  properties: {
    title: 'string',
    body: 'string',
  }
};

const Occurrence = {
  name: 'Occurrence',
  properties: {
    book: 'Book',
    chapter: 'Chapter',
  }
};

const Schema = [Book, Chapter, Source, Sphere, Count, Content, Occurrence];
export default Schema;
