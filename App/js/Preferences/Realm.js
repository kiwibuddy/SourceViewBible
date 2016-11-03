/* @flow */
'use strict';

import { Platform } from 'react-native';
import Realm from 'realm';
import Emdros from '../API/Emdros';
import moment from 'moment';

const BookmarkSchema = {
  name: 'Bookmark',
  primaryKey: 'id',
  properties: {
    id: 'string',
    createdAt: {type: 'date', indexed: true},
    note: 'string',
    type: 'string',
    references: {type: 'list', objectType: 'BookmarkReference'}
  }
};

export class Bookmark extends Realm.Object {

}
Bookmark.schema = BookmarkSchema;

const BookmarkReferenceSchema = {
  name: 'BookmarkReference',
  properties: {
    bookID: 'string',
    chapter: 'int',
    verse: 'int'
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
