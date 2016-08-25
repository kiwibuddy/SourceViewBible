/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Colors
} from '../../Common';

type Props = {
  disabled?: boolean,
  imageSource?: any,
  onPress?: Function,
  style?: Object,
  title?: any,
  titleStyle?: any,
  visible?: boolean
};

const NavigationBarButton = (props: Props) => {
  if (props.visible === false) return null;

  const imageStyle = props.disabled ? {tintColor: 'gray'} : {};
  const textStyle = props.disabled ? {color: 'gray'} : {};
  const title = props.title && Platform.OS !== 'android' ? <View style={styles.textContainer}><Text style={[styles.text, props.titleStyle, textStyle]}>{props.title}</Text></View> : null;

  const backImage = require('./Images/nav-back.png');
  const image = props.imageSource || Platform.OS === 'android' ? <Image source={props.imageSource || backImage} style={[styles.image, imageStyle]} /> : null;

  const buttonStyle = title ? {width: null, paddingHorizontal: null, flex: 1} : {};

  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={[styles.button, buttonStyle, props.style]}
    >
    {title}
    {image}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 30,
    height: 30,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    marginTop: -3,
  },
  image: {
    tintColor: Colors.tint,
    alignSelf: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: Colors.tint,
  },
});

export default NavigationBarButton;
