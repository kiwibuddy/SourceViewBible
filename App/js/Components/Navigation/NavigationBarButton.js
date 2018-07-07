/* @flow */
'use strict';

import React from 'react';

import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../../Common';

type Props = {
  disabled?: boolean,
  imageSource?: any,
  onPress?: Function,
  style?: Object,
  title?: any,
  titleStyle?: any
};

const NavigationBarButton = (props: Props) => {
  const imageStyle = props.disabled ? { tintColor: 'gray' } : {};
  const textStyle = props.disabled ? { color: 'gray' } : {};
  const title =
    props.title && Platform.OS !== 'android' ? (
      <View style={styles.textContainer}>
        <Text style={[styles.text, props.titleStyle, textStyle]}>{props.title}</Text>
      </View>
    ) : null;

  const backImage = require('./Images/nav-back.png');
  const image = props.imageSource || Platform.OS === 'android' ? <Image source={props.imageSource || backImage} style={[styles.image, imageStyle]} /> : null;

  return (
    <TouchableOpacity disabled={props.disabled} onPress={props.onPress} style={[styles.button, props.style]}>
      {title}
      {image}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Platform.OS === 'ios' ? 10 : 16
  },
  image: {
    tintColor: Colors.tint,
    ...Platform.select({
      android: {
        width: 24,
        height: 24
      }
    })
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 16,
    color: Colors.tint
  }
});

export default NavigationBarButton;
