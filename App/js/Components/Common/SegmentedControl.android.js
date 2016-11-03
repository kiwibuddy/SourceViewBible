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
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      selectedIndex: props.selectedIndex || 0,
    };
  }

  render() {
    const values = this.props.values;
    let index = 0;
    const buttons = values.map((value) => {
      let buttonIndex = index;
      let isButtonSelected = buttonIndex === this.state.selectedIndex;
      index++;
      return this._renderButton(buttonIndex, value, isButtonSelected);
    });

    return (
      <View style={[styles.tabBar, this.props.style]}>
        <View style={styles.buttons}>
          {buttons}
        </View>
      </View>
    );
  }

  _renderButton(index: number, title: string, isSelected: boolean) {
    const tintColor = isSelected ? this.props.tintColor : null;
    const buttonStyle = isSelected ? {borderBottomColor: tintColor} : {};
    return(
      <TouchableOpacity
        key={'button-' + title}
        style={[styles.button, buttonStyle]}
        onPress={() => this._onValueChange(index, title)}
      >
        <Text style={[styles.buttonTitle, {color: tintColor}]}>{title.toLocaleUpperCase()}</Text>
      </TouchableOpacity>
    );
  }

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
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  buttonTitle: {
    fontSize: 14,
    fontFamily: 'sans-serif-medium',
    alignSelf: 'center',
  },
});
