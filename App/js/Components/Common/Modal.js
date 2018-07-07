/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  Image,
  Navigator,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import EventEmitter from 'EventEmitter';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import router, { BACK } from '../../Navigation';

type Props = {
  initialRoute: Object,
  modalStyle?: any,
  navigationBarStyles?: any,
  onPressCancel: Function,
  onDone: Function,
};

export default class Popover extends Component {
  props: Props;
  eventEmitter: Object;

  componentWillMount() {
    this.eventEmitter = new EventEmitter();
  }

  render() {
    return (
      <Navigator
        initialRoute={this.props.initialRoute}
        navigationBar={this._renderNavigationBar()}
        renderScene={this._renderScene}
        style={[styles.container, this.props.modalStyle]}
      />
    );
  }

  _renderNavigationBar = () => {
    const {onPressCancel} = this.props;
    const eventEmitter = this.eventEmitter;
    const navigationBarStyles = this.props.navigationBarStyles || Navigator.NavigationBar.Styles;

    return (
      <Navigator.NavigationBar
        navigationStyles={navigationBarStyles}
        routeMapper={{
          LeftButton: function(route, navigator, index, navState) {
            if (index === 0) {
              if (Platform.OS === 'android') {
                return (
                  <TouchableOpacity
                    onPress={() => onPressCancel()}
                    style={styles.navBarLeftButton}
                    >
                    <Image source={require('../../Components/Navigation/Images/nav-close.png')} style={{width: 24, height: 24, tintColor: Colors.tint}} />
                  </TouchableOpacity>
                );
              }

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

            if (Platform.OS === 'android') {
              return (
                <TouchableOpacity
                  onPress={() => navigator.pop()}
                  style={styles.navBarLeftButton}
                  >
                  <Image source={require('../../Components/Navigation/Images/nav-back.png')} style={{width: 24, height: 24, tintColor: Colors.tint}} />
                </TouchableOpacity>
              );
            }

            const title = Localizable.t('back');
            return (
              <TouchableOpacity
                onPress={() => navigator.pop()}
                style={styles.navBarLeftButton}>
                <Text style={[styles.navBarText, styles.navBarButtonText]}>
                  {title}
                </Text>
              </TouchableOpacity>
            );
          },
          RightButton: function(route, navigator, index, navState) {
            if (route.path !== '/DiscoveryCenter/Filters/SpheresFilter') return null;

            if (Platform.OS === 'android') {
              return (
                <TouchableOpacity
                  onPress={() => eventEmitter.emit('onPressDone')}
                  style={styles.navBarRightButton}>
                  <Image source={require('../../Components/Navigation/Images/checkmark-icon.png')} style={{width: 24, height: 24, tintColor: Colors.tint}} />
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                onPress={() => eventEmitter.emit('onPressDone')}
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
        style={[styles.navBar, {height: navigationBarStyles.General.TotalNavHeight}]}
      />
    );
  };

  _renderScene = (navigatorRoute: Object, navigator: Object) => {
    const { route, params } = router.match(navigatorRoute.path);
    const navigationBarStyles = this.props.navigationBarStyles || Navigator.NavigationBar.Styles;

    if (!route) {
      throw new Error('Could not find route for: ' + navigatorRoute.path);
    }

    const Scene = route.scene;
    return (
      <View style={{flex: 1, paddingTop: navigationBarStyles.General.TotalNavHeight}}>
        <Scene
          {...this.props}
          {...navigatorRoute}
          {...params}
          navigate={(route: any, options?: any) => this._navigate(navigator, route, options)}
          onDone={this.props.onDone}
          events={this.eventEmitter}
        />
      </View>
    );
  };

  _navigate = (navigator: Object, route: any, options?: any) => {
    if (route === BACK) {
      navigator.pop();
    } else {
      navigator.push(route);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: '#FFF',
  },
  navBar: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(248, 248, 248, .85)' : '#FFF',
    borderBottomColor: 'rgba(0, 0, 0, .15)',
    borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
    elevation: 2,
    marginBottom: 16, // This is needed for elevation shadow
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 12,
  },
  navBarTitleText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, .9)',
    marginVertical: 12,
    ...Platform.select({
      android: {
        marginVertical: 16,
      },
    })
  },
  navBarLeftButton: {
    paddingLeft: 10,
    ...Platform.select({
      android: {
        paddingHorizontal: 10,
        paddingVertical: 16,
      },
    })
  },
  navBarRightButton: {
    paddingRight: 10,
    ...Platform.select({
      android: {
        paddingHorizontal: 10,
        paddingVertical: 16,
      },
    })
  },
  navBarButtonText: {
    color: Colors.tint,
  },
});
