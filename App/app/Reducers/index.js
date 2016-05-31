/* @flow */
'use strict';

import { combineReducers } from 'redux-immutable';

import reader from '../Components/Reader/reducer';
import discover from '../Components/Discover/reducer';

const reducers = {
  reader,
  discover
};

export default function createReducer() {
	return combineReducers(reducers);
}
