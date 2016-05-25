/* @flow */
'use strict';

import React, { Component } from 'react';

import ReactNative, {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  NavigationExperimental,
  Image
} from 'react-native';

const { Header: NavigationHeader } = NavigationExperimental;

import {
  Colors,
  StyleSheet,
  Localizable,
  Platform
} from '../../Common';

class BookWords extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>TBD</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: NavigationHeader.HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#EDEDED',
    fontSize: 90,
    fontWeight: 'bold',
  }
});

export default BookWords;
