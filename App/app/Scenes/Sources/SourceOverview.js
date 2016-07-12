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

import Icon from '../../Components/Common/Icon';

export default class SourceOverview extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={StyleSheet.styles.wordCloud}>
          <View style={styles.sourceBackgroundContainer}>
            <Image style={styles.sourceBackground} source={require('../../Images/sources/avatar-background.png')} />
          </View>
          <View style={styles.sourceIconContainer}>
            <Icon
              name={'avatar-human-group'}
              size={100}
              style={[styles.sourceIcon, {color: 'red'}]}
            />
          </View>
        </View>
        <View style={[StyleSheet.styles.statisticsContainer, {marginTop: 25}]}>
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
        <View style={styles.listContainer}>
          <View style={StyleSheet.styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Word</Text>
            <Text style={StyleSheet.styles.cell.valuetitle}>0</Text>
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
  sourceBackgroundContainer: {
    alignSelf: 'center',
    marginTop: 100,
  },
  sourceIconContainer: {
    alignSelf: 'center',
    marginTop: -114,
    backgroundColor: 'transparent',
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
  },
});
