/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  BackAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { NavigationHeader, NavigationBarButton, Toolbar, ToolbarButton } from '../Navigation';

import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import router, { BACK, discoverURL, onboardingURL, sphereHelpURL, sphereInAppPurchaseURL } from '../../Navigation';

import {
  Analytics,
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import { History, Preference } from '../../Preferences';

type State = {
  navigation: Object
};

export default class App extends Component {
  state: State;
  _menu: any;

  constructor(props: Object) {
    super(props);

    const onboarded = Preference.booleanForKey(Preference.Keys.Launch.Onboarded);
    const route = (onboarded ? discoverURL({title: Localizable.t('discover')}) : onboardingURL({title: 'Onboarding', modal: true}));
    this.state = {
      navigation: {
        index: 0,
        routes: [
          route
        ],
      }
    };
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this._onHardwareBackPress);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this._onHardwareBackPress);
  }

  render() {
    const { navigation } = this.state;
    const route = navigation.routes[navigation.index];

    const scene = this._renderPage({route});
    if (route.modal) return scene;

    const navigationHeader = this._renderNavigationHeader({navigationState: navigation});
    const toolbar = this._renderToolbar({navigationState: navigation, jumpToIndex: this._jumpToIndex});
    return (
      <MenuContext ref={component => this._menu = component} style={{flex: 1}}>
        {navigationHeader}
        {scene}
        {toolbar}
      </MenuContext>
    );
  }

  _renderPage = (props: any) => {
    const scene = this._renderScene(props);
    if (props.route.modal) return scene;

    const marginBottom = (Platform.OS === 'android' ? null : Toolbar.HEIGHT);
    return (
      <View style={{flex: 1, marginBottom}}>
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

  _renderNavigationHeader = (props: any) => {
    const { navigationState } = props;
    const navigationRoute = navigationState.routes[navigationState.index];

    const { route, params} = router.match(navigationRoute.path);
    const Scene = route.scene;

    let renderRightComponent = null;
    if (Platform.OS === 'android') {
      const menu = this._renderMenu(Scene.renderMenuOptions, {...props, navigate: this._navigate});

      renderRightComponent = (props: Object) => {
        return (
          <View>
            {menu}
            <NavigationBarButton
              imageSource={require('../../Components/Navigation/Images/nav-more.png')}
              onPress={() => this._menu.openMenu('menu')}
            />
          </View>
        );
      };
    } else {
      renderRightComponent = Scene.renderNavigationHeaderRightComponent;
    }

    return (
      <NavigationHeader
        routeParams={params}
        navigate={this._navigate}
        renderLeftComponent={Scene.renderNavigationHeaderLeftComponent}
        renderTitleComponent={Scene.renderNavigationHeaderTitleComponent}
        renderRightComponent={renderRightComponent}
        style={Scene.NavigationHeaderStyle}
        title={navigationRoute.title}
      />
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
            imageSource={require('../Navigation/Images/tb-back.png')}
            onPress={() => this._goBack()}
          />
          <ToolbarButton
            disabled={!canGoForward}
            imageSource={require('../Navigation/Images/tb-forward.png')}
            onPress={() => this._goForward()}
          />
        </View>
        <View style={{flex: 0}}>
          <ToolbarButton
            imageSource={require('../Navigation/Images/nav-discoverycenter.png')}
            onPress={() => {this._pushRoute({path: '/DiscoveryCenter', modal: true})}}
          />
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
          <ToolbarButton
            imageSource={require('../Navigation/Images/nav-search.png')}
            onPress={() => {this._pushRoute({path: '/Reader/Search', modal: true})}}
          />
          <ToolbarButton
            imageSource={require('../Navigation/Images/nav-bookmarks.png')}
            onPress={() => {this._pushRoute({path: '/Bookmarks', modal: true})}}
          />
        </View>
      </Toolbar>
    );
  };

  _renderMenu = (options: Function, props: any) => {
    const menuOptions = (options ? options(props) : null);
    return (
      <Menu name="menu">
        <MenuTrigger />
        <MenuOptions>
          {/* <MenuOption value={1} text='One'/>
          <MenuOption value={2}>
            <Text style={{color: 'red'}}>Two</Text>
          </MenuOption>
          <MenuOption value={3} disabled={true} text='Three' /> */}
          {menuOptions}
        </MenuOptions>
      </Menu>
    );
  }

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
      navigation: { ...this.state.navigation, index }
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

    if (this._interceptRoute(route)) return;

    if (state.index - 1 > 0) {
      const previousRoute = state.routes[state.index - 1];
      if (previousRoute.path === route.path) {
        this._popRoute();
        return;
      }
    }

    if (state.index + 1 < state.routes.length - 1) {
      const nextRoute = state.routes[state.index + 1];
      if (nextRoute.path === route.path) {
        this._goForward();
        return;
      }
    }

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
    Analytics.logRoute(route);
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
    Analytics.logRoute(route);
  };

  _interceptRoute = (route: any): boolean => {
    const path = route.path.toLowerCase();

    if (this._isSphereRoute(route)) {
      const timestamp = Math.floor(Date.now() / 1000);
      const expired = (timestamp - 1477980000 > 0); // Nov 1
      const prompted = Preference.booleanForKey(Preference.Keys.Spheres.Prompted);
      if (!expired && prompted) {
        return false;
      }

      let title = null;
      if (expired) {
        title = Localizable.t('spheres.text');
      } else if (!prompted) {
        title = Localizable.t('spheres-trial');
      } else {
        title = Localizable.t('update-required');
      }

      this._pushRoute(sphereInAppPurchaseURL({title, expired, redirect: route, modal: true}));
      return true;
    }
    return false;
  };

  _isSphereRoute = (route: any): boolean => {
    const path = route.path.toLowerCase();
    return path.indexOf('sphere') != -1 && route.path !== sphereInAppPurchaseURL().path && route.path !== sphereHelpURL().path;
  };

  _onHardwareBackPress = () => {
    const { navigation } = this.state;
    const canGoBack = navigation.index > 0;
    if (canGoBack) {
      this._popRoute();
      return true;
    }

    return false;
  };
}

const styles = StyleSheet.create({

});
