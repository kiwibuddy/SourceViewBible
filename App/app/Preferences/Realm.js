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
    path: 'string',
  }
}

export class History extends Realm.Object {
  static all() {
    return realm.objects('History').sorted('date', true);
  }
}
History.schema = HistorySchema;

const Schema = [Preference, History];

const realm = new Realm({
  schema: Schema
});
