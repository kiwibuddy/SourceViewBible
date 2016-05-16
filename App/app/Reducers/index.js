/* @flow */
'use strict';

import { combineReducers } from 'redux';

const reducers = combineReducers({
  navigationState: require('./navigation'),
});

export default reducers;
