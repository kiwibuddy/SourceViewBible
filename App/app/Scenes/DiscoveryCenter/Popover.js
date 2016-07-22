/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {
  Colors,
  StyleSheet,
} from '../../Common';

type Props = {
  onPressCancel: Function,
};

export default class Popover extends Component {
  props: Props;

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPressCancel}>
        <View style={styles.overlayContainer}>
          <View style={styles.popover}>
            <View style={styles.tableHeader}>
              <TouchableOpacity style={StyleSheet.styles.discoveryCenter.leftContainer} onPress={this.props.onPressCancel}>
                <Text style={styles.back}>Cancel</Text>
              </TouchableOpacity>
              <View style={styles.separator} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },
  popover: {
    backgroundColor: 'rgba(255, 255, 255, 0.99)',
    borderRadius: 4,
    position: 'absolute',
    top: 24,
    bottom: 4,
    right: 4,
    left: 4,
  },
  tableHeader: {

  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
  },
  back: {
    color: Colors.tint,
    fontSize: 17,
    paddingLeft: 5,
  },
});
