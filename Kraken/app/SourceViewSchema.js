/* @flow */
'use strict';

import Realm from 'realm';

const BibleSchema = {
  name: 'Bible',
  properties: {
    wordCount: 'int',
  }
};

class Bible extends Realm.Object {

}
Bible.schema = BibleSchema;

const BookSchema = {
  name: 'Book',
  primaryKey: 'id',
  properties: {
    id: 'string',
    DJHRef: 'string',
    name: {type: 'string', indexed: true},
    testament: 'int',
    textOrder: {type: 'int', indexed: true},
    chapterCount: {type: 'int', default: 0},
    chapters: {type: 'list', objectType: 'Chapter'},
    maxChapterWordCount: {type: 'int', default: 0},
    maxSourceWordCount: {type: 'int', default: 0},
    maxChapterSphereWordCount: {type: 'int', default: 0},
    sourceCount: {type: 'int', default: 0},
    sourceRelations: {type: 'list', objectType: 'SourceRelation'},
    sourceTypeCount: {type: 'int', default: 0},
    sourceTypeCounts: {type: 'list', objectType: 'Count'},
    principalSourceType: {type: 'string', default: 'narrator'},
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
    sphereWordCount: {type: 'int', default: 0},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
    overview: {type: 'list', objectType: 'Content'},
  }
};

class Book extends Realm.Object {

}
Book.schema = BookSchema;

const ChapterSchema = {
  name: 'Chapter',
  primaryKey: 'id',
  properties: {
    id: 'string',
    chapterNumber: 'int',
    firstMonad: {type: 'int', default: 0},
    lastMonad: {type: 'int', default: 0},
    sourceCount: {type: 'int', default: 0},
    sourceTypeCount: {type: 'int', default: 0},
    sourceTypeCounts: {type: 'list', objectType: 'Count'},
    principalSourceType: {type: 'string', default: 'narrator'},
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
    sphereWordCount: {type: 'int', default: 0},
    wordCount: {type: 'int', default: 0},
    verseCount: {type: 'int', default: 0},
  }
};

class Chapter extends Realm.Object {

}
Chapter.schema = ChapterSchema;

const SourceSchema = {
  name: 'Source',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: {type: 'string', indexed: true},
    firstInitial: {type: 'string', optional: true},
    occurrences: {type: 'list', objectType: 'Occurrence'},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

class Source extends Realm.Object {

}
Source.schema = SourceSchema;

const SourceRelationSchema = {
  name: 'SourceRelation',
  primaryKey: 'id',
  properties: {
    id: 'string',
    source: 'Source',
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

class SourceRelation extends Realm.Object {

}
SourceRelation.schema = SourceRelationSchema;

const SphereSchema = {
  name: 'Sphere',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    position: 'int',
    bookCount: {type: 'int', default: 0},
    bookCounts: {type: 'list', objectType: 'Count'},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

class Sphere extends Realm.Object {

}
Sphere.schema = SphereSchema;

const CountSchema = {
  name: 'Count',
  properties: {
    string: 'string',
    count: {type: 'int', default: 0},
  }
};

class Count extends Realm.Object {

}
Count.schema = CountSchema;

const ContentSchema = {
  name: 'Content',
  properties: {
    title: 'string',
    body: 'string',
  }
};

class Content extends Realm.Object {

}
Content.schema = ContentSchema;

const OccurrenceSchema = {
  name: 'Occurrence',
  properties: {
    book: 'Book',
    count: 'int',
  }
};

class Occurrence extends Realm.Object {

}
Occurrence.schema = OccurrenceSchema;

const Schema = [Bible, Book, Chapter, Source, SourceRelation, Sphere, Count, Content, Occurrence];
export default Schema;
