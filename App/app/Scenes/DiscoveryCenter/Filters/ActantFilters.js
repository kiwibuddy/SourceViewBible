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
} from '../../../Common';

import { actantFilterURL, natureFilterURL, professionFilterURL, roleFilterURL } from '../../../Navigation';

type Props = {
  navigate: Function,
  onDone: Function,
};

const ActantFilters = (props: Props) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(actantFilterURL({title: 'Name', type: props.type}))}>
        <Text style={StyleSheet.styles.cell.title}>Name</Text>
        <Image source={require('../Images/disclosure.png')} />
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(roleFilterURL({title: 'Role', type: props.type}))}>
        <Text style={StyleSheet.styles.cell.title}>Role</Text>
        <Image source={require('../Images/disclosure.png')} />
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(natureFilterURL({title: 'Nature', type: props.type}))}>
        <Text style={StyleSheet.styles.cell.title}>Nature</Text>
        <Image source={require('../Images/disclosure.png')} />
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(professionFilterURL({title: 'Profession', type: props.type}))}>
        <Text style={StyleSheet.styles.cell.title}>Profession</Text>
        <Image source={require('../Images/disclosure.png')} />
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

export default ActantFilters;
