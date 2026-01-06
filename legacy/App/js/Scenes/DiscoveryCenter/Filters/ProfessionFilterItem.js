/* @flow */
'use strict';

import React from 'react';

import { Image, Text, TouchableOpacity, View } from 'react-native';

import { Colors, Localizable, StyleSheet } from '../../../Common';

import { professionFilterURL } from '../../../Navigation';
import { Profession } from '../../../Database';

type Props = {
  filter: Object,
  onPressDeleteFilter: Function,
  onPressEditFilter: Function,
};

const ProfessionFilterItem = (props: Props) => {
  const { professionID, actantType } = props.filter;
  const profession = Profession.findByID(professionID);

  return (
    <View>
      <View style={StyleSheet.styles.discoveryCenter.topContainer}>
        <View style={StyleSheet.styles.discoveryCenter.leftContainer}>
          <TouchableOpacity>
            <Text style={[styles.button, { color: '#9B9B9B' }]}>{actantType.toLocaleUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={StyleSheet.styles.discoveryCenter.bottomContainer}>
        <Text>Profession is</Text>
        <TouchableOpacity
          hitSlop={{ top: 10, left: 5, bottom: 10, right: 0 }}
          style={styles.filterButton}
          onPress={() => props.onPressEditFilter(professionFilterURL({ title: Localizable.t('profession'), filter: props.filter }))}
        >
          <Text style={styles.filterButtonTitle}>{profession.name}</Text>
          <Image source={require('../Images/chart-icn-dropdown-filter.png')} />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={{ top: 10, left: 5, bottom: 10, right: 5 }} style={styles.filterDelete} onPress={props.onPressDeleteFilter}>
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

export default ProfessionFilterItem;
