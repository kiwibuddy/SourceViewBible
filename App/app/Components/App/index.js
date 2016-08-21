/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { NavigationBar, Toolbar, ToolbarButton } from '../Navigation';

import router, { BACK } from '../../Navigation';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import { History } from '../../Preferences';

export default class App extends Component {
  state = {
    navigation: {
      index: 0,
      routes: [
        {path: '/Discover', title: Localizable.t('discover')},
      ],
    }
  };

  render() {
    const { navigation } = this.state;
    const route = navigation.routes[navigation.index];

    const scene = this._renderPage({route});
    if (route.modal) return scene;

    const navigationBar = this._renderNavigationBar({navigationState: navigation});
    const toolbar = this._renderToolbar({navigationState: navigation, jumpToIndex: this._jumpToIndex});
    return (
      <View style={{flex: 1}}>
        {scene}
        {navigationBar}
        {toolbar}
      </View>
    );
  }

  _renderPage = (props: any) => {
    const scene = this._renderScene(props);
    if (props.route.modal) return scene;

    return (
      <View style={{flex: 1, marginTop: NavigationBar.HEIGHT, marginBottom: Toolbar.HEIGHT}}>
        {scene}
      </View>
    );
  };

  _renderScene = (props: any) => {
    const { route, params } = router.match(props.route.path);

    if (!route) {
      throw new Error('Could not find route for: ' + props.route.path);
    }

    const Scene = route.scene;
    return <Scene {...props.route} {...params} navigate={this._navigate} />;
  };

  _renderNavigationBar = (props: any) => {
    const { navigationState } = props;
    const navigationRoute = navigationState.routes[navigationState.index];

    const { route, params} = router.match(navigationRoute.path);
    const Scene = route.scene;
    if (Scene && typeof(Scene.NavigationBar) !== "undefined") {
      return <Scene.NavigationBar {...params} navigate={this._navigate} />;
    }

    return (
      <NavigationBar title={navigationRoute.title}/>
    );
  };

  _renderToolbar = (props: any) => {
    const { navigationState } = props;
    const navigationRoute = navigationState.routes[navigationState.index];

    const { route, params} = router.match(navigationRoute.path);
    const Scene = route.scene;

    if (Scene && typeof(Scene.renderToolbar) !== "undefined") {
      const toolbar = Scene.renderToolbar({...navigationRoute, ...params, navigate:this._navigate});
      if (toolbar) return toolbar;
    }

    const canGoBack = navigationState.index > 0;
    const canGoForward = navigationState.index < navigationState.routes.length - 1;

    return (
      <Toolbar>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <ToolbarButton
            disabled={!canGoBack}
            imageSource={require('../Navigation/Images/nav-back.png')}
            onPress={() => this._goBack()}
          />
          <ToolbarButton
            disabled={!canGoForward}
            imageSource={require('../Navigation/Images/nav-forward.png')}
            onPress={() => this._goForward()}
          />
        </View>
        <View style={{flex: 1}}>
          <ToolbarButton
            imageSource={require('../Navigation/Images/nav-discoverycenter.png')}
            onPress={() => {this._pushRoute({path: '/DiscoveryCenter', modal: true})}}
          />
        </View>
        <ToolbarButton
          imageSource={require('../Navigation/Images/nav-bookmarks.png')}
          onPress={() => {this._pushRoute({path: '/Bookmarks', modal: true})}}
        />
      </Toolbar>
    );
  };

  _navigate = (route: any, options?: any) => {
    if (route === BACK) {
      this._popRoute(options);
    } else if (options && options.replace) {
      this._replaceCurrentRoute(route);
    } else {
      this._pushRoute(route);
    }
  };

  _jumpToIndex = (index: number) => {
    this.setState({
      navigation: { ...this.state.navigation, index },
    });
  };

  _goBack = () => {
    this._jumpToIndex(this.state.navigation.index - 1);
  };

  _goForward = () => {
    this._jumpToIndex(this.state.navigation.index + 1);
  };

  _pushRoute = (route: any) => {
    const state = this.state.navigation;
    const currentRoute = state.routes[state.index];
    if (route.path === currentRoute.path) return;

    const delta = (state.routes.length - state.index) - 1;

    const routes = [
      ...(delta > 0 ? state.routes.slice(0, -delta) : state.routes),
      route,
    ];

    // console.log('push', routes.map(route => route.path));

    const navigation = {
      ...state,
      index: routes.length - 1,
      routes,
    };

    if (navigation !== this.state.navigation) {
      this.setState({navigation});
    }

    History.record(route);
  };

  _popRoute = (callback?: Function) => {
    const state = this.state.navigation;
    if (state.index <= 0) {
      // [Note]: Over-popping does not throw error. Instead, it will be no-op.
      return;
    }
    const routes = state.routes.slice(0, -1);
    const navigation = {
      ...state,
      index: routes.length - 1,
      routes,
    };

    // console.log('pop', routes.map(route => route.path));

    if (navigation !== this.state.navigation) {
      this.setState({navigation}, callback);
    }
  };

  _replaceCurrentRoute = (route: any) => {
    const state = this.state.navigation;
    const currentRoute = state.routes[state.index];

    const delta = (state.routes.length - state.index);

    const routes = [
      ...(delta > 0 ? state.routes.slice(0, -delta) : state.routes),
      route,
    ];

    // console.log('replace', routes.map(route => route.path));

    const navigation = {
      ...state,
      index: routes.length - 1,
      routes,
    };

    if (navigation !== this.state.navigation) {
      this.setState({navigation});
    }

    History.record(route, {replace: true});
  };
}

const styles = StyleSheet.create({

});
