/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Platform,
  StyleSheet,
  View
} from 'react-native';

export default class Toolbar extends Component {
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
    height: 44,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
    borderTopColor: 'rgba(0, 0, 0, .15)',
    borderTopWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
