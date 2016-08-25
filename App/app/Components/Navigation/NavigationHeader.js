/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  Animated,
  Platform,
  View
} from 'react-native';

import NavigationHeaderTitle from './NavigationHeaderTitle';

import {
  StyleSheet
} from '../../Common';

type BarComponentRenderer = (props: Object) => ?ReactElement<any>;

type Props = {
  navigate: Function,
  renderLeftComponent?: BarComponentRenderer,
  renderRightComponent?: BarComponentRenderer,
  renderTitleComponent?: BarComponentRenderer,
  style?: any,
  title?: string,
  viewProps?: any,
  statusBarHeight: number | Animated.Value,
};

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

export default class NavigationHeader extends Component {
  props: Props;

  static defaultProps = {
    renderTitleComponent: (props: Object) => {
      const title = String(props.title || '');
      const style = (Platform.OS === 'android' && !props.renderLeftComponent ? {marginLeft: -32} : {});
      return <NavigationHeaderTitle style={style}>{title}</NavigationHeaderTitle>;
    },

    statusBarHeight: STATUSBAR_HEIGHT,
  };

  render() {
    const { style, viewProps } = this.props;

    const barHeight = (this.props.statusBarHeight instanceof Animated.Value) ? Animated.add(this.props.statusBarHeight, new Animated.Value(APPBAR_HEIGHT)) : APPBAR_HEIGHT + this.props.statusBarHeight;
    return (
      <Animated.View style={[styles.appbar, { height: barHeight }, style]} {...viewProps}>
        {this._renderLeft(this.props)}
        {this._renderTitle(this.props)}
        {this._renderRight(this.props)}
      </Animated.View>
    );
  }

  _renderLeft = (props: Object) => {
    const { renderLeftComponent } = this.props;
    if (!renderLeftComponent) return null;
    return (
      <View style={[styles.left, { marginTop: this.props.statusBarHeight }]}>
        {renderLeftComponent(props)}
      </View>
    );
  };

  _renderTitle = (props: Object) => {
    const { renderTitleComponent } = this.props;
    if (!renderTitleComponent) return null;
    return (
      <View style={[styles.title, { marginTop: this.props.statusBarHeight }]}>
        {renderTitleComponent(props)}
      </View>
    );
  };

  _renderRight = (props: Object) => {
    const { renderRightComponent } = this.props;
    if (!renderRightComponent) return null;
    return (
      <View style={[styles.right, { marginTop: this.props.statusBarHeight }]}>
        {renderRightComponent(props)}
      </View>
    );
  };

  static HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;
  static APPBAR_HEIGHT = APPBAR_HEIGHT;
  static Title = NavigationHeaderTitle;
}

const styles = StyleSheet.create({
  appbar: {
    alignItems: 'center',
    backgroundColor: Platform.OS === 'ios' ? 'rgba(248, 248, 248, .85)' : '#FFF',
    borderBottomColor: 'rgba(0, 0, 0, .15)',
    borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  title: {
    bottom: 0,
    left: APPBAR_HEIGHT,
    position: 'absolute',
    right: APPBAR_HEIGHT,
    top: 0,
  },

  left: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
  },

  right: {
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
