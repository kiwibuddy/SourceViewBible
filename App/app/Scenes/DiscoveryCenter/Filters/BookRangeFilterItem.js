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
import { Book } from '../../../Database';

type Props = {
  filter: Object,
  onPressDeleteFilter: Function,
  onPressEditFilter: Function,
};

const BookRangeFilterItem = (props: Props) => {
  const { fromID, toID } = props.filter.books;
  const from = Book.findByID(fromID);
  const to = Book.findByID(toID);

  return (
    <View>
      <View style={StyleSheet.styles.discoveryCenter.topContainer}>
        <View style={StyleSheet.styles.discoveryCenter.leftContainer}>
          <TouchableOpacity>
            <Text style={[styles.button, {color: '#9B9B9B'}]}>BOOK RANGE</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={StyleSheet.styles.discoveryCenter.bottomContainer}>
        <Text>From</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => props.onPressEditFilter(booksFilterURL({title: 'From', filter: props.filter, item: 'from'}))}>
          <Text style={styles.filterButtonTitle}>{from.name}</Text>
          <Image source={require('../Images/chart-icn-dropdown-filter.png')} />
        </TouchableOpacity>
        <Text>To</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => props.onPressEditFilter(booksFilterURL({title: 'To', filter: props.filter, item: 'to'}))}>
          <Text style={styles.filterButtonTitle}>{to.name}</Text>
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

export default BookRangeFilterItem;
