/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, { View, Text, NavigationExperimental, StyleSheet } from 'react-native';

import SegmentedControl from '../common/segmented-control';

const {
  Header: NavigationHeader
} = NavigationExperimental;

import { connect } from 'react-redux';

class Books extends Component {
  render() {
    return (
      <View style={styles.container}>
        <SegmentedControl style={styles.segmentedControl} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  segmentedControl: {
    marginTop: NavigationHeader.HEIGHT
  }
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
)(Books);
