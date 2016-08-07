/* @flow */
'use strict';

import Realm from 'realm';

const NatureSchema = {
  name: 'Nature',
  primaryKey: 'id',
  properties: {
    id: 'int',
    key: 'string',
  }
};

export default class Nature extends Realm.Object {

}
Nature.schema = NatureSchema;
