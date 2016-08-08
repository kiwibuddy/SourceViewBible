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

import { Book } from '../../../Database';

type Props = {
  navigate: Function,
  onDone: Function,
};

function filterBooks(fromID: string, toID: string) {
  const from = Book.findByID(fromID);
  const to = Book.findByID(toID);

  return ({
    id: 'filter-' + Date.now(),
    type: 'book-range',
    books: {
      from: from,
      to: to
    }
  });
}

const BookFilters = (props: Props) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterBooks('genesis', 'revelation'))}>
        <Text style={StyleSheet.styles.cell.title}>Whole Bible</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.navigate(booksFilterURL({title: 'Specific Book'}))}>
        <Text style={StyleSheet.styles.cell.title}>Specific Book</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterBooks('genesis', 'malachi'))}>
        <Text style={StyleSheet.styles.cell.title}>Old Testament</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => props.onDone(filterBooks('matthew', 'revelation'))}>
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
