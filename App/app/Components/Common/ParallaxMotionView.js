/* @flow */
'use strict';

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import ParallaxMotion from 'react-native-parallax-motion';

export default class ParallaxMotionView extends Component {
  componentDidMount() {
    ParallaxMotion.startUpdates(1000/60, (motionData) => {
      // console.log(motionData.attitude);
      this._updateChildren(motionData);
    });
  }

  componentWillUnmount() {
    ParallaxMotion.stopUpdates();
  }

  render() {
    const children = this.props.children.map((child, index) => {
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

    if (motionData) {
      horizontalMotion = (motionData.attitude.roll);
      verticalMotion = (motionData.attitude.pitch);
    }

    this.props.children.forEach((child, index) => {
      const style = StyleSheet.flatten(child.props.style);
      const { left, right, top } = style;

      const updatedStyle = {
        ...style,
        left: left * horizontalMotion,
        right: right * horizontalMotion,
        top: top * verticalMotion
      };

      this.refs['parallax-motion-view-child-' + index].setNativeProps({
        style: updatedStyle
      });
    });
  };
};
