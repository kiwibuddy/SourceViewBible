/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, { View, Text, NavigationExperimental } from 'react-native';
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
          style={styles.stackedBarChart}
          horizontal={true}
          data={[{black: 200, red: 300, green: 100, blue: 40}]}
        />
        <View style={styles.sourceFilterContainer}>
          <View style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, {color: Colors.sources.black}]}>37%</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.black}]}>
              <Text style={[styles.roundButtonTitle, {color: Colors.sources.black}]}>{Localizable.t('narrator').toLocaleUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, {color: Colors.sources.red}]}>37%</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.red}]}>
              <Text style={[styles.roundButtonTitle, {color: Colors.sources.red}]}>{Localizable.t('god').toLocaleUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, {color: Colors.sources.green}]}>37%</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.green}]}>
              <Text style={[styles.roundButtonTitle, {color: Colors.sources.green}]}>{Localizable.t('lead').toLocaleUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, {color: Colors.sources.blue}]}>37%</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.blue}]}>
              <Text style={[styles.roundButtonTitle, {color: Colors.sources.blue}]}>{Localizable.t('support').toLocaleUpperCase()}</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderTitle}>{Localizable.t('introduction').toLocaleUpperCase()}</Text>
          </View>
          <Text style={styles.sectionText}>Though Amos’s perspective is reflected in the (black) words of the Narrator we only hear his voice directly in eight (green) passages. Read through these passages and you discover some interesting...</Text>
          <Text style={styles.sectionMore}>more</Text>
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
  stackedBarChart: {
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
  sectionText: {
    marginVertical: 8,
    lineHeight: 20,
  },
  sectionMore: {
    color: Colors.tintColor,
    alignSelf: 'flex-end',
    marginRight: 10,
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
