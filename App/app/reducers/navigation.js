'use strict';

import * as NavigationStateUtils from 'NavigationStateUtils'

const Localizable = require('../common/localizable');

const initialState = {
  key: 'MainNavigation',
  index: 0,
  children: [
    { key: 'discover', title: Localizable.t('discover') }
  ]
}

function navigation(state = initialState, action) {
  switch (action.type) {
    case 'NAV_PUSH':
      if (state.children[state.index].key === (action.state && action.state.key)) return state;
      return NavigationStateUtils.push(state, action.state);

    case 'NAV_POP':
      if (state.index === 0 || state.children.length === 1) return state;
      return NavigationStateUtils.pop(state);

    case 'NAV_JUMP_TO_KEY':
      return NavigationStateUtils.jumpTo(state, action.key);

    case 'NAV_JUMP_TO_INDEX':
      return NavigationStateUtils.jumpToIndex(state, action.index);

    case 'NAV_RESET':
      return {
        ...state,
        index: action.index,
        children: action.children
      }

    default:
      return state;
  }
}

module.exports = navigation;
