/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  Platform,
  Text,
  View,
} from 'react-native';

import {
  StyleSheet
} from '../../Common';

type Props = {
  children?: ReactElement<any>,
  style?: any,
  textStyle?: any,
  viewProps?: any,
  onPress?: any,
}

const NavigationHeaderTitle = ({ children, style, textStyle, viewProps, onPress }: Props) => (
  <View style={[ styles.title, style ]} {...viewProps}>
    <Text style={[ styles.titleText, textStyle ]} onPress={onPress}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left'
  }
});

NavigationHeaderTitle.propTypes = {
  children: React.PropTypes.node.isRequired,
  style: View.propTypes.style,
  textStyle: Text.propTypes.style
};

export default NavigationHeaderTitle;
