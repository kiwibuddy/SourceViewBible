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

import { chronologyFilterURL } from '../../../Navigation';

type Props = {
  navigate: Function,
  onDone: Function,
};

const NatureFilters = (props: Props) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.title}>Divine</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
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
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.title}>Male</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.title}>Female</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.title}>Angelic</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.title}>Demonic</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
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
