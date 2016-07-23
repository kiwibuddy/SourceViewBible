/* @flow */
'use strict';

import {
  History,
  Preference,
} from './Realm';

const PREFIX = 'com.sourceviewbible.preferences.';
const Keys = {
  Books: {
    Sort: PREFIX + 'books.sort',
    Chapters: PREFIX + 'books.chapters',
  },
  Bookmarks: {
    TabIndex: PREFIX + 'bookmarks.tabIndex'
  },
};
Preference.Keys = Keys;

module.exports = {
  History,
  Preference,
};
