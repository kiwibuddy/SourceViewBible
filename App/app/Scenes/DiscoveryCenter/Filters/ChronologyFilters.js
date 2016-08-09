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

import { chronologyFilterURL } from '../../../Navigation';
import { cardWithFilter } from './FilterUtils';
import { Chronology } from '../../../Database';

type Props = {
  navigate: Function,
  onDone: Function,
};


function AllTimeFilter() {
  const chronologies = Chronology.all();
  const from = chronologies[0];
  const to = chronologies[chronologies.length - 1];

  return ({
    id: 'filter-' + Date.now(),
    type: 'chronology-range',
    chronologies: {
      from: from,
      to: to
    }
  });
}

const ChronologyFilters = (props: Props) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, AllTimeFilter()))}>
        <Text style={StyleSheet.styles.cell.title}>All Time</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(chronologyFilterURL({title: 'Specific Time Period'}))}>
        <Text style={StyleSheet.styles.cell.title}>Specific Time Period</Text>
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
    marginLeft: 15,
  },
});

export default ChronologyFilters;
