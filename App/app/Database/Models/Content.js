/* @flow */
'use strict';

import Realm from 'realm';

const ContentSchema = {
  name: 'Content',
  properties: {
    title: 'string',
    body: 'string',
  }
};

export default class Content extends Realm.Object {

}
Content.schema = ContentSchema;
