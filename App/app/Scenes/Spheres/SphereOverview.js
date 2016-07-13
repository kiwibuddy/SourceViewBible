/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import Icon from '../../Components/Common/Icon';

export default class SphereOverview extends Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.carouselContainer}>
        </View>
        <View style={styles.carouselGraphContainer}>
          <View style={[styles.carouselGraph, {width: 150}]} />
        </View>
        <View style={StyleSheet.styles.statisticsContainer}>
          <TouchableOpacity style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitle}>0</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Books</Text>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitle}>0</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Sources</Text>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitle}>0</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Words</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.readButton}>
          <Text style={styles.readButtonTitle}>Explore 52 key passages</Text>
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Text style={[styles.contentBody, {marginBottom: -25, marginTop: -10}]}>Introduction</Text>
          <Text style={styles.contentHeader}>How Family Shows Up in Scripture</Text>
          <Text style={[styles.contentBody, {marginTop: 5}]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu imperdiet ipsum, at pellentesque arcu. Quisque eleifend enim id felis semper, id euismod dolor hendrerit. Sed fringilla dui eget enim pulvinar, vitae consequat dui bibendum. Maecenas nulla odio.</Text>
        </View>
        <View style={styles.listContainer}>
          <View style={styles.listItemHeader}>
            <Text style={StyleSheet.styles.cell.titlebold}>Top Books</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.section}>
          <View style={[styles.sourcesCellContainer, {paddingVertical: 12}]}>
            <View style={styles.sourcesLeftContainer}>
              <Text style={StyleSheet.styles.cell.titlemedium}>Book Name</Text>
            </View>
            <View style={styles.sourcesRightContainer}>
              <View style={[styles.sourcesBarChart, {height: 4, backgroundColor: '#EDEDED'}]} />
              <View style={styles.dataPair}>
                <Text style={[StyleSheet.styles.cell.percentage, {color: 'red'}]}>0%</Text>
                <Text style={StyleSheet.styles.cell.subtitle}>0 words</Text>
              </View>
            </View>
          </View>
          <View style={[StyleSheet.styles.separator, {marginLeft: 0}]}></View>
        </TouchableOpacity>
        <TouchableOpacity style={StyleSheet.styles.listItem}>
          <Text style={StyleSheet.styles.cell.titlemore}>View More</Text>
          <Image source={require('../../Images/common/disclosure.png')}  style={styles.disclosure} />
        </TouchableOpacity>
        <View style={styles.listContainer}>
          <View style={styles.listItemHeader}>
            <Text style={StyleSheet.styles.cell.titlebold}>Top Sources</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.section}>
          <View style={[styles.sourcesCellContainer, {paddingVertical: 12}]}>
            <View style={styles.sourcesLeftContainer}>
              <Icon
                name={'avatar-human-group'}
                style={[styles.sourceAvatar, {color: 'red'}]}
                size={20}
              />
              <Text style={StyleSheet.styles.cell.titlemedium}>Source Name</Text>
            </View>
            <View style={styles.sourcesRightContainer}>
              <View style={[styles.sourcesBarChart, {height: 4, backgroundColor: '#EDEDED'}]} />
              <View style={styles.dataPair}>
                <Text style={[StyleSheet.styles.cell.percentage, {color: 'red'}]}>0%</Text>
                <Text style={StyleSheet.styles.cell.subtitle}>0 words</Text>
              </View>
            </View>
          </View>
          <View style={[StyleSheet.styles.separator, {marginLeft: 0}]}></View>
        </TouchableOpacity>
        <TouchableOpacity style={StyleSheet.styles.listItem}>
          <Text style={StyleSheet.styles.cell.titlemore}>View More</Text>
          <Image source={require('../../Images/common/disclosure.png')}  style={styles.disclosure} />
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    height: 250,
    backgroundColor: '#E1E9EE',
  },
  carouselGraphContainer: {
    height: 2,
    backgroundColor: '#D8D8D8',
  },
  carouselGraph: {
    height: 2,
    backgroundColor: 'red',
  },
  keyline: {
    flex:0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator
  },
  readButton: {
    backgroundColor: Colors.tintColor,
    borderColor: Colors.tintColor,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    overflow:'hidden',
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
    justifyContent: 'center',
  },
  readButtonTitle: {
    color: 'white',
    fontSize: 18,
    marginVertical: 20,
    marginHorizontal: 40,
  },
  contentContainer: {
    marginHorizontal: 20,
    marginBottom: 35,
  },
  contentHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#59626a',
    marginTop: 25,
  },
  contentBody: {
    fontSize: 16,
    lineHeight: 26,
    color: '#59626a',
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
    paddingVertical: 15,
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
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
  },
  section: {
    marginLeft: 15,
  },
  sourcesCellContainer: {
    flex: 1,
    marginRight: 15,
    flexDirection: 'row',
  },
  sourcesLeftContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 2,
  },
  sourcesRightContainer: {
    flex: 1,
  },
  dataPair: {
    flex: 1,
    flexDirection: 'row',
  },
  sourceAvatar: {
    width: 20,
    height: 20,
    marginRight: 5
  },
  sourcesBarChart: {
    height: 4,
    flex: 0,
    marginBottom: 7,
  },
});
