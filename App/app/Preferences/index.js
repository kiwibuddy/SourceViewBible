/* @flow */
'use strict';

import {
  History,
  Preference,
} from './Realm';

const Keys = {
  Books: {
    Sort: 'com.sourceviewbible.preferences.books.sort',
    Chapters: 'com.sourceviewbible.preferences.books.chapters',
  }
};
Preference.Keys = Keys;

module.exports = {
  History,
  Preference,
};
