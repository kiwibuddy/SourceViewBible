/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Platform,
  View,
} from 'react-native';

import Modal from './Modal';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

type Props = {
  initialRoute: Object,
  popoverStyle: any,
  onPressCancel: Function,
  onDone: Function,
};

export default class Popover extends Component {
  props: Props;

  render() {
    return (
      <View style={styles.overlayContainer}>
        <Modal
          {...this.props}
          initialRoute={this.props.initialRoute}
          modalStyle={styles.popover}
          onPressCancel={this.props.onPressCancel}
          onPressDone={this.props.onDone}
        />
      </View>
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
    ...Platform.select({
      android: {
        top: 4,
      },
    })
  },
});
