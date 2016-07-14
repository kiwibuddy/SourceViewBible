/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ListView,
  RecyclerViewBackedScrollView,
  Text,
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import { SourcesBarChart, SpheresBarChart } from '../../Components/Charts';

const Bible = require('../../Locale/en/NLT/SourceView.json');

type Props = {
  book: Object,
};

type State = {
  dataSource: any
};

export default class BookSpheres extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.key !== r2.key, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    const spheres = Bible.spheres.map(sphere => {
      return ({...sphere, bookWordCount: props.book.sphereCounts[sphere.key]});
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(spheres)
    };
  }

  render() {
    const { book } = this.props;
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderHeader={this._renderHeader}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>
    );
  }

  _renderHeader = (props: any) => {
    const { book } = this.props;
    const spherePercent = (book.sphereWordCount / book.wordCount) * 100;

    return (
      <View style={StyleSheet.styles.statisticsContainer}>
        <View style={StyleSheet.styles.statisticContainer}>
          <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toNumber(book.sphereWordCount, {precision: 0})}</Text>
          <Text style={StyleSheet.styles.statisticSubtitle}>Words</Text>
        </View>
        <View style={StyleSheet.styles.statisticKeyline} />
        <View style={StyleSheet.styles.statisticContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text>
            <SpheresBarChart
              style={{flex: 0, marginLeft: 4}}
              barStyle={{width: 4, height: 24, marginHorizontal: 2}}
              horizontal={false}
              data={[{family: book.sphereCounts.family}, {economics: book.sphereCounts.economics}, {government: book.sphereCounts.government}, {religion: book.sphereCounts.religion}, {education: book.sphereCounts.education}, {communication: book.sphereCounts.communication}, {celebration: book.sphereCounts.celebration}]}
            />
          </View>
          <Text style={StyleSheet.styles.statisticSubtitle}>Spheres</Text>
        </View>
      </View>
    );
  };

  _renderRow = (sphere: Object) => {
    const { book } = this.props;
    const wordCount = sphere.bookWordCount;
    const spherePercent = (wordCount / book.sphereWordCount) * 100;

    return (
      <View style={styles.listItemContainer}>
        <View style={styles.pie}><Text style={styles.pieText}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text></View>
        <View style={styles.listItem}>
          <Text style={StyleSheet.styles.cell.title}>{sphere.name}</Text>
          <Text style={StyleSheet.styles.cell.valuetitle}>{Localizable.t('words.count', {count: wordCount, localizedCount: Localizable.toNumber(wordCount, {precision: 0})})}</Text>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItemContainer: {
    paddingLeft: 8,
    paddingRight: 15,
    paddingVertical: 5,
    flexDirection: 'row',
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pie: {
    width: 57,
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieText: {
    fontSize: 17,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
    marginLeft: 8,
  },
});
