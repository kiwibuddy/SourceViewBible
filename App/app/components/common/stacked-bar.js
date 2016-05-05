/* @flow */
'use strict';

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

export default class StackedBar extends Component {
  props: {
    style: any;
  };

  render() {
    return (
      <View style={[styles.container, this.props.style]}></View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red'
  }
});
