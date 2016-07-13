/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ListView,
  Platform,
  RecyclerViewBackedScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

// $FlowFixMe: - Flow can't find os module extension
import SegmentedControl from '../../Components/Common/SegmentedControl';
import { SourcesBarChart, SpheresBarChart } from '../../Components/Charts';
import { ReadingTime } from '../../Common/NumberHelper';

const Bible = require('../../Locale/en/NLT/SourceView.json');

const SEGMENTS = [Localizable.t('textual'), Localizable.t('alphabetical'), Localizable.t('principality')];
const SEGMENT_INDEXES = {
  TEXTUAL: 0,
  ALPHABETICAL: 1,
  PRINCIPALITY: 2,
};

const LISTVIEW_REF = 'LISTVIEW_REF';

const OLD_TESTAMENT_BOOKS = Bible.books.filter((book) => {
  return book.testament === 0;
});

const NEW_TESTAMENT_BOOKS = Bible.books.filter((book) => {
  return book.testament === 1;
});

const BOOKS_SORTED_BY_ALPHABET = Bible.books.slice(0).sort((a, b) => a.name > b.name ? 1 : -1);
const BOOKS_SORTED_BY_PRINCIPALITY = Bible.books.slice(0).sort((a, b) => a.wordCount > b.wordCount ? -1 : 1);
const MAX_BOOK_WORD_COUNT = Math.max.apply(Math, Bible.books.map(book => book.wordCount));

type State = {
  dataSource: any,
  selectedSegmentIndex: number,
};

type Props = {
  onPressBook: Function,
};

export default class Books extends Component {
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.key !== r2.key, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      dataSource: dataSource,
      selectedSegmentIndex: SEGMENT_INDEXES.TEXTUAL
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this._getDataSource(this.state.selectedSegmentIndex)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <SegmentedControl
          style={styles.segmentedControl}
          tintColor={Colors.tintColor}
          values={SEGMENTS}
          selectedIndex={this.state.selectedSegmentIndex}
          onValueChange={(value) => this._onSegmentedControlValueChanged(SEGMENTS.indexOf(value))}
        />

        <ListView
          ref="LISTVIEW_REF"
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>
    );
  }

  _renderRow = (book: Object, sectionID: any, rowID: any) => {
    return (
      <TouchableOpacity key={book.key} style={styles.section} onPress={() => this.props.onPressBook(book)}>
        <View style={[styles.cellContainer, {paddingVertical: 8}]}>
          <View style={styles.horizontalContainer}>
            <View style={styles.leftContainer}>
              <Text style={StyleSheet.styles.cell.title}>{book.name}</Text>
            </View>
            <View style={styles.rightContainer}>
              <SourcesBarChart
                style={styles.stackedBarChart}
                data={[book.sourceTypeCounts]}
                maxChartValue={MAX_BOOK_WORD_COUNT}
              />
            </View>
          </View>
          <View style={styles.horizontalContainer}>
            <View style={styles.leftContainer}>
              <Text style={StyleSheet.styles.cell.subtitle}>{ReadingTime(book.wordCount)}</Text>
            </View>
            <View style={styles.rightContainer}>
              <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('sources.count', {count: book.sourceCount})}</Text>
              </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _getDataSource = (segmentIndex: number) => {
    switch (segmentIndex) {
      case SEGMENT_INDEXES.ALPHABETICAL:
        return this.state.dataSource.cloneWithRowsAndSections({alphabetical: BOOKS_SORTED_BY_ALPHABET});

      case SEGMENT_INDEXES.PRINCIPALITY:
        return this.state.dataSource.cloneWithRowsAndSections({principality: BOOKS_SORTED_BY_PRINCIPALITY});

      default:
        return this.state.dataSource.cloneWithRowsAndSections({old: OLD_TESTAMENT_BOOKS, new: NEW_TESTAMENT_BOOKS});
    }
  };

  _onSegmentedControlValueChanged = (value: number) => {
    const listView = this.refs[LISTVIEW_REF];
    listView.scrollTo({y: 0, animated: false});

    this.setState({
      selectedSegmentIndex: value,
      dataSource: this._getDataSource(value)
    });
  };
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginLeft: 8,
  },
  cellContainer: {
    flex: 1,
    marginRight: 15,
  },
  horizontalContainer: {
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1.5,
  },
  rightContainer: {
    flex: 2,
  },
  stackedBarChart: {
    height: 4,
    flex: 0,
    marginTop: 7,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 8,
  },
  ...Platform.select({
      ios: {
        segmentedControl: {
          marginTop: 8,
          marginHorizontal: 8,
          marginBottom: 10,
        },
      },
      android: {
        segmentedControl: {
          shadowColor: 'red',
          elevation: 2,
        },
      },
  })
});
