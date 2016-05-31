/* @flow */
'use strict';

import ReactNative from 'react-native';
const { NavigationExperimental } = ReactNative;
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
		index: 0,
		children: [
			{
				key: 'scripture',
				title: 'Scripture'
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
