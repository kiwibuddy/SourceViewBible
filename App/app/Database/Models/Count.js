/* @flow */
'use strict';

import Realm from 'realm';

const CountSchema = {
  name: 'Count',
  properties: {
    string: 'string',
    count: {type: 'int', default: 0},
  }
};

export default class Count extends Realm.Object {

}
Count.schema = CountSchema;
