/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  View
} from 'react-native';

import {
  StyleSheet,
} from '../../Common';

export const Header = (props: Object) => {
  return (
    <View {...props} style={[styles.header, props.style]}>
      {props.children}
    </View>
  );
};

const Card = (props: Object) => {
  return (
    <View style={styles.card} {...props}>
      {props.children}
    </View>
  );
};
Card.Header = Header;

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
