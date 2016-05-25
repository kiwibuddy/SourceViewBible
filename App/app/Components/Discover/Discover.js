/* @flow */
'use strict';

import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { navigatePush } from '../../Actions';

import {
  Colors,
  StyleSheet,
} from '../../Common';

import Localizable from '../../Common/Localizable';

class Discover extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onButtonPress}>
          <View style={StyleSheet.styles.sectionHeaderContainer}>
              <Text style={StyleSheet.styles.sectionHeaderTitle}>BOOKS</Text>
              <View style={styles.sectionHeaderDetail}>
                <Text style={[StyleSheet.styles.sectionHeaderTitle, {color: Colors.tintColor}]}>View All</Text>
                <Image source={require('../../Images/common/disclosure.png')}  style={styles.disclosure} />
              </View>
            </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 58,
    paddingLeft: 8,
  },
  sectionHeaderContainer: {
    ...StyleSheet.styles.sectionHeaderContainer,
    backgroundColor: 'red',
    borderBottomWidth: 0,
    borderBottomColor: 'red',
  },
  disclosure: {
    width: 15,
    height: 15,
    marginTop: 8,
    marginLeft: 5,
    marginRight: -10,
  },
  sectionHeaderDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = (state) => {
  return {

  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onButtonPress: () => {
      dispatch(navigatePush({
        key: 'books',
        title: Localizable.t('books')
      }));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Discover);
