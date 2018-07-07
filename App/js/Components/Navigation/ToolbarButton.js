/* @flow */
'use strict';

import React, { Component } from 'react';


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
  style?: any,
  title?: any,
  titleStyle?: any,
};

const ToolbarButton = (props: Props) => {
  const imageStyle = props.disabled ? {tintColor: 'gray'} : {};
  const textStyle = props.disabled ? {color: 'gray'} : {};
  const title = props.title ? <View style={styles.textContainer}><Text style={[styles.text, props.titleStyle, textStyle]}>{props.title}</Text></View> : null;
  const image = props.imageSource ? <Image source={props.imageSource} style={[styles.image, imageStyle]} /> : null;

  const buttonStyle = title ? {width: null, height: null, flex: 1} : {};

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
    marginHorizontal: 8,
    ...Platform.select({
      ios: {
        width: 30,
        height: 30,
      },
    })
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
    color: Colors.tint,
  },
});

export default ToolbarButton;
