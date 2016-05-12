/* @flow */

'use strict';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import promise from './promise';
import array from './array';
import reducers from '../Reducers';

const createSourceViewBibleStore = applyMiddleware(thunk, promise, array)(createStore);

function configureStore(onComplete: ?() => void) : Object {
  const store = createSourceViewBibleStore(reducers);
  if (onComplete != null) onComplete();
  return store;
}

module.exports = configureStore;
