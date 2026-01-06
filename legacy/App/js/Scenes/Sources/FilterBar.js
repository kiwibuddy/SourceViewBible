/* @flow */
'use strict';

import React from 'react';

import { Image, Text, TouchableOpacity, View, Platform } from 'react-native';

import { Localizable, StyleSheet } from '../../Common';

type Props = {
  book: ?Object,
  onPress: Function,
};

const FilterBar = (props: Props) => {
  const { book } = props;
  if (!book) return null;

  return (
    <View style={styles.filterBar}>
      <Text style={styles.filterLabel}>{Localizable.t('in-book', { book: book.name })}</Text>
      <TouchableOpacity style={styles.filterClear} onPress={props.onPress}>
        <Image source={require('../../Images/sources/clear-btn.png')} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterBar: {
    height: 30,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c7cc',
    alignItems: 'center',
    paddingHorizontal: 8,
    justifyContent: 'center',
    elevation: 2,
    borderTopColor: Platform.OS === 'ios' ? 0 : 'rgba(0, 0, 0, .15)',
    borderTopWidth: Platform.OS === 'ios' ? 0 : 1,
  },
  filterLabel: {
    fontSize: 14,
    color: '#9B9B9B',
    fontWeight: '600',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: -1,
  },
  filterClear: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
export default FilterBar;
