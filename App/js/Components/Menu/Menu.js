/* @flow */
'use strict';

import React from 'react';

import { View } from 'react-native';

import { StyleSheet } from '../../Common';

const Menu = props => {
  return <View style={styles.container}>{props.children}</View>;
};

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    borderRadius: 2,
    backgroundColor: 'white',
    width: 200,
    elevation: 5,
  },
});

export { Menu };
