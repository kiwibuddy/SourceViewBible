/* @flow */
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';

import { NavigationBar, Toolbar } from '../Navigation';

export default class App extends Component {
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
      <Toolbar />
    )
  };
}
