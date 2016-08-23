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
  Localizable,
  StyleSheet,
} from '../../../Common';

import { genderFilterURL } from '../../../Navigation';
import { Gender } from '../../../Database';

type Props = {
  filter: Object,
  onPressDeleteFilter: Function,
  onPressEditFilter: Function,
};

const GenderFilterItem = (props: Props) => {
  const { genderID, actantType } = props.filter;
  const gender = Gender.findByID(genderID);

  return (
    <View>
      <View style={StyleSheet.styles.discoveryCenter.topContainer}>
        <View style={StyleSheet.styles.discoveryCenter.leftContainer}>
          <TouchableOpacity>
            <Text style={[styles.button, {color: '#9B9B9B'}]}>{actantType.toLocaleUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={StyleSheet.styles.discoveryCenter.bottomContainer}>
        <Text>Is</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => props.onPressEditFilter(genderFilterURL({title: Localizable.t('gender'), filter: props.filter}))}>
          <Text style={styles.filterButtonTitle}>{Localizable.t('genders.' + gender.key)}</Text>
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

export default GenderFilterItem;
