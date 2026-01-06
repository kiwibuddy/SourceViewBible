/* @flow */
'use strict';

import { Bookmark, BookmarkReference, Discovery, History, Preference, ReferenceDescription } from './Realm';

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
    SegmentIndex: PREFIX + 'bookmarks.segmentIndex',
  },
  Reader: {
    fontStepSize: PREFIX + '.reader.fontStepSize',
    spheres: PREFIX + '.reader.spheres',
    showNumbers: PREFIX + '.reader.showNumbers',
    scroll: PREFIX + '.reader.scroll',
  },
  Sources: {
    filters: PREFIX + '.sources.filters',
  },
  Spheres: {
    FoundationalSort: PREFIX + '.spheres.foundational.sort',
    Purchased: PREFIX + '.spheres.purchased',
  },
};
Preference.Keys = Keys;

module.exports = {
  Bookmark,
  BookmarkReference,
  Discovery,
  History,
  Preference,
  ReferenceDescription,
};
