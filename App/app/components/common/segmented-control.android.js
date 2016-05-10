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

  state: {
    __indicatorLeft: any,
    __indicatorWidth: any
  };

  constructor(props) {
    super(props);

    this.state = {
      __indicatorLeft: new Animated.Value(0),
      __indicatorWidth: new Animated.Value(0)
    };
  }

  render() {
    const values = this.props.values;
    let index = 0;
    const buttons = values.map((value) => {
      let buttonIndex = index;
      let isButtonSelected = buttonIndex === this.props.selectedIndex;
      let tintColor = (isButtonSelected ? this.props.tintColor : null);
      index++;
      return this._renderButton(buttonIndex, value, tintColor);
    });

    const indicatorStyle = [styles.indicator, {
      backgroundColor: this.props.tintColor,
      left: this.state.__indicatorLeft,
      width: this.state.__indicatorWidth
    }];

    return (
      <View
        style={[styles.tabBar, this.props.style]}
        onLayout={this._measureSelectedButton.bind(this)}
      >
        <View style={styles.buttons}>
          {buttons}
        </View>
        <Animated.View style={indicatorStyle} />
      </View>
    );
  }

  _renderButton(index: PropTypes.number, title: String, tintColor: ColorPropType) {
    return(
      <TouchableOpacity
        key={'button-' + title}
        ref={index}
        style={styles.button}
        onPress={() => this.props.onButtonPress(index)}
      >
        <Text style={[styles.buttonTitle, {color: tintColor}]}>{title.toLocaleUpperCase()}</Text>
      </TouchableOpacity>
    );
  }

  _measureSelectedButton() {
    this.refs[this.props.selectedIndex].measure((ox, oy, width, height, px, py) => {
      this.state.__indicatorLeft.setValue(px);
      this.state.__indicatorWidth.setValue(width);
    });
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
