/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import ColorPropType from 'ColorPropType';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import StyleSheet from '../../common/stylesheet'

export default class SegmentedControl extends Component {
  static propTypes = {
    style: PropTypes.any,
    tintColor: ColorPropType,
    values: PropTypes.arrayOf(PropTypes.string),
    selectedIndex: PropTypes.number
  };

  render() {
    const values = this.props.values;
    let index = 0;
    const buttons = values.map((value) => {
      let isButtonSelected = index === this.props.selectedIndex;
      let tintColor = (isButtonSelected ? this.props.tintColor : null);
      index++;
      return this._renderButton(value, tintColor);
    });

    const indicatorStyle = [styles.indicator, {backgroundColor: this.props.tintColor}];

    return (
      <View style={[styles.tabBar, this.props.style]}>
        <View style={styles.buttons}>
          {buttons}
        </View>
        <Animated.View style={indicatorStyle} />
      </View>
    );
  }

  _renderButton(title: String, tintColor: ColorPropType) {
    return(
      <TouchableOpacity key={'button-' + title} style={styles.button} onPress={this.props.onButtonPress}>
        <Text style={[styles.buttonTitle, {color: tintColor}]}>{title.toLocaleUpperCase()}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    height: 48,
    backgroundColor: '#FFF',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    flex: 1,
    alignItems: 'center'
  },
  buttonTitle: {
    fontSize: 14,
    fontFamily: 'sans-serif-medium'
  },
  indicator: {
    height: 2,
    left: 0,
    width: 110
  }
});
