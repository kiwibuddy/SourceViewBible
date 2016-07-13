/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Text,
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import { SourcesBarChart, SpheresBarChart } from '../../Components/Charts';

type Props = {
  book: Object,
};

export default class BookSpheres extends Component {
  render() {
    const { book } = this.props;

    return (
      <View style={styles.container}>
        <View style={StyleSheet.styles.statisticsContainer}>
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toNumber(book.sphereWordCount, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Words</Text>
          </View>
          <View style={StyleSheet.styles.statisticKeyline} />
          <View style={StyleSheet.styles.statisticContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toNumber(book.sphereCount, {precision: 0})}</Text>
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
        <View style={styles.listContainer}>
          <View style={styles.listItemContainer}>
            <View style={styles.pie}><Text style={styles.pieText}>0%</Text></View>
            <View style={styles.listItem}>
              <Text style={StyleSheet.styles.cell.title}>Family</Text>
              <Text style={StyleSheet.styles.cell.valuetitle}>{Localizable.t('words.count', {count: 0, localizedCount: Localizable.toNumber(0, {precision: 0})})}</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </View>
    );
  }
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
