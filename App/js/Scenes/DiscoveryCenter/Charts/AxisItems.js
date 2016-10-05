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
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'words'}))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('words.text')}</Text>
      </TouchableOpacity>
      <View style={styles.separator} />

      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'book'}))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('books')}</Text>
      </TouchableOpacity>
      <View style={styles.separator} />

      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(actantAxisItemsURL({title: Localizable.t('everyone'), axis: props.axis}))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('everyone')}</Text>
        <Image source={require('../Images/disclosure.png')} />
      </TouchableOpacity>
      <View style={styles.separator} />

      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(actantAxisItemsURL({title: Localizable.t('just-sources'), axis: props.axis, actantType: 'source'}))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('just-sources')}</Text>
        <Image source={require('../Images/disclosure.png')} />
      </TouchableOpacity>
      <View style={styles.separator} />

      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(actantAxisItemsURL({title: Localizable.t('just-recipients'), axis: props.axis, actantType: 'recipient'}))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('just-recipients')}</Text>
        <Image source={require('../Images/disclosure.png')} />
      </TouchableOpacity>
      <View style={styles.separator} />

      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(updateAxis(props.card, props.axis, {type: 'sphere'}))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('spheres.text')}</Text>
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
