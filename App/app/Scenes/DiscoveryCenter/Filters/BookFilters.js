/* @flow */
'use strict';

import React, { Component } from 'react';
import {
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

import { booksFilterURL } from '../../../Navigation';

import { Book, ComparisonPredicate } from '../../../Database';

type Props = {
  navigate: Function,
  onDone: Function,
};

const WholeBibleFilter = {
  id: 'filter-' + Date.now(),
  type: 'book-range',
  books: {
    from: Book.findByID('genesis'),
    to: Book.findByID('revelation')
  },
  predicates: [
    ComparisonPredicate.predicateWith('statements.first', '>=', 1),
    ComparisonPredicate.predicateWith('statements.last', '<=', Book.findByID('revelation').lastMonad),
  ]
}

const BookFilters = (props: Props) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {props.onDone(WholeBibleFilter)}}>
        <Text style={StyleSheet.styles.cell.title}>Whole Bible</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(booksFilterURL({title: 'Specific Book'}))}>
        <Text style={StyleSheet.styles.cell.title}>Specific Book</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.title}>Old Testament</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.title}>New Testament</Text>
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
