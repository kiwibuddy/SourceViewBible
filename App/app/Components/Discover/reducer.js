/* @flow */
'use strict';

import { cardStackReducer } from 'react-native-navigation-redux-helpers';

const initialState = {
	key: 'discover',
	index: 0,
	routes: [
		{
			key: 'discover',
			title: 'Discover'
		}
	],
};

module.exports = cardStackReducer(initialState);
