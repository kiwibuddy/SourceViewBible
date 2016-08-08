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

import { booksFilterURL } from '../../../Navigation';

import { Sphere } from '../../../Database';

type Props = {
  navigate: Function,
  onDone: Function,
};

function filterSphere(sphereID: string) {
  const sphere = Sphere.findByID(sphereID);

  return ({
    id: 'filter-' + Date.now(),
    type: 'sphere',
    sphere,
  });
}

const SpheresFilter = (props: Props) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterSphere('family'))}>
        <Text style={StyleSheet.styles.cell.title}>Family</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterSphere('economics'))}>
        <Text style={StyleSheet.styles.cell.title}>Economics</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterSphere('religion'))}>
        <Text style={StyleSheet.styles.cell.title}>Religion</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterSphere('government'))}>
        <Text style={StyleSheet.styles.cell.title}>Government</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterSphere('education'))}>
        <Text style={StyleSheet.styles.cell.title}>Education</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterSphere('communication'))}>
        <Text style={StyleSheet.styles.cell.title}>Communication</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterSphere('celebration'))}>
        <Text style={StyleSheet.styles.cell.title}>Celebration</Text>
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

export default SpheresFilter;
