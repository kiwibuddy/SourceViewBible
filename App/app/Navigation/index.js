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
import Reader from '../Scenes/Reader/Reader';
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

router.addRoute('/Books', (params) => {
  return <Books
    onPressBook={() => {}}
  />;
});

const {route, params} = router.match('/Books');

module.exports = router;
