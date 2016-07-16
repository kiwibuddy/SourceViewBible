/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ListView,
  RecyclerViewBackedScrollView,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import { BarChart, PieChart } from '../../Components/Charts';

type Props = {
  bible: Object,
  onPressBook: Function,
  sphere: Object,
};

type State = {
  dataSource: any,
};

export default class SphereBooks extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const { sphere } = props;
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.key !== r2.key, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    const books = props.bible.books.slice(0).sort((bookA, bookB) => {
      const bookAWordCount = sphere.bookCounts[bookA.key];
      const bookAPercent = (bookAWordCount / bookA.wordCount);

      const bookBWordCount = sphere.bookCounts[bookB.key];
      const bookBPercent = (bookBWordCount / bookB.wordCount);

      if (bookAPercent == bookBPercent) {
        return bookAWordCount > bookBWordCount ? -1 : 1;
      }
      return bookAPercent > bookBPercent ? -1 : 1;
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(books)
    };
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderHeader={this._renderHeader}
        renderRow={this._renderRow}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={StyleSheet.styles.separator} />}
      />
    );
  }

  _renderHeader = () => {
    const { bible, sphere } = this.props;
    const spherePercent = (sphere.wordCount / bible.wordCount) * 100;

    let oldTestamentWordCount = 0;
    let oldTestamentSphereWordCount = 0;
    let newTestamentWordCount = 0;
    let newTestamentSphereWordCount = 0;
    bible.books.forEach(book => {
      if (book.testament === 0) {
        oldTestamentWordCount += book.wordCount;
        oldTestamentSphereWordCount += sphere.bookCounts[book.key];
      } else {
        newTestamentWordCount += book.wordCount;
        newTestamentSphereWordCount += sphere.bookCounts[book.key];
      }
    });
    const oldTestamentSpherePercent = (oldTestamentSphereWordCount / oldTestamentWordCount) * 100;
    const newTestamentSpherePercent = (newTestamentSphereWordCount / newTestamentWordCount) * 100;

    return (
      <View>
        <View style={StyleSheet.styles.statisticsContainer}>
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Whole Bible</Text>
          </View>
          <View style={StyleSheet.styles.statisticKeyline} />
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toPercentage(oldTestamentSpherePercent, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Old Testament</Text>
          </View>
          <View style={StyleSheet.styles.statisticKeyline} />
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toPercentage(newTestamentSpherePercent, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>New Testament</Text>
          </View>
          <View style={StyleSheet.styles.statisticKeyline} />
        </View>
        <View style={styles.sphereBooksGraph} />
      </View>
    );
  };

  _renderRow = (book: Object) => {
    const { sphere } = this.props;
    const wordCount = sphere.bookCounts[book.key];
    const spherePercent = (wordCount / book.wordCount) * 100;

    return (
      <TouchableOpacity style={styles.section} onPress={() => this.props.onPressBook({sphere, book})}>
        <View style={[styles.sourcesCellContainer, {paddingVertical: 12}]}>
          <View style={styles.sourcesLeftContainer}>
            <Text style={StyleSheet.styles.cell.title}>{book.name}</Text>
          </View>
          <View style={styles.sourcesRightContainer}>
            <BarChart
              bars={[{color: Colors.tintColor, value: spherePercent}]}
              deltaStyle={styles.barChartDelta}
              maxChartValue={100}
              style={styles.sourcesBarChart}
            />
            <View style={styles.dataPair}>
              <Text style={[StyleSheet.styles.cell.percentage, {color: Colors.tintColor}]}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text>
              <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('words.count', {count: wordCount, localizedCount: Localizable.toNumber(wordCount, {precision: 0})})}</Text>
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
  sphereBooksGraph: {
    height: 200,
    borderBottomColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 0.4,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  sectionHeaderContainer: {
    ...StyleSheet.styles.sectionHeaderContainer,
    marginLeft: 8,
    backgroundColor: 'transparent',
  },
  section: {
    marginLeft: 8,
  },
  sourcesCellContainer: {
    flex: 1,
    marginRight: 15,
    flexDirection: 'row',
  },
  sourcesLeftContainer: {
    flex: 1.5,
    flexDirection: 'row',
    paddingTop: 2,
  },
  sourcesRightContainer: {
    flex: 2,
  },
  sourceAvatar: {
    width: 20,
    height: 20,
    marginRight: 5
  },
  dataPair: {
    flex: 1,
    flexDirection: 'row',
  },
  sourcesBarChart: {
    flex: 0,
    height: 4,
    marginBottom: 7,
  },
  barChartDelta: {
    backgroundColor: '#ffdcda',
  },
});
