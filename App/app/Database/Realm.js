/* @flow */
'use strict';

import { Platform } from 'react-native';
import Realm from 'realm';
const RNFS = require('react-native-fs');

const BibleSchema = {
  name: 'Bible',
  properties: {
    wordCount: 'int',
  }
};

export class Bible extends Realm.Object {
  static get wordCount() {
    const bible = realm.objects('Bible')[0];
    return bible.wordCount;
  }
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

export class Book extends Realm.Object {
  static all() {
    return realm.objects('Book');
  }

  static findByID(id: string) {
    return realm.objectForPrimaryKey('Book', id || '');
  }

  static get wordCount() {
    return realm.objects('Book').reduce((sum, book) => sum += book.wordCount, 0);
  }

  countOfSourceType(sourceType: string): number {
    const count = this.sourceTypeCounts.find(count => count.string === sourceType);
    return count && count.count || 0;
  }

  countOfSphereType(sphereType: string): number {
    const count = this.sphereCounts.find(count => count.string === sphereType);
    return count && count.count || 0;
  }

  get sources(): Realm.List {
    return this.sourceRelations.map(relation => relation.source);
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
  get monadSet(): Object {
    return {
      first: this.firstMonad,
      last: this.lastMonad
    };
  }
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
  static all() {
    return realm.objects('Source');
  }

  static findByID(id: string) {
    return realm.objectForPrimaryKey('Source', id || '');
  }
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
    position: 'int',
    bookCount: {type: 'int', default: 0},
    bookCounts: {type: 'list', objectType: 'Count'},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

export class Sphere extends Realm.Object {
  static all() {
    return realm.objects('Sphere').sorted('position');
  }

  static findByID(id: string) {
    return realm.objectForPrimaryKey('Sphere', id || '');
  }

  countOfBook(bookID: string): number {
    const count = this.bookCounts.find(count => count.string === bookID);
    return count && count.count || 0;
  }
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

const SourceViewSchema = [Bible, Book, Chapter, Source, SourceRelation, Sphere, Count, Content, Occurrence];

const realm = new Realm({
  schema: SourceViewSchema,
  readOnly: true,
  ...Platform.select({
    ios: {
      path: RNFS.MainBundlePath + '/Datasets/en/NLT/SourceView.realm',
    },
    android: {
      path: RNFS.DocumentDirectoryPath + '/Datasets/en/NLT/SourceView.realm',
    }
  })
});
