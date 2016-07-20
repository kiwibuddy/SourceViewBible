/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Platform,
  StyleSheet,
  View
} from 'react-native';

const TOOLBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

export default class Toolbar extends Component {
  static HEIGHT = TOOLBAR_HEIGHT;

  render() {
    return (
      <View style={styles.toolbar}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    position: 'absolute',
    height: TOOLBAR_HEIGHT,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
    borderTopColor: 'rgba(0, 0, 0, .15)',
    borderTopWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
