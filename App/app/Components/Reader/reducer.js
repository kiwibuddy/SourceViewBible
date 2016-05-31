/* @flow */
'use strict';

import { NavigationExperimental } from 'react-native';
const { Reducer: NavigationReducer } = NavigationExperimental;

const navigation = NavigationReducer.StackReducer({
	getPushedReducerForAction: (action) => {
		if (action.type === 'push') {
			return (state) => (state || action.route);
		}
		return null;
	},
	initialState: {
		key: 'reader',
		index: 1,
		children: [
			{
				key: 'scripture',
				title: 'Scripture'
			},
			{
				key: 'discover',
				title: 'Discover Foo'
			}
		],
	},
});

module.exports = (state: Object, action: Object) => {
	if (action.scope && action.scope !== 'reader') {
		return state;
	} else {
		return navigation(state, action);
	}
};
