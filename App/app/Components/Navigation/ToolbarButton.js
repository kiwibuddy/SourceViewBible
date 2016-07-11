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
  imageSource: any,
  onPress: Function,
};

const ToolbarButton = (props: Props) => {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={styles.button}
      underlayColor="transparent"
    >
      <Image
        source={props.imageSource}
        style={styles.image}
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
    width: 30,
    height: 30,
    tintColor: Colors.tintColor
  },
});

export default ToolbarButton;
