/* @flow */
'use strict';

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

// const DeviceMotion = require('react-native-device-motion');

export default class ParallaxMotionView extends Component {
  state: {
    motionData: any
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      motionData: null
    };
  }

  componentDidMount() {
    // DeviceMotion.startDeviceMotionUpdates(1000/60, (data) => {
    //   this.setState({
    //     motionData: data,
    //   });
    // });
  }

  render() {
    const motionData = this.state.motionData;

    let horizontalMotion = 0;
    let verticalMotion = 0;

    if (motionData) {
      horizontalMotion = (motionData.attitude.roll+1)*100;
      verticalMotion = (motionData.attitude.pitch+1)*100;
    }

    const children = React.Children.map(this.props.children, (child, index) => {
      const { left, right, top } = StyleSheet.flatten(child.props.style);
      const style = {
        left: left + horizontalMotion,
        top: top + verticalMotion,
        right: right + horizontalMotion
      };

      return React.cloneElement(child, {
        style: [child.props.style, style]
      });
    });

    return (
      <View {...this.props}>
        {children}
      </View>
    );
  }
};
