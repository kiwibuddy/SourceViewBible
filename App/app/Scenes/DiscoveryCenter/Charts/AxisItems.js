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

function updateAxis (card: Object, axis: string, item: Object) {
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
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {id: 'book', name: Localizable.t('book')}))}>
        <Text style={StyleSheet.styles.cell.title}>Book</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {id: 'sphere', name: Localizable.t('sphere')}))}>
        <Text style={StyleSheet.styles.cell.title}>Sphere</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {id: 'chronology', name: Localizable.t('time-period')}))}>
        <Text style={StyleSheet.styles.cell.title}>Time Period</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {id: 'words', name: Localizable.t('words.text')}))}>
        <Text style={StyleSheet.styles.cell.title}>Words</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem}>
        <Text style={[StyleSheet.styles.cell.title, {color: '#9B9B9B'}]}>Name</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem}>
        <Text style={[StyleSheet.styles.cell.title, {color: '#9B9B9B'}]}>Role</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem}>
        <Text style={[StyleSheet.styles.cell.title, {color: '#9B9B9B'}]}>Nature</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem}>
        <Text style={[StyleSheet.styles.cell.title, {color: '#9B9B9B'}]}>Gender</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem}>
        <Text style={[StyleSheet.styles.cell.title, {color: '#9B9B9B'}]}>Profession</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(actantAxisItemsURL({title: Localizable.t('source'), axis: props.axis, type: 'source'}))}>
        <Text style={StyleSheet.styles.cell.title}>Source</Text>
        <Image source={require('../Images/disclosure.png')} />
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(actantAxisItemsURL({title: Localizable.t('recipient'), axis: props.axis, type: 'recipient'}))}>
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
