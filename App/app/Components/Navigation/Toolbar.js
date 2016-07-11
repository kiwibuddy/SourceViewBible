/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
} from '../../Common';

export default class Toolbar extends Component {
  render() {
    return (
      <View style={styles.toolbar}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    flex: 1,
  },
});
