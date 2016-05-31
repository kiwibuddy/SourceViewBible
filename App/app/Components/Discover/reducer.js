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
		key: 'discover',
		index: 0,
		children: [
			{
				key: 'discover',
				title: 'Discover'
			}
		],
	},
});

module.exports = (state: Object, action: Object) => {
	if (action.scope && action.scope !== 'discover') {
		return state;
	} else {
		return navigation(state, action);
	}
};
