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
  StyleSheet,
} from '../../Common';

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
};
const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity>
      <Text {...props} style={[styles.button, props.style]}>{props.title}</Text>
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
      <Image style={styles.chartDropdown} source={require('../../Images/discoverycenter/chart-icn-dropdown.png')} />
      <Image style={styles.chartIcon} source={props.image} />
      <Text style={styles.chartProperty}>{props.title}</Text>
    </TouchableOpacity>
  )
};

const Chart = (props: Object) => {
  return (
    <View style={styles.chart} {...props}>
      {props.children}
    </View>
  );
};
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
  },
  chartProperty: {
    fontSize: 11,
    paddingLeft: 5,
    color: '#FFFFFF'
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
