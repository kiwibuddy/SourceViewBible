/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
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
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={styles.button}
    >
      <Image
        source={props.imageSource}
        style={[styles.image, imageStyle]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 30,
    height: 30,
    marginHorizontal: 8,
    paddingHorizontal: 16,
  },
  image: {
    tintColor: Colors.tintColor,
    alignSelf: 'center',
  },
});

export default ToolbarButton;
