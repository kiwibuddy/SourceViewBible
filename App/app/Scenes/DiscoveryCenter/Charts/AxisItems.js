/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Colors,
  Constants,
  StyleSheet,
  Localizable
} from '../../../Common';

import { actantAxisItemsURL } from '../../../Navigation';

function updateAxis(card: Object, axis: string, item: Object) {
  card[axis] = item;
  return card;
}

type Props = {
  axis: string,
  card: Object,
  navigate: Function,
  onDone: Function,
};


const AxisItems = (props: Props) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'book', name: Localizable.t('book')}))}>
        <Text style={StyleSheet.styles.cell.title}>Book</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'sphere', name: Localizable.t('sphere')}))}>
        <Text style={StyleSheet.styles.cell.title}>Sphere</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'chronology', name: Localizable.t('time-period')}))}>
        <Text style={StyleSheet.styles.cell.title}>Time Period</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'words', name: Localizable.t('words.text')}))}>
        <Text style={StyleSheet.styles.cell.title}>Words</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'name', name: Localizable.t('name')}))}>
        <Text style={StyleSheet.styles.cell.title}>Name</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'role', name: Localizable.t('role')}))}>
        <Text style={StyleSheet.styles.cell.title}>Role</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'nature', name: Localizable.t('nature')}))}>
        <Text style={StyleSheet.styles.cell.title}>Nature</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'gender', name: Localizable.t('gender')}))}>
        <Text style={StyleSheet.styles.cell.title}>Gender</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'profession', name: Localizable.t('profession')}))}>
        <Text style={StyleSheet.styles.cell.title}>Profession</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(actantAxisItemsURL({title: Localizable.t('source'), axis: props.axis, actantType: 'source'}))}>
        <Text style={StyleSheet.styles.cell.title}>Source</Text>
        <Image source={require('../Images/disclosure.png')} />
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(actantAxisItemsURL({title: Localizable.t('recipient'), axis: props.axis, actantType: 'recipient'}))}>
        <Text style={StyleSheet.styles.cell.title}>Recipient</Text>
        <Image source={require('../Images/disclosure.png')} />
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
    marginLeft: 8,
  },
});

export default AxisItems;
