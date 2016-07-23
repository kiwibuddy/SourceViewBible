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
    SegmentIndex: PREFIX + 'bookmarks.segmentIndex'
  },
};
Preference.Keys = Keys;

module.exports = {
  History,
  Preference,
};
