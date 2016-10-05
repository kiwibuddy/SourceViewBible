/* @flow */
'use strict';

import {
  Discovery,
  History,
  Preference,
} from './Realm';

const PREFIX = 'com.sourceviewbible.preferences.';
const Keys = {
  Launch: {
    Onboarded: PREFIX + 'launch.onboarded',
  },
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
  Sources: {
    filters: PREFIX + '.sources.filters',
  },
  Spheres: {
    FoundationalSort: PREFIX + '.spheres.foundational.sort',
    Prompted: PREFIX + '.spheres.prompted',
  },
};
Preference.Keys = Keys;

module.exports = {
  Discovery,
  History,
  Preference,
};
