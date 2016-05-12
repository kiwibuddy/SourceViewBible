/* @flow */
'use strict';

import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { navigatePush } from '../../Actions';

import StyleSheet from '../../Common/StyleSheet'
import Localizable from '../../Common/Localizable';

class Discover extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onButtonPress}>
          <Text style={styles.title}>Books</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
	title: {
		fontSize: 24,
		fontWeight: '500',
		color: '#CF1E00',
		marginBottom: 30
	}
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
