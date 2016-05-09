/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
const StyleSheet = require('../../common/stylesheet');

export default class SegmentedControl extends Component {
  static propTypes = {
    style: PropTypes.any,
    values: PropTypes.any.isRequired
  };

  render() {
    const values = this.props.values;
    const buttons = values.map((value) => {
      return this._renderButton(value);
    });
    return (
      <View style={[styles.container, this.props.style]}>
        {buttons}
      </View>
    );
  }

  _renderButton(title: String) {
    <TouchableOpacity style={styles.button} onPress={this.props.onButtonPress}>
      <Text style={styles.buttonTitle}>{title}</Text>
    </TouchableOpacity>
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 28
  },
  button: {
    flex: 1,
    backgroundColor: 'red'
  },
  buttonTitle: {
    flex: 1
  }
});
