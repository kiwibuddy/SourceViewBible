/* @flow */
'use strict';

import React, { Component } from 'react';

import { Platform, SafeAreaView, StyleSheet } from 'react-native';

const TOOLBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

type Props = {
  style?: any,
  children?: any,
};

export default class Toolbar extends Component<Props> {
  static HEIGHT = TOOLBAR_HEIGHT;

  render() {
    const { style, children } = this.props;
    return <SafeAreaView style={[styles.toolbar, style]}>{children}</SafeAreaView>;
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
