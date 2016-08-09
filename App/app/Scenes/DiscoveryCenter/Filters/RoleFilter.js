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

function filterRole(type: string, key: string) {
  let id = null;
  switch (key) {
    case 'narrator':
      id = 1;
      break;

    case 'god':
      id = 2;
      break;

    case 'lead':
      id = 3;
      break;

    case 'support':
      id = 4;
      break;
  }

  return ({
      id: 'filter-' + Date.now(),
      type: 'role',
      actantType: type,
      role: {
        id,
        key
      }
  });
}

const RoleFilters = (props: Props) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterRole(props.type, 'narrator'))}>
        <Text style={StyleSheet.styles.cell.title}>Narrator</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterRole(props.type, 'god'))}>
        <Text style={StyleSheet.styles.cell.title}>God</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterRole(props.type, 'lead'))}>
        <Text style={StyleSheet.styles.cell.title}>Lead</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterRole(props.type, 'support'))}>
        <Text style={StyleSheet.styles.cell.title}>Support</Text>
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
