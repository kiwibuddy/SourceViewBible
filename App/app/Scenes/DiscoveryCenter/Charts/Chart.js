/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  StyleSheet,
} from '../../../Common';

// $FlowFixMe: Can't find os module extension
import LinearGradient from 'react-native-linear-gradient';

const ChartType = {
  BAR: 'bar',
  PIE: 'pie',
  CLOUD: 'cloud',
};

const Header = (props: Object) => {
  return (
    <View {...props} style={[styles.header, props.style]}>
      {props.children}
    </View>
  );
};

const Footer = (props: Object) => {
  return (
    <View {...props} style={[styles.footer, props.style]}>
      {props.children}
    </View>
  );
};

type ButtonProps = {
  title: string,
  style: any,
  onPress: Function,
};

const Button = (props: ButtonProps) => {
  const { onPress } = props;
  return (
    <TouchableOpacity hitSlop={{top: 10, left: 5, bottom: 10, right: 0}} onPress={onPress}>
      <Text style={[styles.button, props.style]}>{props.title}</Text>
    </TouchableOpacity>
  );
};

type DropdownButtonProps = {
  title: string,
  image: any,
};

const DropdownButton = (props: DropdownButtonProps) => {
  return (
    <TouchableOpacity {...props}>
      <Image style={styles.chartDropdown} source={require('../Images/chart-icn-dropdown.png')} />
      <Image style={styles.chartIcon} source={props.image} />
      <Text style={styles.chartProperty}>{props.title}</Text>
    </TouchableOpacity>
  )
};

const Chart = (props: Object) => {
  return (
    <View style={styles.chart} {...props}>
      <LinearGradient
        colors={['#76838F', '#323B43']}
        start={[0.5, 0.25]} end={[0.5, 1.0]}
        style={{flex: 1}}
      >
        {props.children}
      </LinearGradient>
    </View>
  );
};
Chart.Type = ChartType;
Chart.Header = Header;
Chart.Footer = Footer;
Chart.Button = Button;
Chart.DropdownButton = DropdownButton;

const styles = StyleSheet.create({
  chart: {
    alignItems: 'center',
    backgroundColor: '#5B6771',
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 0.8,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  header: {
    flex: 1,
    position: 'absolute',
    right: 5,
    left: 5,
    top: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  button: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingRight: 15,
    backgroundColor: 'transparent',
  },
  chartProperty: {
    fontSize: 11,
    paddingLeft: 5,
    color: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  chartDropdown: {
    position: 'absolute',
    right: 8,
    top: 12,
  },
  footer: {
    flex: 1,
    position: 'absolute',
    right: 5,
    left: 5,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Chart;
