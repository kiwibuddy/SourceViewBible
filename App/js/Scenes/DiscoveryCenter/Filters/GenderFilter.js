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

function filterGender(card: Object, filter: Object, type: string, key: string) {
  const genderID = (key === 'Male' ? 2 : 1);

  if (card.type === 'sources' && filter && filter.genderID === genderID) {
    return cardWithoutFilter(card, filter);
  }

  return cardWithFilter(card, {
    id: 'filter-' + Date.now(),
    actantType: type,
    ...filter,
    type: 'gender',
    genderID
  });
}

type Props = {
  card: Object,
  filter: Object,
  type: string,
  navigate: Function,
  onDone: Function,
};

const GenderFilter = (props: Props) => {
  const { card, filter } = props;

  const checkmark = <Image style={{tintColor: Colors.tint}} source={require('../../../Images/common/checkmark.png')} />;
  let maleCheckmark = null;
  let femaleCheckmark = null;
  if (card.type === 'sources' && filter) {
    maleCheckmark = filter.genderID === 2 ? checkmark : null;
    femaleCheckmark = filter.genderID === 1 ? checkmark : null;
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterGender(props.card, props.filter, props.type, 'Male'))}>
        <Text style={StyleSheet.styles.cell.title}>Male</Text>
        {maleCheckmark}
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterGender(props.card, props.filter, props.type, 'Female'))}>
        <Text style={StyleSheet.styles.cell.title}>Female</Text>
        {femaleCheckmark}
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

export default GenderFilter;
