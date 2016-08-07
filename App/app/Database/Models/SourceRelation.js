/* @flow */
'use strict';

import Realm from 'realm';

const SourceRelationSchema = {
  name: 'SourceRelation',
  primaryKey: 'id',
  properties: {
    id: 'string',
    source: 'Actant',
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

export default class SourceRelation extends Realm.Object {

}
SourceRelation.schema = SourceRelationSchema;
