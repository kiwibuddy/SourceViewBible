/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

export default class NavigationBar extends Component {
  static HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;

  render() {
    return (
      <View style={styles.navigationBar}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navigationBar: {
    position: 'absolute',
    top: 0,
    height: APPBAR_HEIGHT + STATUSBAR_HEIGHT,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
    borderBottomColor: 'rgba(0, 0, 0, .15)',
    borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16, // This is needed for elevation shadow
  },
});
