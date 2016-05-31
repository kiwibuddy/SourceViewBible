/* @flow */
'use strict';

import reader from '../Components/Reader/reducer';
import { combineReducers } from 'redux-immutable';

const reducers = {
  reader
};

export default function createReducer() {
	return combineReducers(reducers);
}
