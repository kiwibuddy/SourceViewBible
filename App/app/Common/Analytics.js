/* @flow */
'use strict';

import Fabric from 'react-native-fabric';
const { Answers } = Fabric;

function contentTypeForRoute(route: any) {
  const types = {
    '/DiscoveryCenter': 'Discovery Center',
    '/Reader/Search': 'Reader Search',
    '/Discover': 'Discover',
    '/Books': 'Books',
    '/Sources': 'Sources',
    '/Spheres': 'Spheres',
    '/Reader': 'Reader',
    '/About': 'About',
  };

  const path = Object.keys(types).find(path => route.path.startsWith(path));
  if (path) return types[path];
  return 'Other';
}

export default class Analytics {
  static logRoute(route: any, options: ?Object) {
    const contentType = contentTypeForRoute(route);
    Answers.logContentView(route.title, contentType, route.path, options);
  }

  static logSearch(query: any, options: ?Object) {
    Answers.logSearch(query, options);
  }
}
