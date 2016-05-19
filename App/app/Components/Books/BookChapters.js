/* @flow */
'use strict';

import React, { Component } from 'react';

import ReactNative, {
  View,
  Text,
  ScrollView,
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
} from '../../Common';

import { SourcesBarChart, SpheresBarChart } from '../Charts';

class BookChapters extends Component {
  render() {
    return (
      <View style={styles.container}>
      <View style={styles.section}>
        <View style={StyleSheet.styles.sectionHeaderContainer}>
          <Text style={StyleSheet.styles.sectionHeaderTitle}>0 CHAPTERS</Text>
          <View style={styles.sectionHeaderDetail}>
            <Text style={StyleSheet.styles.sectionHeaderTitle}>0 min read</Text>
            <Image source={require('../../Images/common/disclosure.png')}  style={[styles.disclosure, styles.disclosureDown]} />
          </View>
        </View>
        <View style={styles.sectionHeaderShadow}></View>
        <View style={[styles.cellContainer, {paddingVertical: 8}]}>
          <View style={styles.horizontalContainer}>
            <View style={styles.leftContainer}>
              <Text style={StyleSheet.styles.cell.title}>Chapter 1</Text>
            </View>
            <View style={styles.rightContainer}>
              <SourcesBarChart
                style={styles.stackedBarChart}
                data={[{narrator: 1, god: 1, lead: 1, support: 1}]}
              />
            </View>
          </View>
          <View style={styles.horizontalContainer}>
            <View style={styles.leftContainer}>
              <Text style={StyleSheet.styles.cell.subtitle}>0 min</Text>
            </View>
            <View style={styles.rightContainer}>
              <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('sources.count', {count: 0})}</Text>
              </View>
          </View>
        </View>
        <View style={StyleSheet.styles.separator}></View>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: NavigationHeader.HEIGHT,
  },
  section: {
    marginLeft: 15,
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
});

export default BookChapters;
