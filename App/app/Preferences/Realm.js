/* @flow */
'use strict';

import { Platform } from 'react-native';
import Realm from 'realm';

import moment from 'moment';

const DiscoverySchema = {
  name: 'Discovery',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: {type: 'string', optional: true},
    cardData: {type: 'string', optional: true},
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

    realm.write(() => {
      discovery.name = card.name;
      // discovery.cardData = JSON.stringify(card.xAxis);
      discovery.updatedAt = date;

      try {
        realm.create('Discovery', discovery, true);
      } catch(error) {
        console.log('discovery', discovery);
        throw error;
      }
    });
  }

  get card(): any {
    return JSON.parse(this.cardData);
  }
}
Discovery.schema = DiscoverySchema;

const PreferenceSchema = {
  name: 'Preference',
  primaryKey: 'key',
  properties: {
    key: 'string',
    number: 'double'
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

const Schema = [Discovery, Preference, History];

const realm = new Realm({
  schema: Schema
});

console.log('Preferences Path: ' + realm.path);
