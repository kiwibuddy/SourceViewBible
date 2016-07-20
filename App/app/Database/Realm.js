/* @flow */
'use strict';

import Realm from 'realm';
const RNFS = require('react-native-fs');

const BookSchema = {
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

export class Book extends Realm.Object {
  static all() {
    return realm.objects('Book');
  }

  countOfSourceType(sourceType: string): number {
    const count = this.sourceTypeCounts.find(count => count.string === sourceType);
    return count && count.count || 0;
  }

  countOfSphereType(sphereType: string): number {
    const count = this.sphereCounts.find(count => count.string === sphereType);
    return count && count.count || 0;
  }
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
  }
};

export class Chapter extends Realm.Object {

}
Chapter.schema = ChapterSchema;

const SourceSchema = {
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

export class Source extends Realm.Object {

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

export class SourceRelation extends Realm.Object {

}
SourceRelation.schema = SourceRelationSchema;

const SphereSchema = {
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

export class Sphere extends Realm.Object {

}
Sphere.schema = SphereSchema;

const CountSchema = {
  name: 'Count',
  properties: {
    string: 'string',
    count: {type: 'int', default: 0},
  }
};

export class Count extends Realm.Object {

}
Count.schema = CountSchema;

const ContentSchema = {
  name: 'Content',
  properties: {
    title: 'string',
    body: 'string',
  }
};

export class Content extends Realm.Object {

}
Content.schema = ContentSchema;

const OccurrenceSchema = {
  name: 'Occurrence',
  properties: {
    book: 'Book',
    chapter: 'Chapter',
  }
};

export class Occurrence extends Realm.Object {

}
Occurrence.schema = OccurrenceSchema;

const SourceViewSchema = [Book, Chapter, Source, SourceRelation, Sphere, Count, Content, Occurrence];

const realm = new Realm({
  path: RNFS.MainBundlePath + '/Datasets/en/NLT/SourceView.realm',
  schema: SourceViewSchema,
  readOnly: true,
});

console.log('initialzing database');
