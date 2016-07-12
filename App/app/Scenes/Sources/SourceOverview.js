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
              style={[styles.sourceIcon, {color: 'black'}]}
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
          <View style={styles.listItemContainer}>
            <Icon
              name={'avatar-human-group'}
              size={20}
              style={[styles.listItemIcon, {color: '#59626A'}]}
            />
            <View style={styles.listItem}>
              <Text style={StyleSheet.styles.cell.title}>Meta Data Title</Text>
              <Text style={StyleSheet.styles.cell.valuetitle}>Value</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
        <View style={styles.listContainer}>
          <View style={styles.listItemHeader}>
            <Text style={StyleSheet.styles.cell.titlebold}>Source spoke to</Text>
            <View style={styles.horizontalContainer}>
              <View style={styles.leftContainer}>
                <Text style={StyleSheet.styles.cell.subtitle}>0 sources</Text>
              </View>
              <View style={styles.rightContainer}>
                <Text style={StyleSheet.styles.cell.subtitle}>0 occurrences</Text>
                </View>
            </View>
          </View>
          <View style={styles.listItemContainer}>
            <Icon
              name={'avatar-human-group'}
              size={20}
              style={[styles.listItemIcon, {color: '#59626A'}]}
            />
            <View style={styles.listItem}>
              <Text style={StyleSheet.styles.cell.title}>Meta Data Title</Text>
              <Text style={StyleSheet.styles.cell.valuetitle}>Value</Text>
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
  sourceBackgroundContainer: {
    alignSelf: 'center',
    marginTop: 100,
  },
  sourceIconContainer: {
    alignSelf: 'center',
    marginTop: -114,
    backgroundColor: 'transparent',
  },
  listItemContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 5,
    flexDirection: 'row',
  },
  listItemHeader: {
    borderTopWidth: 2,
    borderTopColor: 'red',
    paddingLeft: 15,
    paddingVertical: 8,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 0.4,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  listItemIcon: {
    alignSelf: 'center',
    paddingRight: 10,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
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
});
