/* @flow */
'use strict'

import React, { Component } from 'react';
import { View } from 'react-native';

import {
  Toolbar,
  ToolbarButton
} from './';

import { BACK, FORWARD } from '../../Navigation';

type Props = {
  canGoBack: boolean,
  canGoForward: boolean,
  navigate: Function,
};

const DefaultToolbar = (props: Props) => {
  const { canGoBack, canGoForward, navigate } = props;

  return (
    <Toolbar>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <ToolbarButton
          disabled={!canGoBack}
          imageSource={require('../Navigation/Images/nav-back.png')}
          onPress={() => navigate(BACK, {replace: false})}
        />
        <ToolbarButton
          disabled={!canGoForward}
          imageSource={require('../Navigation/Images/nav-forward.png')}
          onPress={() => navigate(FORWARD)}
        />
        <ToolbarButton
          imageSource={require('../Navigation/Images/nav-discoverycenter.png')}
          onPress={() => navigate({path: '/DiscoveryCenter', modal: true})}
        />
        <ToolbarButton
          imageSource={require('../Navigation/Images/nav-search.png')}
          onPress={() => navigate({path: '/Reader/Search', modal: true})}
        />
        <ToolbarButton
          imageSource={require('../Navigation/Images/nav-bookmarks.png')}
          onPress={() => navigate({path: '/Bookmarks', modal: true})}
        />
      </View>
    </Toolbar>
  );
}

export default DefaultToolbar;
