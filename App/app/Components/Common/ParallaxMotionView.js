/* @flow */
"use strict";

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import ParallaxMotion from 'react-native-parallax-motion';

export default class ParallaxMotionView extends Component {
  componentDidMount() {
    ParallaxMotion.startUpdates(1000/60, (motionData) => {
      this._updateChildren(motionData);
    });
  }

  componentWillUnmount() {
    ParallaxMotion.stopUpdates();
  }

  render() {
    const children = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        key: 'parallax-motion-view-child-' + index,
        ref: 'parallax-motion-view-child-' + index
      });
    });

    return (
      <View {...this.props}>
        {children}
      </View>
    );
  }

  _updateChildren = (motionData: Object) => {
    let horizontalMotion = 0;
    let verticalMotion = 0;
    let intensity = this.props.intensity || 1;

    if (motionData) {
      horizontalMotion = motionData.attitude.roll * intensity;
      verticalMotion = motionData.attitude.pitch * intensity;
    }

    React.Children.forEach(this.props.children, (child, index) => {
      const style = StyleSheet.flatten(child.props.style);
      const { top, left, bottom, right } = style;

      const updatedStyle = {
        ...style,
        top: top + verticalMotion,
        left: left + horizontalMotion,
        bottom: bottom + verticalMotion,
        right: right + horizontalMotion,
      };

      this.refs['parallax-motion-view-child-' + index].setNativeProps({
        style: updatedStyle
      });
    });
  };
};
