/* @flow */
'use strict';

import Realm from 'realm';

const ChronologySchema = {
  name: 'Chronology',
  primaryKey: 'id',
  properties: {
    id: 'int',
    key: 'string',
  }
};

export default class Chronology extends Realm.Object {

}
Chronology.schema = ChronologySchema;
