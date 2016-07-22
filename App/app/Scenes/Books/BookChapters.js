/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Platform,
  RecyclerViewBackedScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ListView } from '../../Components/Common/DatabaseListView';

import {
  Constants,
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

const {
  SourceType,
  SphereType
} = Constants;

// $FlowFixMe: - Flow can't find os module extension
import SegmentedControl from '../../Components/Common/SegmentedControl';
import { SourcesBarChart, SpheresBarChart } from '../../Components/Charts';
import { ReadingTime } from '../../Common/NumberHelper';

const SEGMENTS = [Localizable.t('sources.text'), Localizable.t('spheres.text')];
const SEGMENT_INDEXES = {
  SOURCES: 0,
  SPHERES: 1,
};

const LISTVIEW_REF = 'LISTVIEW_REF';

import { Book } from '../../Database';

type Props = {
  bookID: string,
  onPressScripture: Function
};

type State = {
  book: Object,
  dataSource: any,
  selectedSegmentIndex: number,
};

export default class BookChapters extends Component {
  props: Props;
  state: State;

  constructor(props: Object) {
    super(props);

    const book = Book.findByID(props.bookID);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      book,
      dataSource: dataSource,
      selectedSegmentIndex: 0
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
          ref={LISTVIEW_REF}
          contentContainerStyle={styles.list}
          dataSource={this.state.dataSource}
          initialListSize={18}
          enableEmptySections={true}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>
    );
  }

  _renderRow = (chapter: Object, sectionID: string, rowID: string, highlightRow: boolean) => {
    const { book } = this.state;
    const chapterNumber = chapter.chapterNumber;

    const chart = (this.state.selectedSegmentIndex === SEGMENT_INDEXES.SPHERES ? this._renderSpheresChart(book, chapter) : this._renderSourcesChart(book, chapter));
    const subtitle = (this.state.selectedSegmentIndex === SEGMENT_INDEXES.SPHERES ? Localizable.t('spheres.count', {count: chapter.sphereCount}) : Localizable.t('sources.count', {count: chapter.sourceCount}) );

    return (
      <TouchableOpacity style={styles.section} onPress={() => this.props.onPressScripture({book, chapterNumber})}>
        <View style={[styles.cellContainer, {paddingVertical: 8}]}>
          <View style={styles.horizontalContainer}>
            <View style={styles.leftContainer}>
              <Text style={StyleSheet.styles.cell.title}>Chapter {chapterNumber}</Text>
            </View>
            <View style={styles.rightContainer}>
              {chart}
            </View>
          </View>
          <View style={styles.horizontalContainer}>
            <View style={styles.leftContainer}>
              <Text style={StyleSheet.styles.cell.subtitle}>{ReadingTime(chapter.wordCount)}</Text>
            </View>
            <View style={styles.rightContainer}>
              <Text style={StyleSheet.styles.cell.subtitle}>{subtitle}</Text>
              </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderSourcesChart = (book: Object, chapter: Object) => {
    return (
      <SourcesBarChart
        style={styles.stackedBarChart}
        data={[chapter.sourceTypeCounts]}
        maxChartValue={book.maxChapterWordCount}
      />
    );
  };

  _renderSpheresChart = (book: Object, chapter: Object) => {
    return (
      <SpheresBarChart
        style={styles.stackedBarChart}
        data={[chapter.sphereCounts]}
        maxChartValue={book.maxChapterSphereWordCount}
      />
    );
  };

  _getDataSource = (segmentIndex: number) => {
    const { book } = this.state;
    switch (segmentIndex) {
      case SEGMENT_INDEXES.SPHERES:
        return this.state.dataSource.cloneWithRowsAndSections({spheres: book.chapters});

      default:
        return this.state.dataSource.cloneWithRowsAndSections({sources: book.chapters});
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
  disclosure: {
    width: 15,
    height: 15,
    marginTop: 8,
    marginLeft: 5,
    marginRight: -5,
  },
  disclosureDown: {
    transform: [{rotate: '90deg'}],
  },
  sectionHeaderDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
