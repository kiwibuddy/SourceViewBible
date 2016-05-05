/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, { Platform, SegmentedControlIOS } from 'react-native';

export default class SegmentedControl extends Component {
  render() {
    if (Platform.OS === 'ios') {
      return this._renderIOS();
    } else {
      return this._renderAndroid();
    }
  }

  _renderIOS() {
    return (
      <SegmentedControlIOS {...this.props} />
    );
  }

  _renderAndroid() {
    return null;
  }
}
