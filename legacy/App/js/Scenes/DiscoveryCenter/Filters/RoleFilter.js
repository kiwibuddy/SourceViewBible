/* @flow */
'use strict';

import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Colors, StyleSheet } from '../../../Common';

import { cardWithFilter, cardWithoutFilter } from './FilterUtils';

import { Role } from '../../../Database';

type Props = {
  card: Object,
  filter: Object,
  type: string,
  navigate: Function,
  onDone: Function,
};

function filterRole(card: Object, filter: Object, type: string, key: string) {
  const role = Role.findByKey(key);

  if (card.type === 'sources' && filter && filter.roleID === role.id) {
    return cardWithoutFilter(card, filter);
  }

  return cardWithFilter(card, {
    id: 'filter-' + Date.now(),
    type: 'role',
    actantType: type,
    ...filter,
    roleID: role.id,
  });
}

function checkmark(card: Object, filter: Object, key: string) {
  const role = Role.findByKey(key);

  if (card.type === 'sources' && filter && filter.roleID === role.id) {
    return <Image style={{ tintColor: Colors.tint }} source={require('../../../Images/common/checkmark.png')} />;
  }
  return null;
}

const RoleFilters = (props: Props) => {
  const { card, filter } = props;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterRole(props.card, props.filter, props.type, 'narrator'))}>
        <Text style={StyleSheet.styles.cell.title}>Narrator</Text>
        {checkmark(card, filter, 'narrator')}
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterRole(props.card, props.filter, props.type, 'god'))}>
        <Text style={StyleSheet.styles.cell.title}>God</Text>
        {checkmark(card, filter, 'god')}
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterRole(props.card, props.filter, props.type, 'lead'))}>
        <Text style={StyleSheet.styles.cell.title}>Lead</Text>
        {checkmark(card, filter, 'lead')}
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterRole(props.card, props.filter, props.type, 'support'))}>
        <Text style={StyleSheet.styles.cell.title}>Support</Text>
        {checkmark(card, filter, 'support')}
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

export default RoleFilters;
