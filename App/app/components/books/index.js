/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, { View, Text, Platform, SegmentedControlIOS, NavigationExperimental, StyleSheet } from 'react-native';

const {
  Header: NavigationHeader
} = NavigationExperimental;

import { connect } from 'react-redux';

class Books extends Component {
  render() {
    let segmentedControl;
    if (Platform.OS === 'ios') {
      segmentedControl = <SegmentedControlIOS
        style={styles.segmentedControl}
        values={['Textual', 'Alphabetical', 'Principality']}
      />
    }
    return (
      <View style={styles.container}>
        {segmentedControl}
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
