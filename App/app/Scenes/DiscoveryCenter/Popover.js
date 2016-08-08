/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Navigator,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import BookFilters from './Filters/BookFilters';

const NAV_BAR_HEIGHT = 44;

type Props = {
  initialRoute: Object,
  onPressCancel: Function,
  onDone: Function,
};

export default class Popover extends Component {
  props: Props;

  render() {
    return (
      <View style={styles.overlayContainer}>
        <Navigator
          initialRoute={this.props.initialRoute}
          navigationBar={this._renderNavigationBar()}
          renderScene={this._renderScene}
          style={styles.popover}
        />
      </View>
    );
  }

  _renderNavigationBar = () => {
    const {onPressCancel} = this.props;

    return (
      <Navigator.NavigationBar
        routeMapper={{
          LeftButton: function(route, navigator, index, navState) {
            if (index === 0) {
              return (
                <TouchableOpacity
                  onPress={() => onPressCancel()}
                  style={styles.navBarLeftButton}>
                  <Text style={[styles.navBarText, styles.navBarButtonText]}>
                    {Localizable.t('cancel')}
                  </Text>
                </TouchableOpacity>
              );
            }

            var previousRoute = navState.routeStack[index - 1];
            return (
              <TouchableOpacity
                onPress={() => navigator.pop()}
                style={styles.navBarLeftButton}>
                <Text style={[styles.navBarText, styles.navBarButtonText]}>
                  {previousRoute.title || Localizable.t('back')}
                </Text>
              </TouchableOpacity>
            );
          },
          RightButton: function(route, navigator, index, navState) {
            return (
              <TouchableOpacity
                onPress={() => console.log('Done!')}
                style={styles.navBarRightButton}>
                <Text style={[styles.navBarText, styles.navBarButtonText, StyleSheet.styles.navigationBar.doneButtonTitle]}>
                  {Localizable.t('done')}
                </Text>
              </TouchableOpacity>
            );
          },
          Title: function(route, navigator, index, navState) {
            return (
              <Text style={[styles.navBarText, styles.navBarTitleText]}>
                {route.title}
              </Text>
            );
          },
        }}
        style={styles.navBar}
      />
    );
  };

  _renderScene = (route: Object, navigator: Object) => {
    return (
      <View style={{flex: 1, paddingTop: NAV_BAR_HEIGHT}}>
        <BookFilters />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },
  popover: {
    backgroundColor: 'rgba(255, 255, 255, 0.99)',
    borderRadius: 4,
    position: 'absolute',
    top: 24,
    bottom: 4,
    right: 4,
    left: 4,
  },
  navBar: {
    height: NAV_BAR_HEIGHT,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(248, 248, 248, .85)' : '#FFF',
    borderBottomColor: 'rgba(0, 0, 0, .15)',
    borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
    elevation: 4,
    marginBottom: 16, // This is needed for elevation shadow
  },
  navBarText: {
    fontSize: 16,
  },
  navBarTitleText: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: Colors.tint,
  },
});
