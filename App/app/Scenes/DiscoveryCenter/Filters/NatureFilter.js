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
    type: 'nature',
    actantType: type,
    ...filter,
    nature
  });
}

function filterGender(filter: Object, type: string, key: string) {
  const id = (key === 'Male' ? 2 : 1);
  return ({
    id: 'filter-' + Date.now(),
    type: 'gender',
    actantType: type,
    ...filter,
    gender: {
      id,
      key
    }
  });
}

function filterActantNumber(filter: Object, type: string, key: string) {
  const id = (key === 'Individual' ? 2 : 1);
  return ({
    id: 'filter-' + Date.now(),
    type: 'actant-number',
    actantType: type,
    ...filter,
    actantNumber: {
      id,
      key
    }
  });
}


type Props = {
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
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, filterActantNumber(props.filter, props.type, 'Group')))}>
        <Text style={StyleSheet.styles.cell.title}>Human Group</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, filterActantNumber(props.filter, props.type, 'Individual')))}>
        <Text style={StyleSheet.styles.cell.title}>Human Individual</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, filterGender(props.filter, props.type, 'Male')))}>
        <Text style={StyleSheet.styles.cell.title}>Male</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, filterGender(props.filter, props.type, 'Female')))}>
        <Text style={StyleSheet.styles.cell.title}>Female</Text>
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
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
  },
});

export default NatureFilters;
