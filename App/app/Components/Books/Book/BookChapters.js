/* @flow */
'use strict';

import React, { Component } from 'react';

import ReactNative, {
  View,
  Text,
  ListView,
  RecyclerViewBackedScrollView,
  TouchableOpacity,
  NavigationExperimental,
  Image
} from 'react-native';

const { Header: NavigationHeader } = NavigationExperimental;

import {
  Colors,
  StyleSheet,
  Localizable,
  Platform
} from '../../../Common';

// $FlowFixMe: - Flow can't find os module extension
import SegmentedControl from '../../Common/SegmentedControl';

import { SourcesBarChart, SpheresBarChart } from '../../Charts';

import { ReadingTime } from '../../../Common/NumberHelper';

const SEGMENTS = [Localizable.t('sources.text'), Localizable.t('spheres.text')];

class BookChapters extends Component {
  state: {
    dataSource: any,
    selectedSegmentIndex: number
  };

  constructor(props: Object) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      dataSource: dataSource,
      selectedSegmentIndex: 0
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.props.book.chapters)
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
    const { book } = this.props;
    const chapterNumber = chapter.chapterNumber;

    return (
      <TouchableOpacity style={styles.section} onPress={() => this.props.onPressScripture({book, chapterNumber})}>
        <View style={[styles.cellContainer, {paddingVertical: 8}]}>
          <View style={styles.horizontalContainer}>
            <View style={styles.leftContainer}>
              <Text style={StyleSheet.styles.cell.title}>Chapter {chapterNumber}</Text>
            </View>
            <View style={styles.rightContainer}>
              <SourcesBarChart
                style={styles.stackedBarChart}
                data={[chapter.sourceTypeCounts]}
                maxChartValue={book.maxChapterWordCount}
              />
            </View>
          </View>
          <View style={styles.horizontalContainer}>
            <View style={styles.leftContainer}>
              <Text style={StyleSheet.styles.cell.subtitle}>{ReadingTime(chapter.wordCount)}</Text>
            </View>
            <View style={styles.rightContainer}>
              <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('sources.count', {count: chapter.sourceCount})}</Text>
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
    backgroundColor: '#fff',
    marginTop: NavigationHeader.HEIGHT,
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

export default BookChapters;
