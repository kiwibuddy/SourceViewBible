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

import EventEmitter from 'EventEmitter';

const NavigatorNavigationBarStyles = {
  ...Navigator.NavigationBar.Styles,
  General: {
    ...Navigator.NavigationBar.Styles.General,
    TotalNavHeight: Navigator.NavigationBar.Styles.General.NavBarHeight
  },
  Stages: {
    ...Navigator.NavigationBar.Styles.Stages,
    Left: {
      ...Navigator.NavigationBar.Styles.Stages.Left,
      Title: {
        ...Navigator.NavigationBar.Styles.Stages.Left.Title,
        top: 0,
      },
      LeftButton: {
        ...Navigator.NavigationBar.Styles.Stages.Left.LeftButton,
        top: 0,
      },
      RightButton: {
        ...Navigator.NavigationBar.Styles.Stages.Left.RightButton,
        top: 0,
      }
    },
    Center: {
      ...Navigator.NavigationBar.Styles.Stages.Center,
      Title: {
        ...Navigator.NavigationBar.Styles.Stages.Center.Title,
        top: 0,
      },
      LeftButton: {
        ...Navigator.NavigationBar.Styles.Stages.Center.LeftButton,
        top: 0,
      },
      RightButton: {
        ...Navigator.NavigationBar.Styles.Stages.Center.RightButton,
        top: 0,
      }
    },
    Right: {
      ...Navigator.NavigationBar.Styles.Stages.Right,
      Title: {
        ...Navigator.NavigationBar.Styles.Stages.Right.Title,
        top: 0,
      },
      LeftButton: {
        ...Navigator.NavigationBar.Styles.Stages.Right.LeftButton,
        top: 0,
      },
      RightButton: {
        ...Navigator.NavigationBar.Styles.Stages.Right.RightButton,
        top: 0,
      }
    }
  }
};

const NAV_BAR_HEIGHT = NavigatorNavigationBarStyles.General.NavBarHeight;

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import router, { BACK } from '../../Navigation';

type Props = {
  card: Object,
  initialRoute: Object,
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
    const eventEmitter = this.eventEmitter;

    return (
      <Navigator.NavigationBar
      navigationStyles={NavigatorNavigationBarStyles}
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

            const previousRoute = navState.routeStack[index - 1];
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
        style={styles.navBar}
      />
    );
  };

  _renderScene = (navigatorRoute: Object, navigator: Object) => {
    const { route, params } = router.match(navigatorRoute.path);

    if (!route) {
      throw new Error('Could not find route for: ' + navigatorRoute.path);
    }

    const Scene = route.scene;
    return (
      <View style={{flex: 1, paddingTop: NAV_BAR_HEIGHT}}>
        <Scene
          card={this.props.card}
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
    ...Platform.select({
      android: {
        top: NAV_BAR_HEIGHT + 8,
      },
    })
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
    marginVertical: 12,
  },
  navBarTitleText: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
    marginVertical: 12,
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
