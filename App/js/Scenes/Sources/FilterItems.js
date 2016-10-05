/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import { genderFilterURL, natureFilterURL, professionFilterURL, roleFilterURL } from '../../Navigation';

type Props = {
  card: Object,
  navigate: Function,
  onDone: Function,
};

const FilterItems = (props: Props) => {
  const { card } = props;

  const roleFilter = card.filters.find((filter) => filter.type === 'role');
  const natureFilter = card.filters.find((filter) => filter.type === 'nature');
  const genderFilter = card.filters.find((filter) => filter.type === 'gender');
  const professionFilter = card.filters.find((filter) => filter.type === 'profession');

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(roleFilterURL({title: 'Role', filter: roleFilter}))}>
        <Text style={StyleSheet.styles.cell.title}>Role</Text>
        <Image source={require('../../Images/common/disclosure.png')} />
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(natureFilterURL({title: 'Nature', filter: natureFilter}))}>
        <Text style={StyleSheet.styles.cell.title}>Nature</Text>
        <Image source={require('../../Images/common/disclosure.png')} />
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(genderFilterURL({title: 'Gender', filter: genderFilter}))}>
        <Text style={StyleSheet.styles.cell.title}>Gender</Text>
        <Image source={require('../../Images/common/disclosure.png')} />
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(professionFilterURL({title: 'Profession', filter: professionFilter}))}>
        <Text style={StyleSheet.styles.cell.title}>Profession</Text>
        <Image source={require('../../Images/common/disclosure.png')} />
      </TouchableOpacity>
      <View style={styles.separator} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
  },
});

export default FilterItems;
