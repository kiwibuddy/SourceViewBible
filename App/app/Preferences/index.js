/* @flow */
'use strict';

import {
  Preference,
} from './Realm';

const Keys = {
  Books: {
    Sort: 'com.sourceviewbible.preferences.books.sort',
    Chapters: 'com.sourceviewbible.preferences.books.chapters',
  }
};
Preference.Keys = Keys;

export default Preference;
