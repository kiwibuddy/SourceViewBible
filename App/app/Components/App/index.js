/* @flow */
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';

import NavigationBar from '../Navigation/NavigationBar';

export default class App extends Component {
  render() {
    const navigationBar = this._renderNavigationBar();
    return (
      <View style={{flex: 1}}>
        {navigationBar}
      </View>
    );
  }

  _renderNavigationBar = () => {
    return (
      <NavigationBar />
    );
  };
}
