/* @flow */
'use strict';

import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
          <View style={styles.sectionHeaderContainer}>
            <Text style={StyleSheet.styles.sectionHeaderTitle}>BOOKS</Text>
            <Text style={[StyleSheet.styles.sectionHeaderTitle, {color: Colors.tintColor}]}>View All</Text>
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
  },
	title: {
		fontSize: 24,
		fontWeight: '500',
		color: '#CF1E00',
		marginBottom: 30
	},
  sectionHeaderContainer: {
    height: 30,
    alignItems: 'center',
    flexDirection: 'row',
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
