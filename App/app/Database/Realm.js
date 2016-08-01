/* @flow */
'use strict';

import { Platform } from 'react-native';
import Realm from 'realm';
import Emdros from 'react-native-emdros';
const RNFS = require('react-native-fs');

function bookNameInText(text: string) {
  const regex = /([1-3]?\s?[A-Z]*)/gi;
  const match = text.match(regex);
  if (match && match.length > 0) {
    return match[0].trim();
  }
  return null;
}

function BCVReferencesInText(text: string) {
  const matches = [];

  const regex = /([1-3]?\s?[A-Z]*)\s?([0-9]{1,3})?(?:\\:([0-9]{1,3}))?/gi;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    matches.push(m);
  }
  if (matches.length < 1) return null;

  const match = matches[0];
  const bookName = match[1].trim();
  const books = Book.all().filtered('name CONTAINS[c] $0', bookName).sorted('textOrder');
  if (books.length > 0) {
    const references = [];

    if (match.length > 2 && match[2] !== undefined) {
      const chapterNumber = parseInt(match[2]);
      books.forEach(book => {
        if (!isNaN(chapterNumber) && chapterNumber <= book.chapterCount) {
          const chapter = book.chapters[chapterNumber - 1];

          if (matches.length > 1 && matches[2] !== undefined && matches[2][0] !== undefined) {
            const verseNumber = parseInt(matches[2][0]);
            if (!isNaN(verseNumber)) {
              references.push({book, chapterNumber, verseNumber});
            } else {
              references.push({book, chapterNumber});
            }
          } else {
            references.push({book, chapterNumber});
          }
        }
      });
    }

    return references;
  }

  return null;
}

function BSOReferencesInText(text: string) {
  const matches = [];

  const regex = /([1-3]?\s?[A-Z]*)\s?([A-Z\D]*)\s?([0-9]{1,3})?/gi;

  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    matches.push(m);
  }
  if (matches.length < 1) return null;

  const match = matches[0];
  const bookName = match[1].trim();
  const book = Book.all().filtered('name BEGINSWITH[c] $0', bookName).sorted('textOrder')[0];
  if (book) {
    if (match.length > 2 && match[2] !== undefined) {
      const sourceName = match[2].trim();
      if (sourceName.length > 0) {
        const sourceRelations = book.sourceRelations.filtered('source.name BEGINSWITH[c] $0', sourceName);
        if (sourceRelations.length > 0) {
          const sources = sourceRelations.map(relation => relation.source).sort((a,b) => a.name > b.name ? 1 : -1);
          const references = [];
          sources.forEach(source => {
            if (match[3] !== undefined) {
              const occurrenceNumber = parseInt(match[3]);
              if (!isNaN(occurrenceNumber)) {
                const occurrence = source.occurrences.filtered('book.id = $0', book.id)[0];
                if (occurrenceNumber > 0 && occurrenceNumber <= occurrence.count) {
                  references.push({book, source, occurrence, occurrenceNumber});
                }
              }
            } else {
              references.push({book, source});
            }
          });

          return references;
        }
      }
    }
  }

  return null;
}

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

  // {"bcv": [], "bso": [], "books": []}
  static searchReferences(text: string): Object {
    const references = {};
    if (!text) return references;

    const bookName = bookNameInText(text);
    if (!bookName) return references;

    const bcvReferences = BCVReferencesInText(text);
    if (bcvReferences && bcvReferences.length > 0) {
      references["bcv"] = bcvReferences;
    }

    const bsoReferences = BSOReferencesInText(text);
    if (bsoReferences && bsoReferences.length > 0) {
      references["bso"] = bsoReferences;
    }

    const books = Book.all().filtered('name CONTAINS[c] $0', bookName).sorted('textOrder').map(book => ({book}));
    if (books.length > 0) {
      references["books"] = books;
    }

    return references;
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

  countOfSourceType(sourceType: string): number {
    const count = this.sourceTypeCounts.find(count => count.string === sourceType);
    return count && count.count || 0;
  }

  countOfSphereType(sphereType: string): number {
    const count = this.sphereCounts.find(count => count.string === sphereType);
    return count && count.count || 0;
  }

  get monadSet(): Object {
    const firstChapter = this.chapters[0];
    const lastChapter = this.chapters[this.chapterCount - 1];
    return {
      first: firstChapter.firstMonad,
      last: lastChapter.lastMonad
    };
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
    name: {type: 'string', indexed: true},
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
    count: 'int',
  }
};

export class Occurrence extends Realm.Object {

}
Occurrence.schema = OccurrenceSchema;

const Schema = [Bible, Book, Chapter, Source, SourceRelation, Sphere, Count, Content, Occurrence];

const realm = new Realm({
  schema: Schema,
  readOnly: true,
  encryptionKey: Emdros.key,
  ...Platform.select({
    ios: {
      path: RNFS.MainBundlePath + '/Datasets/en/NLT/SourceView.realm',
    },
    android: {
      path: RNFS.DocumentDirectoryPath + '/Datasets/en/NLT/SourceView.realm',
    }
  })
});
