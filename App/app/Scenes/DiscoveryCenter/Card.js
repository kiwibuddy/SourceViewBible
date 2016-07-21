/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  View
} from 'react-native';

import {
  StyleSheet,
} from '../../Common';

export const CardHeader = (props: Object) => {
  return (
    <View style={styles.header}>
      {props.children}
    </View>
  );
};

const Card = (props: Object) => {
  return (
    <View style={styles.card}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 4,
    marginVertical: 5,
    borderRadius: 2,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 0.8,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default Card;
