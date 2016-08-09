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

import { Nature } from '../../../Database';


function filterNature(type: string, key: string) {
  const nature = Nature.findByKey(key);
  return ({
    id: 'filter-' + Date.now(),
    type: 'nature',
    actantType: type,
    nature
  });
}

function filterGender(type: string, key: string) {
  const gender = (key === 'Male' ? 2 : 1);
  return ({
    id: 'filter-' + Date.now(),
    type: 'gender',
    actantType: type,
    gender
  });
}


type Props = {
  navigate: Function,
  onDone: Function,
};

const NatureFilters = (props: Props) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterNature(props.type, 'Divine'))}>
        <Text style={StyleSheet.styles.cell.title}>Divine</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterNature(props.type, 'Human'))}>
        <Text style={StyleSheet.styles.cell.title}>Human</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.title}>Human Group</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.title}>Human Individual</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterGender(props.type, 'Male'))}>
        <Text style={StyleSheet.styles.cell.title}>Male</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterGender(props.type, 'Female'))}>
        <Text style={StyleSheet.styles.cell.title}>Female</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterNature(props.type, 'Angelic'))}>
        <Text style={StyleSheet.styles.cell.title}>Angelic</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterNature(props.type, 'Demonic'))}>
        <Text style={StyleSheet.styles.cell.title}>Demonic</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterNature(props.type, 'Other'))}>
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
