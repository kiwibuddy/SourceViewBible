/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Text,
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

export default class Reader extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Reader</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
