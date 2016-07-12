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

const OLD_TESTAMENT_BOOKS = Bible.filter((book) => {
  return book.testament === 0;
});

const NEW_TESTAMENT_BOOKS = Bible.filter((book) => {
  return book.testament === 1;
});

type State = {
  dataSource: any,
  selectedSegmentIndex: number,
};

export default class Books extends Component {
  state: State;

  constructor(props: any) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      dataSource: dataSource,
      selectedSegmentIndex: 0
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections({old: OLD_TESTAMENT_BOOKS, new: NEW_TESTAMENT_BOOKS})
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
          onValueChange={(value) => console.log('selectedIndex: ' + SEGMENTS.indexOf(value))}
        />

        <ListView
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
      <TouchableOpacity style={styles.section} onPress={() => {}}>
        <View style={[styles.cellContainer, {paddingVertical: 8}]}>
          <View style={styles.horizontalContainer}>
            <View style={styles.leftContainer}>
              <Text style={StyleSheet.styles.cell.title}>{book.name}</Text>
            </View>
            <View style={styles.rightContainer}>
              <SourcesBarChart
                style={styles.stackedBarChart}
                data={[book.sourceTypeCounts]}
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
    flex: 1,
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
