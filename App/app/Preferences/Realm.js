/* @flow */
'use strict';

import { Platform } from 'react-native';
import Realm from 'realm';

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
    date: 'date',
    title: 'string',
    path: 'string'
  }
}

export class History extends Realm.Object {
  static all() {
    return realm.objects('History').sorted('date', true);
  }

  static record(route: Object) {
    if (route.modal) return;

    const id = 'history-' + Date.now();
    const date = new Date();
    const history = {
      id,
      date,
      title: route.title,
      path: route.path
    }

    realm.write(() => {
      realm.create('History', history, true);
    });
  }
}
History.schema = HistorySchema;

const Schema = [Preference, History];

const realm = new Realm({
  schema: Schema
});
