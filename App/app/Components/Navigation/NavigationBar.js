/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

const NAVIGATIONBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const NavigationBarTitle = (props: any) => {
  return (
    <Text style={styles.titleText}>{props.title}</Text>
  );
};

type Props = {
  title?: string,
  children?: any,
};

export default class NavigationBar extends Component {
  static HEIGHT = NAVIGATIONBAR_HEIGHT + STATUSBAR_HEIGHT;
  static Title = NavigationBarTitle;

  props: Props;

  render() {
    const title = this.props.title ? <NavigationBarTitle title={this.props.title} /> : null;

    return (
      <View style={styles.navigationBar}>
        <View style={styles.title}>
          {title}
          {this.props.children}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navigationBar: {
    position: 'absolute',
    top: 0,
    height: NAVIGATIONBAR_HEIGHT + STATUSBAR_HEIGHT,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: Platform.OS === 'ios' ? '#f6f6f6' : '#FFF',
    borderBottomColor: 'rgba(0, 0, 0, .15)',
    borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16, // This is needed for elevation shadow
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: Platform.OS === 'ios' ? STATUSBAR_HEIGHT : 0,
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left'
  }
});
