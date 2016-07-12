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
        <View style={StyleSheet.styles.wordCloud}>
          <Image style={styles.avatarBackground} source={require('../../Images/sources/avatar-background.png')} />
        </View>
        <View style={[StyleSheet.styles.statisticsContainer, {paddingTop: 20}]}>
          <TouchableOpacity style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitle}>0</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Book</Text>
          </TouchableOpacity>
          <View style={StyleSheet.styles.statisticKeyline} />
          <TouchableOpacity style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitle}>0</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Conversations</Text>
          </TouchableOpacity>
          <View style={StyleSheet.styles.statisticKeyline} />
          <TouchableOpacity style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitle}>0</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Words</Text>
          </TouchableOpacity>
          <View style={StyleSheet.styles.statisticKeyline} />
          <TouchableOpacity style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitle}>0</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Spheres</Text>
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
  avatarBackground: {
    alignSelf: 'center',
    marginTop: 100,
  },
});
