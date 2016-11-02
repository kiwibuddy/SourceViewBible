/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  Platform,
  View
} from 'react-native';

import {
  Colors,
  Localizable,
  StyleSheet
} from '../../Common';

const Loading = () => {
  return (
    <View style={[styles.container, {flex: 1, flexDirection: 'column', padding: 20}]}>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .05}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .10}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .08}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} />
      </View>
      <View style={[styles.textPlaceholderContainer, {marginBottom: 20}]}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .80}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .05}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .10}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} />
      </View>
      <View style={[styles.textPlaceholderContainer, {marginBottom: 20}]}>
        <View style={[styles.textPlaceholder, {flex: 1}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .20}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
      <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .05}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .08}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
      <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .10}]} />
      </View>
      <View style={[styles.textPlaceholderContainer, {marginBottom: 20}]}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: 1}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .20}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
      <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .05}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .08}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
      <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .10}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
      <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .05}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .08}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
      <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .10}]} />
      </View>
      <View style={[styles.textPlaceholderContainer, {marginBottom: 20}]}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: 1}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .20}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
      <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .05}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .08}]} />
      </View>
      <View style={styles.textPlaceholderContainer}>
      <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .10}]} />
      </View>
      <View style={[styles.textPlaceholderContainer, {marginBottom: 20}]}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: 1}]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  textPlaceholderContainer: {
    height: 10,
    marginVertical: 5,
    flexDirection: 'row',
  },
  textPlaceholder: {
    backgroundColor: '#EDEDED',
    height: 10,
  },
  whiteSpace: {
    backgroundColor: '#FFF',
    height: 10,
  },
});

export default Loading;
