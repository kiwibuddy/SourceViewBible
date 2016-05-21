/* @flow */
'use strict';

import React, { Component } from 'react';
import { View, PropTypes } from 'react-native';
import { StyleSheet } from '../../Common';

const Keyline = (props: Object) => {
  const width = props.horizontal ? null : StyleSheet.hairlineWidth;
  const height = props.horizontal ? StyleSheet.hairlineWidth : null;
  const style = {
    flex: 1,
    backgroundColor: '#CCCCCC',
    width: width,
    height: height,
  };
  
  return (
    <View style={[style, props.style]} />
  );
};

Keyline.propTypes = {
  style: PropTypes.any,
  horizontal: PropTypes.bool
};

Keyline.defaultProps = {
  horizontal: true
}

export default Keyline;
