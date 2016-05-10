/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import StyleSheet from '../../common/stylesheet'

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
    return(
      <TouchableOpacity key={'button-' + title} style={styles.button} onPress={this.props.onButtonPress}>
        <Text style={styles.buttonTitle}>{title.toLocaleUpperCase()}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#F9F9F9',
    alignItems: 'center'
  },
  button: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  }
});
