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

type Props = {
  navigate: Function,
  onDone: Function,
};

function filterRole(roleID: string) {

}

const RoleFilters = (props: Props) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.title}>Narrator</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.title}>Lead</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.title}>Support</Text>
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

export default RoleFilters;
