/* @flow */
'use strict';

import React from 'react';
import { View } from 'react-native';

import { Toolbar, ToolbarButton } from './';

type Props = {
  canGoBack: boolean,
  canGoForward: boolean,
  navigate: Function,
};

const DefaultToolbar = (props: Props) => {
  const { navigate } = props;

  return (
    <Toolbar>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
        <ToolbarButton
          imageSource={require('../Navigation/Images/nav-search.png')}
          onPress={() => {
            navigate({ path: '/Reader/Search', modal: true });
          }}
        />
        <ToolbarButton
          imageSource={require('../Navigation/Images/nav-discoverycenter.png')}
          onPress={() => {
            navigate({ path: '/DiscoveryCenter', modal: true });
          }}
        />
        <ToolbarButton
          imageSource={require('../Navigation/Images/nav-bookmarks.png')}
          onPress={() => {
            navigate({ path: '/Bookmarks', modal: true });
          }}
        />
      </View>
    </Toolbar>
  );
};

export default DefaultToolbar;
