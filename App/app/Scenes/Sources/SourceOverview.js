/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

export default class SourceOverview extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.wordCloud}>
          <Image style={styles.avatarBackground} source={require('../../Images/sources/avatar-background.png')} />
        </View>
        <View style={styles.statisticsContainer}>
          <TouchableOpacity style={styles.statisticContainer}>
            <Text style={styles.statisticTitle}>0</Text>
            <Text style={styles.statisticSubtitle}>Book</Text>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity style={styles.statisticContainer}>
            <Text style={styles.statisticTitle}>0</Text>
            <Text style={styles.statisticSubtitle}>Conversations</Text>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity style={styles.statisticContainer}>
            <Text style={styles.statisticTitle}>0</Text>
            <Text style={styles.statisticSubtitle}>Words</Text>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity style={styles.statisticContainer}>
            <Text style={styles.statisticTitle}>0</Text>
            <Text style={styles.statisticSubtitle}>Spheres</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wordCloud: {
    height: 200,
    backgroundColor: 'red',
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 0.4,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  avatarBackground: {
    alignSelf: 'center',
    marginTop: 100,
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
  },
  statisticTitle: {
    fontSize: 24,
    color: Colors.tintColor,
    alignSelf: 'center'
  },
  statisticSubtitle: {
    flex: 1,
    color: Colors.subtitle,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  keyline: {
    flex:0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator
  },
});
