/* @flow */
'use strict';

import React, { Component } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';
import { ListView } from '../../Components/Common/DatabaseListView';

import { Colors, StyleSheet, Localizable } from '../../Common';

import { Actant, Book } from '../../Database';
import Emdros from '../../API/Emdros';
import Query from './Query';

import { readerURL } from '../../Navigation';

type Props = {
  sourceID: number,
  navigate: Function,
};

type State = {
  dataSource: any,
  occurrences: any,
  source: Object,
};

export default class SourceBooks extends Component {
  props: Props;
  state: State;
  shouldFetch: boolean = true;

  constructor(props: Props) {
    super(props);

    const source = Actant.findByID(props.sourceID);
    const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 });
    this.state = {
      dataSource,
      occurrences: null,
      source,
    };
  }

  componentDidMount() {
    this._getOccurrences();
  }

  componentWillUnmount() {
    this.shouldFetch = false;
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSectionHeader={this._renderSectionHeader}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>
    );
  }

  _renderSectionHeader = (occurrences: Object, sectionID: any) => {
    const { source } = this.state;
    const book = Book.findByID(sectionID);
    const occurrenceCount = occurrences.length;
    const colors = source.colorsForBook(book);

    return (
      <View style={[styles.listItemHeader, { borderTopColor: colors.tint }]}>
        <Text style={StyleSheet.styles.cell.titlebold}>{book.name}</Text>
        <Text style={StyleSheet.styles.cell.subtitle}>
          {Localizable.t('occurrences.count', { count: occurrenceCount, localizedCount: Localizable.toNumber(occurrenceCount, { precision: 0 }) })}
        </Text>
      </View>
    );
  };

  _renderRow = (occurrence: Object, sectionID: any, rowID: any) => {
    const { occurrences } = this.state;
    const occurrenceIndex = parseInt(rowID);
    const number = occurrenceIndex + 1;
    const book = occurrence.book;
    const role = occurrence.role;

    const bcvReference = Localizable.t('bcv-reference', { book: book.name, reference: occurrence.reference });
    const bsoReference = Localizable.t('bso-reference', { book: book.name, source: occurrence.name, number: occurrence.number });

    const route = readerURL({
      bookID: book.id,
      anchor: `source-${occurrence.name}-${occurrence.number}`,
      title: book.name,
      description: bsoReference,
      occurrenceIndex,
      occurrences,
    });

    return (
      <TouchableOpacity key={occurrence.id} style={styles.listItemContainer} onPress={() => this._navigate(route)}>
        <Text style={StyleSheet.styles.cell.occurrence}>{number}</Text>
        <View style={styles.listItem}>
          <Text numberOfLines={2} style={styles.body}>
            {occurrence.text}
          </Text>
          <Text style={StyleSheet.styles.cell.subtitle}>{bcvReference}</Text>
          <Text style={[StyleSheet.styles.cell.subtitle, { color: Colors.sources[role.key].tint }]}>
            {Localizable.t('so-reference', { source: occurrence.name, number: occurrence.number })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  _navigate = (route: Object) => {
    this.props.navigate(route, { replace: true });
  };

  async _getOccurrences() {
    const { source } = this.state;
    const query = new Query(source);
    let occurrences = await query.occurrences(source);

    const contents = {};
    for (let occurrence of occurrences) {
      const content = await Emdros.scripture({ monadSet: occurrence.monadSet, stylesheet: 'occurrence' });
      contents[occurrence.id] = content;
    }
    occurrences = occurrences.map(occurrence => ({ ...occurrence, role: occurrence.role, reference: occurrence.reference, text: contents[occurrence.id] }));

    const books = {};
    occurrences.reduce((books, occurrence) => {
      const bookID = occurrence.book.id;
      const values = books[bookID] || [];
      books[bookID] = [...values, occurrence];
      return books;
    }, books);

    const sections = Book.whereIn(Object.keys(books), { sorted: true }).map(book => book.id);

    if (this.shouldFetch) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(books, sections),
        occurrences,
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  listItemContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  listItemHeader: {
    borderTopWidth: 2,
    borderTopColor: 'green',
    paddingLeft: 15,
    paddingVertical: 8,
    borderBottomColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: 'black',
    shadowOpacity: 0.05,
    shadowRadius: 0.4,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  listItem: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 8,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
  },
  body: {
    paddingBottom: 5,
  },
});
