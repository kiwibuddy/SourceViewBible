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

import { Nature } from '../../../Database';


function filterNature(filter: Object, type: string, key: string) {
  const nature = Nature.findByKey(key);
  return ({
    id: 'filter-' + Date.now(),
    actantType: type,
    ...filter,
    type: 'nature',
    natureID: nature.id
  });
}

type Props = {
  card: Object,
  filter: Object,
  type: string,
  navigate: Function,
  onDone: Function,
};

const NatureFilters = (props: Props) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, filterNature(props.filter, props.type, 'Divine')))}>
        <Text style={StyleSheet.styles.cell.title}>Divine</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, filterNature(props.filter, props.type, 'Human')))}>
        <Text style={StyleSheet.styles.cell.title}>Human</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, filterNature(props.filter, props.type, 'Angelic')))}>
        <Text style={StyleSheet.styles.cell.title}>Angelic</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, filterNature(props.filter, props.type, 'Demonic')))}>
        <Text style={StyleSheet.styles.cell.title}>Demonic</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, filterNature(props.filter, props.type, 'Other')))}>
        <Text style={StyleSheet.styles.cell.title}>Other</Text>
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

export default NatureFilters;
