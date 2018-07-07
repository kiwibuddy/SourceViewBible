/* @flow */
'use strict';

import React from 'react';

import { View } from 'react-native';

import { StyleSheet } from '../../Common';

const MenuOptions = props => {
  return <View style={styles.container}>{props.children}</View>;
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
});

export { MenuOptions };
