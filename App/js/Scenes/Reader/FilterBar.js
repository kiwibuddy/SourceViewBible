/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  Localizable,
  StyleSheet
} from '../../Common';

import { Book, Sphere } from '../../Database';
import { Preference } from '../../Preferences';

type Props = {
  onPressClear: Function
};

const FilterBar = (props: Props) => {
  const spheres = Preference.objectForKey(Preference.Keys.Reader.spheres) || [];
  if (spheres.length == 0) return null;

  const sphereLabels = Sphere.whereIn(spheres).map(sphere => {
    const color = sphere.color();
    return (
      <View key={'sphere-' + sphere.id} style={[styles.filterLabelContainer, {backgroundColor: color}]}>
        <Text style={[styles.filterLabel]}>{sphere.name}</Text>
      </View>
    );
  });

  return (
    <View style={styles.filterBar}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {sphereLabels}
      </ScrollView>
      <TouchableOpacity style={styles.filterClear} onPress={props.onPressClear}>
        <Image source={require('./Images/clear-btn.png')} />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    elevation: 2,
    borderTopColor: Platform.OS === 'ios' ? 0 : 'rgba(0, 0, 0, .15)',
    borderTopWidth: Platform.OS === 'ios' ? 0 : 1,
  },
  filterLabelContainer: {
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 5,
    overflow: 'hidden',
    marginRight: 5,
  },
  filterLabel: {
    fontSize: 13,
    color: 'white',
  },
  filterClear: {
    position: 'absolute',
    right: 0,
  },
});

export default FilterBar;
