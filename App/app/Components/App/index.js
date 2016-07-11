/* @flow */
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';

import { NavigationBar, Toolbar, ToolbarButton } from '../Navigation';

type State = {
  navigation: any,
};

function reducer(state, action) {
  if (!state) {
    return {
      index: 0,
      routes: [{key: '/Discover'}],
    };
  }
};

export default class App extends Component {
  state: State;

  constructor(props: any, context: any) {
    super(props, context);

    this.state = {
      navigation: reducer(),
    };
  }

  render() {
    const navigationBar = this._renderNavigationBar();
    const toolbar = this._renderToolbar();

    return (
      <View style={{flex: 1}}>
        {navigationBar}
        {toolbar}
      </View>
    );
  }

  _renderNavigationBar = () => {
    return (
      <NavigationBar />
    );
  };

  _renderToolbar = () => {
    return (
      <Toolbar>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <ToolbarButton
            imageSource={require('../Navigation/Images/nav-back.png')}
            onPress={() => {}}
          />
          <ToolbarButton
            imageSource={require('../Navigation/Images/nav-forward.png')}
            onPress={() => {}}
          />
        </View>
        <View style={{flex: 1}}>
          <ToolbarButton
            imageSource={require('../Navigation/Images/nav-discoverycenter.png')}
            onPress={() => {}}
          />
        </View>
        <ToolbarButton
          imageSource={require('../Navigation/Images/nav-bookmarks.png')}
          onPress={this._onPressBookmarks}
        />
      </Toolbar>
    );
  };

  _onPressBookmarks = () => {

  };
}
