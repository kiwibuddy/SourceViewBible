/* @flow */
'use strict';

import React, { Component } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';

const window = Dimensions.get('window');
const isSafeAreaNeeded = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS && (window.height === 812 || window.width === 812);

const TOOLBAR_HEIGHT = Platform.OS === 'ios' ? (isSafeAreaNeeded ? 64 : 44) : 56;

type Props = {
  style?: any,
  children?: any,
};

export default class Toolbar extends Component<Props> {
  static HEIGHT = TOOLBAR_HEIGHT;

  render() {
    const { style, children } = this.props;
    const safeAreaStyle = isSafeAreaNeeded ? { paddingBottom: 20 } : {};
    return <View style={[styles.toolbar, safeAreaStyle, style]}>{children}</View>;
  }
}

const styles = StyleSheet.create({
  toolbar: {
    position: 'absolute',
    minHeight: TOOLBAR_HEIGHT,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: '#F9F9F9',
    borderTopColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, .15)' : '#E8E8E8',
    borderTopWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
});
