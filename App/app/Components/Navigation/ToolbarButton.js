/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Image,
  Platform,
  StyleSheet,
  TouchableHighlight,
  View
} from 'react-native';

import {
  Colors
} from '../../Common';

type Props = {
  disabled?: boolean,
  imageSource: any,
  onPress?: Function,
};

const ToolbarButton = (props: Props) => {
  const imageStyle = props.disabled ? {tintColor: 'gray'} : {};

  return (
    <TouchableHighlight
      disabled={props.disabled}
      onPress={props.onPress}
      style={styles.button}
      underlayColor="transparent"
    >
      <Image
        source={props.imageSource}
        style={[styles.image, imageStyle]}
      />
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 30,
    height: 30,
  },
  image: {
    tintColor: Colors.tintColor
  },
});

export default ToolbarButton;
