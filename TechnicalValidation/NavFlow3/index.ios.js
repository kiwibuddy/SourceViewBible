/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

class NavFlow3 extends Component {
  state = {
  navigation: {
      index: 0,
      routes: [
        {key: 'route-1', backgroundColor: '#246792'},
        {key: 'route-2', backgroundColor: '#02104e'},
        {key: 'route-3', backgroundColor: '#f855c8'},
        {key: 'route-4', backgroundColor: '#7cda6f'},
        {key: 'route-5', backgroundColor: '#784cc9'},
        {key: 'route-6', backgroundColor: '#7baa22'},
        {key: 'route-7', backgroundColor: '#ce6f6b'},
        {key: 'route-8', backgroundColor: '#21fdae'}
      ],
    },
  };

  render() {
    const { navigation } = this.state;
    const route = navigation.routes[navigation.index];
    const scene = this._renderScene({route});
    const navigationBar = this._renderNavigationBar({navigationState: navigation});
    const toolbar = this._renderToolbar({navigationState: navigation, jumpToIndex: this._jumpToIndex});

    return (
      <View style={styles.container}>
        {scene}
        {navigationBar}
        {toolbar}
      </View>
    );
  }

  _jumpToIndex = (index) => {
    this.setState({
      navigation: { ...this.state.navigation, index },
    });
  };

  _renderScene = ({ route }) => {
    if (this.state.navigation.index !== this.state.navigation.routes.indexOf(route)) {
      return null;
    }

    return <ExampleScene style={[ styles.page, { backgroundColor: route.backgroundColor } ]} route={route} />;
  };

  _renderNavigationBar = (props) => {
    const { navigationState } = props;
    const route = navigationState.routes[navigationState.index];
    return (
      <View style={styles.navigationBar}>
        <View style={styles.title}>
          <Text style={styles.titleText}>{route.key}</Text>
        </View>
      </View>
    )
  };

  _renderToolbar = (props) => {
    const { navigationState, jumpToIndex } = props;

    const canGoBack = navigationState.index > 0;
    const backButtonStyle = {
      tintColor: canGoBack ? 'red' : 'gray'
    };

    const canGoForward = navigationState.index < navigationState.routes.length - 1;
    const forwardButtonStyle = {
      tintColor: canGoForward ? 'red' : 'gray'
    };

    return (
      <View style={styles.toolbar}>
        <TouchableHighlight
          disabled={!canGoBack}
          onPress={() => jumpToIndex(navigationState.index - 1)}
          style={styles.toolbarButton}
          underlayColor="rgba(0,0,0,.2)"
        >
          <Image style={[styles.toolbarButtonIcon, backButtonStyle]} source={require('./back.png')} />
        </TouchableHighlight>

        <TouchableHighlight
          disabled={!canGoForward}
          onPress={() => jumpToIndex(navigationState.index + 1)}
          style={styles.toolbarButton}
          underlayColor="rgba(0,0,0,.2)"
        >
          <Image style={[styles.toolbarButtonIcon, forwardButtonStyle]} source={require('./forward.png')} />
        </TouchableHighlight>
      </View>
    )
  };
}

class ExampleScene extends Component {
  shouldComponentUpdate(nextProps: Object, nextState: void): boolean {
    return ReactComponentWithPureRenderMixin.shouldComponentUpdate.call(
      this,
      nextProps,
      nextState
    );
  }

  render() {
    const {style, route} = this.props;
    return (
      <View style={style}>
        <Text style={{color:'white'}}>{route.key}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    marginTop: 64,
    marginBottom: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationBar: {
    alignItems: 'center',
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
    borderBottomColor: 'rgba(0, 0, 0, .15)',
    borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
    elevation: 4,
    flexDirection: 'row',
    height: 44 + 20,
    justifyContent: 'flex-start',
    left: 0,
    marginBottom: 16, // This is needed for elevation shadow
    position: 'absolute',
    right: 0,
    top: 0,
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left'
  },
  toolbar: {
    position: 'absolute',
    height: 44,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
    borderTopColor: 'rgba(0, 0, 0, .15)',
    borderTopWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  toolbarButton: {
    width: 30,
    height: 30,
  },
  toolbarButtonIcon: {
    width: 30,
    height: 30,
  },
});

AppRegistry.registerComponent('NavFlow3', () => NavFlow3);
