/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  Image,
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

import { cardWithFilter, cardWithoutFilter } from './FilterUtils';

import { Nature } from '../../../Database';


function filterNature(card: Object, filter: Object, type: string, key: string) {
  const nature = Nature.findByKey(key);

  if (card.type === 'sources' && filter && filter.natureID === nature.id) {
    return cardWithoutFilter(card, filter);
  }

  return cardWithFilter(card, {
    id: 'filter-' + Date.now(),
    actantType: type,
    ...filter,
    type: 'nature',
    natureID: nature.id
  });
}

function checkmark(card: Object, filter: Object, key: string) {
  const nature = Nature.findByKey(key);

  if (card.type === 'sources' && filter && filter.natureID === nature.id) {
    return <Image style={{tintColor: Colors.tint}} source={require('../../../Images/common/checkmark.png')} />;
  }
  return null;
}

type Props = {
  card: Object,
  filter: Object,
  type: string,
  navigate: Function,
  onDone: Function,
};

const NatureFilters = (props: Props) => {
  const { card, filter } = props;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterNature(props.card, props.filter, props.type, 'Divine'))}>
        <Text style={StyleSheet.styles.cell.title}>Divine</Text>
        {checkmark(card, filter, 'Divine')}
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterNature(props.card, props.filter, props.type, 'Human'))}>
        <Text style={StyleSheet.styles.cell.title}>Human</Text>
        {checkmark(card, filter, 'Human')}
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterNature(props.card, props.filter, props.type, 'Angelic'))}>
        <Text style={StyleSheet.styles.cell.title}>Angelic</Text>
        {checkmark(card, filter, 'Angelic')}
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterNature(props.card, props.filter, props.type, 'Demonic'))}>
        <Text style={StyleSheet.styles.cell.title}>Demonic</Text>
        {checkmark(card, filter, 'Demonic')}
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterNature(props.card, props.filter, props.type, 'Other'))}>
        <Text style={StyleSheet.styles.cell.title}>Other</Text>
        {checkmark(card, filter, 'Other')}
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

export default NatureFilters;
