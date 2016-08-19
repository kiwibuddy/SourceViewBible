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
  const actantTypeKey = (props.actantType ? `${props.actantType}-` : '');
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'name', name: Localizable.t(`${actantTypeKey}name`), actantType: props.actantType}))}>
        <Text style={StyleSheet.styles.cell.title}>Name</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'gender', name: Localizable.t(`${actantTypeKey}gender`), actantType: props.actantType}))}>
        <Text style={StyleSheet.styles.cell.title}>Gender</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'nature', name: Localizable.t(`${actantTypeKey}nature`), actantType: props.actantType}))}>
        <Text style={StyleSheet.styles.cell.title}>Nature</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'profession', name: Localizable.t(`${actantTypeKey}profession`), actantType: props.actantType}))}>
        <Text style={StyleSheet.styles.cell.title}>Profession</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'role', name: Localizable.t(`${actantTypeKey}role`), actantType: props.actantType}))}>
        <Text style={StyleSheet.styles.cell.title}>Role</Text>
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
