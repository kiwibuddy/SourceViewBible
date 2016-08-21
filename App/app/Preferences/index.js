/* @flow */
'use strict';

import {
  Discovery,
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
  Reader: {
    fontStepSize: PREFIX + '.reader.fontStepSize',
    spheres: PREFIX + '.reader.spheres',
    showNumbers: PREFIX + '.reader.showNumbers',
  },
  Spheres: {
    FoundationalSort: PREFIX + '.spheres.foundational.sort',
    SourcesSort: PREFIX + '.spheres.sources.sort',
  },
};
Preference.Keys = Keys;

module.exports = {
  Discovery,
  History,
  Preference,
};
