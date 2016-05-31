/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import ColorPropType from 'ColorPropType';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import StyleSheet from '../../Common/StyleSheet'

const SEGMENT_REF = 'segment-';

export default class SegmentedControl extends Component {
  static propTypes = {
    style: PropTypes.any,
    tintColor: ColorPropType,
    values: PropTypes.arrayOf(PropTypes.string),
    selectedIndex: PropTypes.number,
    onValueChange: PropTypes.func
  };

  state: {
    selectedIndex: number,
    __indicatorLeft: any,
    __indicatorWidth: any
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: props.selectedIndex || 0,
      indicatorLeft: new Animated.Value(0),
      indicatorWidth: new Animated.Value(0)
    };
  }

  render() {
    const values = this.props.values;
    let index = 0;
    const buttons = values.map((value) => {
      let buttonIndex = index;
      let isButtonSelected = buttonIndex === this.state.selectedIndex;
      let tintColor = (isButtonSelected ? this.props.tintColor : null);
      index++;
      return this._renderButton(buttonIndex, value, tintColor);
    });

    const indicatorStyle = [styles.indicator, {
      backgroundColor: this.props.tintColor,
      left: this.state.indicatorLeft,
      width: this.state.indicatorWidth
    }];

    return (
      <View
        style={[styles.tabBar, this.props.style]}
        onLayout={this._measureSelectedButton}
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
        ref={SEGMENT_REF + index}
        style={styles.button}
        onPress={() => this._onValueChange(index, title)}
      >
        <Text style={[styles.buttonTitle, {color: tintColor}]}>{title.toLocaleUpperCase()}</Text>
      </TouchableOpacity>
    );
  }

  _measureSelectedButton = () => {
    this.refs[SEGMENT_REF + this.state.selectedIndex].measure((ox, oy, width, height, px, py) => {
      this.state.indicatorLeft.setValue(px);
      this.state.indicatorWidth.setValue(width);
    });
  };

  _onValueChange = (index, title) => {
    if (index === this.state.selectedIndex) return;

    this.setState({selectedIndex: index});
    if (this.props.onValueChange) this.props.onValueChange(title);
  };
}

const styles = StyleSheet.create({
  tabBar: {
    height: 48,
    backgroundColor: '#FFF',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonTitle: {
    fontSize: 14,
    fontFamily: 'sans-serif-medium',
    alignSelf: 'center',
  },
  indicator: {
    position: 'absolute',
    height: 3,
    bottom: 0
  }
});
