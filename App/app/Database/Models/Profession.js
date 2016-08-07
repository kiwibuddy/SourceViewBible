/* @flow */
'use strict';

import Realm from 'realm';

const ProfessionSchema = {
  name: 'Profession',
  primaryKey: 'id',
  properties: {
    id: 'int',
    key: 'string',
  }
}

export default class Profession extends Realm.Object {

}
Profession.schema = ProfessionSchema;
