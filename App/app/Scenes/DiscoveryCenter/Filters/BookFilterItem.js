/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  StyleSheet,
} from '../../../Common';

import { booksFilterURL } from '../../../Navigation';

type Props = {
  filter: Object,
  onPressDeleteFilter: Function,
  onPressEditFilter: Function,
};

const BookFilterItem = (props: Props) => {
  const { book } = props.filter;

  return (
    <View>
      <View style={StyleSheet.styles.discoveryCenter.topContainer}>
        <View style={StyleSheet.styles.discoveryCenter.leftContainer}>
          <TouchableOpacity>
            <Text style={[styles.button, {color: '#9B9B9B'}]}>BOOK</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={StyleSheet.styles.discoveryCenter.bottomContainer}>
        <Text>Is</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => props.onPressEditFilter(booksFilterURL({title: 'Specific Book', filter: props.filter}))}>
          <Text style={styles.filterButtonTitle}>{book.name}</Text>
          <Image source={require('../Images/chart-icn-dropdown-filter.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterDelete} onPress={props.onPressDeleteFilter}>
          <Image source={require('../Images/chart-icn-filter-delete.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    color: Colors.tint,
    fontSize: 11,
    fontWeight: 'bold',
    paddingRight: 15,
  },
  filterButton: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.tint,
    paddingHorizontal: 2,
    marginHorizontal: 8,
  },
  filterButtonTitle: {
    color: Colors.tint,
  },
  filterDelete: {
    position: 'absolute',
    right: 5,
  },
});

export default BookFilterItem;
