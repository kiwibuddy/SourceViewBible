/* @flow */
'use strict';

import Realm from 'realm';
import SourceViewSchema from './SourceViewSchema';

const RNFS = require('react-native-fs');

const realm = new Realm({
  path: RNFS.MainBundlePath + '/Datasets/en/NLT/SourceView.realm',
  schema: SourceViewSchema,
  readOnly: true,
});

console.log('initialzing database');

module.exports = {
  Database: realm
};
