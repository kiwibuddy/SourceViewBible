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

import { booksFilterURL } from '../../../Navigation';
import { cardWithFilter } from './FilterUtils';
import { Book } from '../../../Database';

type Props = {
  navigate: Function,
  onDone: Function,
};

function filterBooks(fromID: string, toID: string) {
  return ({
    id: 'filter-' + Date.now(),
    type: 'book-range',
    books: {
      from: fromID,
      to: toID
    }
  });
}

const BookFilters = (props: Props) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, filterBooks('genesis', 'revelation')))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('whole-bible')}</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(booksFilterURL({title: 'Specific Book'}))}>
        <Text style={StyleSheet.styles.cell.title}>Specific Book</Text>
        <Image source={require('../Images/disclosure.png')} />
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, filterBooks('genesis', 'malachi')))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('old-testament')}</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(cardWithFilter(props.card, filterBooks('matthew', 'revelation')))}>
        <Text style={StyleSheet.styles.cell.title}>{Localizable.t('new-testament')}</Text>
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

export default BookFilters;
