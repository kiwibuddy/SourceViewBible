/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  AsyncStorage,
  Platform,
  RecyclerViewBackedScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ListView } from '../../../Components/Common/DatabaseListView';

import {
  Colors,
  Constants,
  StyleSheet,
  Localizable
} from '../../../Common';

// $FlowFixMe: - Flow can't find os module extension
import SegmentedControl from '../../../Components/Common/SegmentedControl';

const SEGMENTS = [Localizable.t('textual'), Localizable.t('alphabetical')];
const SEGMENT_INDEXES = {
  TEXT: 0,
  ALPHABETICAL: 1,
};

const LISTVIEW_REF = 'LISTVIEW_REF';

import { cardWithFilter } from './FilterUtils';

import { Book } from '../../../Database';

type Props = {
  card: Object,
  filter: Object,
  item: Object,
  navigate: Function,
  onDone: Function,
};

type State = {
  dataSource: any,
  selectedSegmentIndex: number,
};

export default class Books extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      dataSource: dataSource,
      selectedSegmentIndex: SEGMENT_INDEXES.TEXT
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
          tintColor={Colors.tint}
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
      <TouchableOpacity key={book.id} style={StyleSheet.styles.listItem} onPress={() => this._filterBook(book)}>
        <Text style={StyleSheet.styles.cell.title}>{book.name}</Text>
      </TouchableOpacity>
    );
  };

  _getDataSource = (segmentIndex: number) => {
    switch (segmentIndex) {
      case SEGMENT_INDEXES.ALPHABETICAL:
        return this.state.dataSource.cloneWithRowsAndSections({alphabetical: Book.all().sorted('name')});

      default:
        return this.state.dataSource.cloneWithRowsAndSections({textOrder: Book.all().sorted('textOrder')});
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

  _filterBook = (book: Object) => {
    const filter = {
      id: 'filter-' + Date.now(),
      type: 'book',
      ...this.props.filter,
    };

    if (this.props.filter && this.props.filter.type === 'book-range') {
      const { books } = this.props.filter;
      if (this.props.item === 'from') {
        filter.books = {
          ...filter.books,
          from: book.id,
        };
      } else {
        filter.books = {
          ...filter.books,
          to: book.id,
        };
      }
    } else {
      filter.book = book.id;
    }

    this.props.onDone(cardWithFilter(this.props.card, filter));
  };
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
          marginBottom: 8,
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
