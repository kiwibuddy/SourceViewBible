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
    chartType: 'string',
    xAxis: {type: 'string', optional: true},
    yAxis: {type: 'string', optional: true},
    zAxis: {type: 'string', optional: true},
    filterData: {type: 'string', optional: true},
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
    let discovery = Discovery.findByID(card.id);
    realm.write(() => {
      if (!discovery) {
        discovery = new Discovery();
        discovery.id = card.id;
        discovery.createdAt = Date.now();
      }

      discovery.name = card.name;
      discovery.xAxis = card.xAxis;
      discovery.yAxis = card.yAxis;
      discovery.zAxis = card.zAxis;
      discovery.filters = card.filters;
      discovery.updatedAt = Date.now();
      realm.create('Discovery', discovery, true);
    });
  }

  set filters(filters: Array<Object>) {
    this.filterData = JSON.stringify(filters);
  }

  get filters(): Array<Object> {
    return JSON.parse(this.filterData);
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
