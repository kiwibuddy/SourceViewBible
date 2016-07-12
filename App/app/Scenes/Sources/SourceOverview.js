/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Text,
  View,
  Image
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

export default class SourceOverview extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.wordCloud}>
          <Image style={styles.avatarBackground} source={require('../../Images/sources/avatar-background.png')} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wordCloud: {
    height: 200,
    backgroundColor: 'red',
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 0.4,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  avatarBackground: {
    alignSelf: 'center',
    marginTop: 100,
  }
});
