/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../../Common';

import { cardWithFilter } from './FilterUtils';

function filterGender(filter: Object, type: string, key: string) {
  const id = (key === 'Male' ? 2 : 1);
  return ({
    id: 'filter-' + Date.now(),
    actantType: type,
    ...filter,
    type: 'gender',
    gender: {
      id,
      key
    }
  });
}

type Props = {
  card: Object,
  filter: Object,
  type: string,
  navigate: Function,
  onDone: Function,
};

const GenderFilter = (props: Props) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, filterGender(props.filter, props.type, 'Male')))}>
        <Text style={StyleSheet.styles.cell.title}>Male</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, filterGender(props.filter, props.type, 'Female')))}>
        <Text style={StyleSheet.styles.cell.title}>Female</Text>
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

export default GenderFilter;
