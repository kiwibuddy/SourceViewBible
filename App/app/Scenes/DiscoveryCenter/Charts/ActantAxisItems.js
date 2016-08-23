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


function updateAxis (card: Object, axis: string, item: Object) {
  card[axis] = item;
  return card;
}

type Props = {
  axis: string,
  card: Object,
  navigate: Function,
  onDone: Function,
  actantType: string,
};

const ActantAxisItems = (props: Props) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'name', actantType: props.actantType}))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('name')}</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'gender', actantType: props.actantType}))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('gender')}</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'nature', actantType: props.actantType}))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('nature')}</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'profession', actantType: props.actantType}))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('profession')}</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'role', actantType: props.actantType}))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('role')}</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'chronology', actantType: props.actantType}))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('time-period')}</Text>
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

export default ActantAxisItems;
