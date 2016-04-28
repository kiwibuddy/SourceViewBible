'use strict';

import React from 'react';
import {Component, View, Text, StyleSheet} from 'react-native';

export default class SourceViewBibleApp extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
