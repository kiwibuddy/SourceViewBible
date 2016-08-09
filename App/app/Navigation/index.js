/* @flow */
'use strict';

import React from 'react';
const router = require('./router');

import Bookmarks from '../Scenes/Bookmarks/Bookmarks';
import BookChapters from '../Scenes/Books/BookChapters';
import BookOverview from '../Scenes/Books/BookOverview';
import Books from '../Scenes/Books/Books';
import BookSources from '../Scenes/Books/BookSources';
import BookSpheres from '../Scenes/Books/BookSpheres';
import BookWords from '../Scenes/Books/BookWords';
import Discover from '../Scenes/Discover/Discover';
import DiscoveryCenter from '../Scenes/DiscoveryCenter/DiscoveryCenter';
import DiscoveryCenterOccurrences from '../Scenes/DiscoveryCenter/Occurrences';
import Reader from '../Scenes/Reader/Reader';
import ReaderSearch from '../Scenes/Reader/Search';
import Sources from '../Scenes/Sources/Sources';
import SourceOverview from '../Scenes/Sources/SourceOverview';
import SourceBooks from '../Scenes/Sources/SourceBooks';
import SourceConversations from '../Scenes/Sources/SourceConversations';
import SourceSpheres from '../Scenes/Sources/SourceSpheres';
import SourceWords from '../Scenes/Sources/SourceWords';
import Spheres from '../Scenes/Spheres/Spheres';
import SphereBooks from '../Scenes/Spheres/SphereBooks';
import SpherePassages from '../Scenes/Spheres/SpherePassages';
import SphereSources from '../Scenes/Spheres/SphereSources';
import SphereWords from '../Scenes/Spheres/SphereWords';

export const bookmarksURL = router.addRoute('/Bookmarks', Bookmarks);
export const booksURL = router.addRoute('/Books', Books);
export const bookChaptersURL = router.addRoute('/Books/:bookID/Chapters', BookChapters);
export const bookURL = router.addRoute('/Books/:bookID', BookOverview);
export const bookSourcesURL = router.addRoute('/Books/:bookID/Sources', BookSources);
export const bookSpheresURL = router.addRoute('/Books/:bookID/Spheres', BookSpheres);
export const bookWordsURL = router.addRoute('/Books/:bookID/Words', BookWords);
export const discoverURL = router.addRoute('/Discover', Discover);
export const discoveryCenterURL = router.addRoute('/DiscoveryCenter', DiscoveryCenter);
export const discoveryCenterOccurrencesURL = router.addRoute('/DiscoveryCenter/Occurrences', DiscoveryCenterOccurrences);
export const readerSearchURL = router.addRoute('/Reader/Search/:search?', ReaderSearch);
export const readerURL = router.addRoute('/Reader/:bookID/:anchor?', Reader);
export const sourcesURL = router.addRoute('/Sources', Sources);
export const sourceURL = router.addRoute('/Sources/:sourceID', SourceOverview);
export const sourceBooksURL = router.addRoute('/Sources/:sourceID/Books', SourceBooks);
export const sourceConversationsURL = router.addRoute('/Sources/:sourceID/Conversations', SourceConversations);
export const sourceSpheresURL = router.addRoute('/Sources/:sourceID/Spheres', SourceSpheres);
export const sourceWordsURL = router.addRoute('/Sources/:sourceID/Words', SourceWords);
export const spheresURL = router.addRoute('/Spheres', Spheres);
export const sphereURL = router.addRoute('/Spheres/:sphereID', Spheres);
export const sphereBooksURL = router.addRoute('/Spheres/:sphereID/Books', SphereBooks);
export const spherePassagesURL = router.addRoute('/Spheres/:sphereID/Passages', SpherePassages);
export const sphereSourcesURL = router.addRoute('/Spheres/:sphereID/Sources', SphereSources);
export const sphereWordsURL = router.addRoute('/Spheres/:sphereID/Words', SphereWords);

export const BACK = 'BACK';

// Discovery center
import BookFilters from '../Scenes/DiscoveryCenter/Filters/BookFilters';
import BooksFilter from '../Scenes/DiscoveryCenter/Filters/BooksFilter';
import ChronologyFilter from '../Scenes/DiscoveryCenter/Filters/ChronologyFilter';
import ChronologyFilters from '../Scenes/DiscoveryCenter/Filters/ChronologyFilters';
import SpheresFilter from '../Scenes/DiscoveryCenter/Filters/SpheresFilter';
import WordFilter from '../Scenes/DiscoveryCenter/Filters/WordFilter'
export const bookFiltersURL = router.addRoute('/DiscoveryCenter/Filters/BookFilters', BookFilters);
export const booksFilterURL = router.addRoute('/DiscoveryCenter/Filters/BooksFilter', BooksFilter);
export const chronologyFiltersURL = router.addRoute('/DiscoveryCenter/Filters/ChronologyFilters', ChronologyFilters);
export const chronologyFilterURL = router.addRoute('/DiscoveryCenter/Filters/ChronologyFilter', ChronologyFilter);
export const spheresFilterURL = router.addRoute('/DiscoveryCenter/Filters/SpheresFilter', SpheresFilter);
export const wordFilterURL = router.addRoute('/DiscoveryCenter/Filters/WordFilter', WordFilter);

export default router;
