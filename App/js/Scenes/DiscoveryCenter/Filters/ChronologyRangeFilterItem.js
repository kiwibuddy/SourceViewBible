/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../../Common';

import { chronologyFilterURL } from '../../../Navigation';
import { Chronology } from '../../../Database';

type Props = {
  filter: Object,
  onPressDeleteFilter: Function,
  onPressEditFilter: Function,
};

const ChronologyRangeFilterItem = (props: Props) => {
  const { fromID, toID } = props.filter.chronologies;
  const from = Chronology.findByID(fromID);
  const to = Chronology.findByID(toID);

  return (
    <View>
      <View style={StyleSheet.styles.discoveryCenter.topContainer}>
        <View style={StyleSheet.styles.discoveryCenter.leftContainer}>
          <TouchableOpacity>
            <Text style={[styles.button, {color: '#9B9B9B'}]}>TIME PERIOD</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={StyleSheet.styles.discoveryCenter.bottomContainer}>
        <Text>From</Text>
        <TouchableOpacity hitSlop={{top: 10, left: 5, bottom: 10, right: 0}} style={styles.filterButton} onPress={() => props.onPressEditFilter(chronologyFilterURL({title: Localizable.t('time-period'), filter: props.filter, item: 'from'}))}>
          <Text style={styles.filterButtonTitle}>{Localizable.t('chronologies.' + from.key)}</Text>
          <Image source={require('../Images/chart-icn-dropdown-filter.png')} />
        </TouchableOpacity>
        <Text>To</Text>
        <TouchableOpacity hitSlop={{top: 10, left: 5, bottom: 10, right: 0}} style={styles.filterButton} onPress={() => props.onPressEditFilter(chronologyFilterURL({title: Localizable.t('time-period'), filter: props.filter, item: 'to'}))}>
          <Text style={styles.filterButtonTitle}>{Localizable.t('chronologies.' + to.key)}</Text>
          <Image source={require('../Images/chart-icn-dropdown-filter.png')} />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={{top: 10, left: 5, bottom: 10, right:5}} style={styles.filterDelete} onPress={props.onPressDeleteFilter}>
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

export default ChronologyRangeFilterItem;
