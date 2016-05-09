/* @flow */
'use strict';

import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { navigatePush } from '../../actions';

import StyleSheet from '../../common/stylesheet'
import Localizable from '../../common/localizable';

class Discover extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onButtonPress}>
          <Text style={styles.title}>Hello</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center'
  },
	title: {
		fontSize: 24,
		fontWeight: '500',
		color: '#ffffff',
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
