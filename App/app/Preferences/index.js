/* @flow */
'use strict';

import {
  Discovery,
  History,
  Preference,
} from './Realm';

const PREFIX = 'com.sourceviewbible.preferences.';
const Keys = {
  Discover: {
    RefreshDate: PREFIX + 'discover.refreshdate',
    Books: PREFIX + 'discover.books',
    Sources: PREFIX + 'discover.sources',
    Spheres: PREFIX + 'discover.spheres',
  },
  Books: {
    Sort: PREFIX + 'books.sort',
    Chapters: PREFIX + 'books.chapters',
  },
  Bookmarks: {
    SegmentIndex: PREFIX + 'bookmarks.segmentIndex'
  },
  Reader: {
    fontStepSize: PREFIX + '.reader.fontStepSize',
    spheres: PREFIX + '.reader.spheres',
    showNumbers: PREFIX + '.reader.showNumbers',
  },
  Spheres: {
    FoundationalSort: PREFIX + '.spheres.foundational.sort',
  },
};
Preference.Keys = Keys;

module.exports = {
  Discovery,
  History,
  Preference,
};
