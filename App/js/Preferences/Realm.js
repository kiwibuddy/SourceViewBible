/* @flow */
'use strict';

import { Platform } from 'react-native';
import Realm from 'realm';
import Emdros from '../API/Emdros';
import moment from 'moment';
import { Book } from '../Database';

export function ReferenceDescription(book: Object, references: Array<Object>): string {
  let description = '';

  const reference = references[0];
  const referenceCount = references.length;
  if (referenceCount == 1) {
    description = `${reference.chapter}:${reference.verse}`;
  } else {
    const lastReference = references[referenceCount - 1];
    description = `${reference.chapter}:${reference.verse}-${lastReference.verse}`;
  }

  return `${book.name} ${description}`;
}

const BookmarkSchema = {
  name: 'Bookmark',
  primaryKey: 'id',
  properties: {
    id: 'string',
    createdAt: {type: 'date', indexed: true},
    note: {type: 'string', optional: true},
    type: 'string',
    highlight: 'bool',
    references: {type: 'list', objectType: 'BookmarkReference'}
  }
};

export class Bookmark extends Realm.Object {
  static Type = {
    Bookmark: 'bookmark',
    Highlight: 'highlight'
  };

  static all(options?: Object) {
    let bookmarks = realm.objects('Bookmark');
    if (options && options.type && options.type !== 'all') {
      bookmarks = bookmarks.filtered('type = $0', options.type);
    }
    return bookmarks.sorted('createdAt', true);
  }

  static findByID(id: string): Discovery {
    return realm.objectForPrimaryKey('Bookmark', id || '');
  }

  static whereReferences(references: Array<Object>, options?: Object) {
    const bookmarks = [];
    references.forEach(reference => {
      let objects = realm.objects('Bookmark').filtered('references.bookID = $0 AND references.chapter = $1 AND references.verse = $2', reference.bookID, reference.chapter, reference.verse);
      if (options && options.type) {
        objects = objects.filtered('type = $0', options.type);
      }

      objects.forEach(bookmark => bookmarks.push(bookmark));
    });
    return bookmarks;
  }

  static bookHighlights(bookID: string) {
    return realm.objects('Bookmark').filtered('references.bookID = $0 AND highlight = $1', bookID, true);
  }

  static highlights() {
    return realm.objects('Bookmark').filtered('highlight = $0', true).sorted('createdAt', true);
  }

  static highlight(references: Array<Object>) {
    realm.write(() => {
      const id = 'highlight-' + Date.now();
      const createdAt = new Date();
      const type = Bookmark.Type.Highlight
      const highlight = true;

      realm.create('Bookmark', {id, createdAt, type, references, highlight});
    });
  }

  static bookmark({id, references, createdAt, highlight, note}) {
    realm.write(() => {
      if (id) {
        realm.create('Bookmark', {
          id,
          highlight,
          note
        }, true);
      } else {
        realm.create('Bookmark', {
          id: 'bookmark' + Date.now(),
          createdAt: new Date(),
          type: Bookmark.Type.Bookmark,
          references,
          highlight,
          note
        });
      }
    });
  }

  delete() {
    const bookmark = this;
    realm.write(() => {
      realm.delete(bookmark);
    });
  }

  get hasNote(): boolean {
    return this.note && this.note.length > 0;
  }

  get book(): Object {
    return Book.findByID(this.references[0].bookID);
  }

  get url(): Object {
    const reference = this.references[0];
    return ({
      bookID: reference.bookID,
      anchor: `verse-${reference.chapter}-${reference.verse}`,
      title: this.book.name
    });
  }

  get description(): string {
    return ReferenceDescription(this.book, this.references);
  }
}
Bookmark.schema = BookmarkSchema;

const BookmarkReferenceSchema = {
  name: 'BookmarkReference',
  properties: {
    bookID: 'string',
    chapter: 'int',
    verse: 'int',
    firstMonad: 'int',
    lastMonad: 'int',
  }
};

export class BookmarkReference extends Realm.Object {

}
BookmarkReference.schema = BookmarkReferenceSchema;

const DiscoverySchema = {
  name: 'Discovery',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: {type: 'string', optional: true},
    cardData: 'string',
    createdAt: {type: 'date', indexed: true},
    updatedAt: 'date',
  }
};

export class Discovery extends Realm.Object {
  occurrenceCount: number;

  static all() {
    return realm.objects('Discovery').sorted('createdAt');
  }

  static findByID(id: string): Discovery {
    return realm.objectForPrimaryKey('Discovery', id || '');
  }

  static record(card: Object) {
    const date = new Date();
    let discovery = Discovery.findByID(card.id);
    if (!discovery) {
      discovery = {
        id: card.id,
        name: null,
        cardData: '',
        createdAt: date,
        updatedAt: date
      };
    }

    const cardData = {
      chartType: card.chartType,
      xAxis: card.xAxis,
      yAxis: card.yAxis,
      zAxis: card.zAxis,
      filters: card.filters,
      occurrenceCount: card.occurrenceCount
    };

    realm.write(() => {
      discovery.name = card.name;
      discovery.cardData = JSON.stringify(cardData);
      discovery.updatedAt = date;

      try {
        realm.create('Discovery', discovery, true);
      } catch(error) {
        console.log('discovery', discovery);
        throw error;
      }
    });
  }

  static delete(card: Object) {
    const discovery = Discovery.findByID(card.id);
    if (discovery) {
      realm.write(() => {
        realm.delete(discovery);
      });
    }
  }

  get card(): any {
    const cardData = JSON.parse(this.cardData);
    const card = {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      ...cardData,
    };
    return card;
  }
}
Discovery.schema = DiscoverySchema;

const PreferenceSchema = {
  name: 'Preference',
  primaryKey: 'key',
  properties: {
    key: 'string',
    number: {type: 'double', optional: true},
    string: {type: 'string', optional: true},
  }
};

export class Preference extends Realm.Object {
  static setNumberForKey(number: number, key: string) {
    realm.write(() => {
      realm.create('Preference', {key, number}, true);
    })
  }

  static numberForKey(key: string): ?number {
    const preference = realm.objectForPrimaryKey('Preference', key);
    return preference ? preference.number : null;
  }

  static setStringForKey(string: string, key: string) {
    realm.write(() => {
      realm.create('Preference', {key, string}, true);
    });
  }

  static stringForKey(key: string): ?string {
    const preference = realm.objectForPrimaryKey('Preference', key);
    return preference ? preference.string : null;
  }

  static setObjectForKey(object: any, key: string) {
    const string = JSON.stringify(object);
    Preference.setStringForKey(string, key);
  }

  static objectForKey(key: string): ?any {
    const preference = Preference.stringForKey(key);
    return preference ? JSON.parse(preference) : null;
  }

  static setBooleanForKey(bool: boolean, key: string) {
    Preference.setNumberForKey(bool ? 1 : 0, key);
  }

  static booleanForKey(key: string): ?boolean {
    const preference = Preference.numberForKey(key);
    return preference != null ? (preference != 0) : null;
  }
}
Preference.schema = PreferenceSchema;

const HistorySchema = {
  name: 'History',
  primaryKey: 'id',
  properties: {
    id: 'string',
    date: {type: 'date', indexed: true},
    title: 'string',
    description: {type: 'string', optional: true},
    path: {type: 'string', indexed: true},
  }
}

export class History extends Realm.Object {
  static all() {
    return realm.objects('History').sorted('date', true);
  }

  static findByPath(path: string) {
    return this.all().filtered('path = $0', path)[0];
  }

  static last() {
    return this.all()[0];
  }

  static record(route: Object, options?: Object) {
    if (route.modal) return;

    let id = null;
    let path = route.path;
    if (options && options.replace) {
      const last = this.last();
      if (last) {
        path = last.path;
      }
    }

    const existingHistory = this.findByPath(path);
    if (existingHistory) {
      const today = moment();
      if (today.diff(existingHistory.date, 'days') == 0) {
        id = existingHistory.id;
      }
    }

    const date = new Date();
    const history = {
      id: id || 'history-' + Date.now(),
      date,
      title: route.title,
      description: route.description,
      path: route.path
    }

    realm.write(() => {
      realm.create('History', history, true);
    });
  }

  get route(): Object {
    return {path: this.path, title: this.title, description: this.description};
  }
}
History.schema = HistorySchema;

const Schema = [Bookmark, BookmarkReference, Discovery, Preference, History];

const options = {
  schema: Schema,
  schemaVersion: 3,
  migration: function(oldRealm, newRealm) {
  }
};

if (__DEV__) {
} else {
  // $FlowFixMe - Silence warning
  options['encryptionKey'] = Emdros.preferencesKey;
}

const realm = new Realm(options);

if (__DEV__) {
  console.log('Preferences', realm.path);
}
