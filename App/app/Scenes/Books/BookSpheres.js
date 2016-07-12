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

export default class BookSpheres extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statisticsContainer}>
          <View style={styles.statisticContainer}>
            <Text style={styles.statisticTitle}>0</Text>
            <Text style={styles.statisticSubtitle}>Words</Text>
          </View>
          <View style={styles.keyline} />
          <View style={styles.statisticContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.statisticTitle}>7</Text>
              <View style={styles.SpheresBarChart}></View>
            </View>
            <Text style={styles.statisticSubtitle}>Spheres</Text>
          </View>
        </View>
        <View style={styles.listContainer}>
          <View style={styles.listItemContainer}>
            <View style={styles.pie}><Text style={styles.pieText}>0%</Text></View>
            <View style={styles.listItem}>
              <Text style={StyleSheet.styles.cell.title}>Family</Text>
              <Text style={StyleSheet.styles.cell.valuetitle}>0 words</Text>
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
  statisticsContainer: {
    flex: 0,
    flexDirection: 'row',
    marginTop: 5,
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
  statisticContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  statisticTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#59626A',
    alignSelf: 'center'
  },
  statisticSubtitle: {
    fontSize: 13,
    color: '#9B9B9B',
    alignSelf: 'center'
  },
  keyline: {
    flex:0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator
  },
  listItemContainer: {
    paddingLeft: 8,
    paddingRight: 15,
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
