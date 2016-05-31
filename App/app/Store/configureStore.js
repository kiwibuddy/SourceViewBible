/* @flow */
'use strict';

import { createStore, compose } from 'redux';
import { fromJS } from 'immutable';
import createReducer from '../Reducers';

function configureStore(initialState: Object = fromJS({ })) {
	const createStoreWithMiddleware = compose()(createStore);
	return createStoreWithMiddleware(createReducer(), initialState);
}

module.exports = configureStore;
