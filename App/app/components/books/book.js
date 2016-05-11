/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, { View, Text, NavigationExperimental } from 'react-native';
const { Header: NavigationHeader } = NavigationExperimental;
import { connect } from 'react-redux';

import StyleSheet from '../../common/stylesheet';
import Colors from '../../common/colors';
import Platform from '../../common/platform';

class Book extends Component {
  render() {
    return(
      <View style={styles.container}>
        <View style={styles.sourceFilterContainer}>
          <View style={styles.sourceButtonContainer}>
          <Text style={[styles.sourceButtonTitle, {color: Colors.sources.black}]}>37%</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.black}]}>
            <Text style={[styles.roundButtonTitle, {color: Colors.sources.black}]}>NARRATOR</Text>
            </View>
          </View>
          <View style={styles.sourceButtonContainer}>
          <Text style={[styles.sourceButtonTitle, {color: Colors.sources.red}]}>37%</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.red}]}>
            <Text style={[styles.roundButtonTitle, {color: Colors.sources.red}]}>GOD</Text>
            </View>
          </View>
          <View style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, {color: Colors.sources.green}]}>37%</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.green}]}>
            <Text style={[styles.roundButtonTitle, {color: Colors.sources.green}]}>LEAD</Text>
            </View>
          </View>
          <View style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, {color: Colors.sources.blue}]}>37%</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.blue}]}>
              <Text style={[styles.roundButtonTitle, {color: Colors.sources.blue}]}>SUPPORT</Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderTitle}>INTRODUCTION</Text>
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
  sectionHeaderContainer: {
    marginLeft: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c7cc',
    paddingBottom: 6,
    backgroundColor: 'white',
  },
  sectionHeaderTitle: {
    color: '#cf1e00',
    marginTop: 8,
    fontSize: 13,
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
