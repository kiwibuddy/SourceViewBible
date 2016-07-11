/* @flow */
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';

import { NavigationBar, Toolbar, ToolbarButton } from '../Navigation';

import Bookmarks from '../../Scenes/Bookmarks/Bookmarks';

export default class App extends Component {
  state = {
    navigation: {
      index: 0,
      routes: [
        {key: '/Bookmarks'},
      ],
    }
  };

  render() {
    const { navigation } = this.state;
    const route = navigation.routes[navigation.index];
    const scene = this._renderScene({route});
    const navigationBar = this._renderNavigationBar({navigationState: navigation});
    const toolbar = this._renderToolbar({navigationState: navigation, jumpToIndex: this._jumpToIndex});

    return (
      <View style={{flex: 1}}>
        {scene}
        {navigationBar}
        {toolbar}
      </View>
    );
  }

  _renderScene = (props: any) => {
    const { route } = props;

    switch (route.key) {
      case '/Bookmarks':
        return <Bookmarks onPress={(route) => this._pushRoute(this.state.navigation, route)}/>;
      default:
        return null;
    };

  };

  _renderNavigationBar = () => {
    return (
      <NavigationBar />
    );
  };

  _renderToolbar = (props: any) => {
    const { navigationState, jumpToIndex } = props;
    const canGoBack = navigationState.index > 0;
    const canGoForward = navigationState.index < navigationState.routes.length - 1;

    return (
      <Toolbar>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <ToolbarButton
            disabled={!canGoBack}
            imageSource={require('../Navigation/Images/nav-back.png')}
            onPress={() => jumpToIndex(navigationState.index - 1)}
          />
          <ToolbarButton
            disabled={!canGoForward}
            imageSource={require('../Navigation/Images/nav-forward.png')}
            onPress={() => jumpToIndex(navigationState.index + 1)}
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
          onPress={() => {}}
        />
      </Toolbar>
    );
  };

  _jumpToIndex = (index: number) => {
    this.setState({
      navigation: { ...this.state.navigation, index },
    });
  };

  _pushRoute = (state: any, route: any) => {
    const routes = [
      ...state.routes,
      route,
    ];

    const navigation = {
      ...state,
      index: routes.length - 1,
      routes,
    };

    if (navigation !== this.state.navigation) {
      this.setState({navigation});
    }
  };
}
