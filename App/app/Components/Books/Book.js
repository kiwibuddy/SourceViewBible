/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, { View, Text, ScrollView, TouchableOpacity, NavigationExperimental } from 'react-native';
const { Header: NavigationHeader } = NavigationExperimental;
import { connect } from 'react-redux';

import StyleSheet from '../../Common/StyleSheet';
import Colors from '../../Common/Colors';
import Platform from '../../Common/Platform';
import Localizable from '../../Common/Localizable';

import StackedBarChart from '../Charts/StackedBarChart';

class Book extends Component {
  render() {
    return(
      <View style={styles.container}>
        <StackedBarChart
          style={styles.stackedBarChartHeader}
          horizontal={true}
          data={[{black: 0, red: 0, green: 0, blue: 0}]}
        />
        <View style={styles.sourceFilterContainer}>
          <TouchableOpacity style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, {color: Colors.sources.black}]}>0%</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.black}]}>
              <Text style={[styles.roundButtonTitle, {color: Colors.sources.black}]}>{Localizable.t('sources.narrator').toLocaleUpperCase()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, {color: Colors.sources.red}]}>0%</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.red}]}>
              <Text style={[styles.roundButtonTitle, {color: Colors.sources.red}]}>{Localizable.t('sources.god').toLocaleUpperCase()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, {color: Colors.sources.green}]}>0%</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.green}]}>
              <Text style={[styles.roundButtonTitle, {color: Colors.sources.green}]}>{Localizable.t('sources.lead').toLocaleUpperCase()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, {color: Colors.sources.blue}]}>0%</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.blue}]}>
              <Text style={[styles.roundButtonTitle, {color: Colors.sources.blue}]}>{Localizable.t('sources.support').toLocaleUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeaderTitle}>{Localizable.t('introduction').toLocaleUpperCase()}</Text>
            </View>
            <Text style={styles.sectionText}>Though Amos’s perspective is reflected in the (black) words of the Narrator we only hear his voice directly in eight (green) passages. Read through these passages and you discover some interesting...</Text>
            <Text style={styles.sectionMore}>more</Text>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeaderTitle}>SOURCES</Text>
            </View>
            <View style={styles.sectionHeaderShadow}></View>
            <View style={styles.sourcesCellContainer}>
              <View style={styles.sourcesLeftContainer}>
                <View style={styles.sourceAvatar}></View>
                <Text style={styles.cellTitle}>Narrator</Text>
              </View>
              <View style={styles.sourcesRightContainer}>
                <StackedBarChart
                  style={styles.sourcesStackedBarChart}
                  horizontal={true}
                  data={[{black: 0, red: 0, green: 0, blue: 0}]}
                />
                <Text style={styles.cellSubTitle}>100 words</Text>
              </View>
            </View>
            <View style={styles.separator}></View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeaderTitle}>9 CHAPTERS</Text>
              <Text style={styles.sectionHeaderTitle}>28min read</Text>
            </View>
            <View style={styles.sectionHeaderShadow}></View>
            <View style={styles.cellContainer}>
              <View style={styles.horizontalContainer}>
                <View style={styles.leftContainer}>
                  <Text style={styles.cellTitle}>Chapter 1</Text>
                </View>
                <View style={styles.rightContainer}>
                  <StackedBarChart
                    style={styles.stackedBarChart}
                    horizontal={true}
                    data={[{black: 0, red: 0, green: 0, blue: 0}]}
                  />
                </View>
              </View>
              <View style={styles.horizontalContainer}>
                <View style={styles.leftContainer}>
                  <Text style={styles.cellSubTitle}>0 min</Text>
                </View>
                <View style={styles.rightContainer}>
                  <Text style={styles.cellSubTitle}>{Localizable.t('sources.count', {count: 0})}</Text>
                  </View>
              </View>
            </View>
            <View style={styles.separator}></View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeaderTitle}>7 SPHERES</Text>
            </View>
            <View style={styles.sectionHeaderShadow}></View>
            <View style={styles.cellContainer}>
              <View style={styles.horizontalContainer}>
                <View style={styles.leftContainer}>
                  <Text style={styles.cellTitle}>Chapter 1</Text>
                </View>
                <View style={styles.rightContainer}>
                  <Text style={styles.cellSubTitle}>7 spheres</Text>
                </View>
              </View>
            </View>
            <View style={styles.separator}></View>
          </View>
        </ScrollView>
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
  stackedBarChartHeader: {
    height: 3,
    flex: 0,
  },
  sourceFilterContainer: {
    flexDirection: 'row',
    marginHorizontal: 9,
    marginVertical: 10,
  },
  sourceButtonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  sourceButtonTitle: {
    fontSize: 25,
    fontWeight: '300',
    marginBottom: 5,
    alignSelf: 'center',
  },
  roundButton: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  roundButtonTitle: {
    fontSize: 11,
  },
  section: {
    marginLeft: 15,
  },
  sectionHeaderShadow: {
    borderBottomWidth: 2,
    borderBottomColor: '#f4f7f9',
  },
  sectionText: {
    marginVertical: 8,
    lineHeight: 20,
  },
  sectionMore: {
    color: Colors.tintColor,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  sourcesCellContainer: {
    flex: 1,
    marginRight: 15,
    paddingVertical: 12,
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
  sourceAvatar: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    marginRight: 10,
  },
  sourcesStackedBarChart: {
    height: 4,
    flex: 0,
    marginBottom: 7,
  },
  cellContainer: {
    flex: 1,
    marginRight: 15,
    paddingVertical: 4,
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
  ...Platform.select({
      ios: {
      },
      android: {
      },
  })
});

const mapStateToProps = (state) => {
  return {

  };
}

const mapDispatchToProps = (dispatch) => {
  return {

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Book);
