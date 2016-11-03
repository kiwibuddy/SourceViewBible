/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  BackAndroid,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { NavigationHeader, NavigationBarButton, Toolbar } from '../Navigation';
// $FlowFixMe: Can't find os module extension
import DefaultToolbar from '../Navigation/DefaultToolbar';

import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  NotAnimatedContextMenu,
  renderers
} from 'react-native-popup-menu';
Menu.setDefaultRenderer(renderers.NotAnimatedContextMenu);

import router, { BACK, FORWARD, aboutURL, booksURL, discoverURL, onboardingURL, spheresURL, sphereHelpURL, sphereInAppPurchaseURL, sourcesURL } from '../../Navigation';

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

    return (
      <View style={{flex: 1, marginBottom: Toolbar.HEIGHT}}>
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
    return <Scene
      {...props.route}
      {...params}
      canGoBack={this._canGoBack()}
      canGoForward={this._canGoForward()}
      navigate={this._navigate}
    />;
  };

  _renderNavigationHeader = (props: any) => {
    const { navigationState } = props;
    const navigationRoute = navigationState.routes[navigationState.index];

    const { route, params} = router.match(navigationRoute.path);
    const Scene = route.scene;

    let renderRightComponent = null;
    if (Platform.OS === 'android') {
      const menu = this._renderMenu(Scene.renderMenuOptions, {...props, navigate: this._navigate});

      let rightComponent = null;
      if (Scene.renderNavigationHeaderRightComponent) {
        rightComponent = Scene.renderNavigationHeaderRightComponent({...props, navigate: this._navigate});
      }

      renderRightComponent = (props: Object) => {
        const moreButtonStyle = (rightComponent ? {paddingLeft: 0} : {});
        return (
          <View style={{flex: 1}}>
            {menu}
            <View style={{flex: 1, flexDirection: 'row'}}>
              {rightComponent}
              <NavigationBarButton
                imageSource={require('../../Components/Navigation/Images/nav-more.png')}
                onPress={() => this._menu.openMenu('menu')}
                style={moreButtonStyle}
              />
            </View>
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

    return (
      <DefaultToolbar
        canGoBack={this._canGoBack()}
        canGoForward={this._canGoForward()}
        navigate={this._navigate}
      />
    );
  };

  _renderMenu = (options: Function, props: any) => {
    const { navigationState, navigate } = props;
    const canGoForward = this._canGoForward();

    let forwardMenuOption = null;
    if (canGoForward) {
      forwardMenuOption = <MenuOption key="forward" text={Localizable.t('forward')} onSelect={() => this._goForward()} />
    } else {
      forwardMenuOption = <MenuOption key="forward" disabled={true}>
        <Text style={[StyleSheet.styles.menu.optionsStyles.optionText, {color: 'gray'}]}>{Localizable.t('forward')}</Text>
      </MenuOption>;
    }

    const menuOptions = [];
    menuOptions.push(forwardMenuOption);

    if (options) {
      menuOptions.push(options(props));
    }

    menuOptions.push(<MenuOption key="discover" text={Localizable.t('discover')} onSelect={() => navigate(discoverURL({title: Localizable.t('discover')})) } />);
    menuOptions.push(<MenuOption key="books" text={Localizable.t('books')} onSelect={() => navigate(booksURL({title: Localizable.t('books')})) } />);
    menuOptions.push(<MenuOption key="sources" text={Localizable.t('sources.text')} onSelect={() => navigate(sourcesURL({title: Localizable.t('sources.text')})) } />);
    menuOptions.push(<MenuOption key="spheres" text={Localizable.t('spheres.text')} onSelect={() => navigate(spheresURL({title: Localizable.t('spheres.text')})) } />);
    menuOptions.push(<MenuOption key="about" text={Localizable.t('about-sourceview')} onSelect={() => navigate(aboutURL({title: Localizable.t('about-sourceview'), modal: true})) } />);

    return (
      <Menu name="menu">
        <MenuTrigger />
        <MenuOptions customStyles={StyleSheet.styles.menu.optionsStyles}>
          {menuOptions}
        </MenuOptions>
      </Menu>
    );
  }

  _navigate = (route: any, options?: any) => {
    if (route === BACK) {
      if (options && options.replace === false) {
        this._goBack();
      } else {
        this._popRoute();
      }
    } else if (route === FORWARD) {
      this._goForward();
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

  _canGoBack = () => {
    return this.state.navigation.index > 0;
  }

  _goBack = () => {
    this._jumpToIndex(this.state.navigation.index - 1);
  };

  _canGoForward = () => {
    return this.state.navigation.index < this.state.navigation.routes.length - 1;
  }

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

  _popRoute = () => {
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
      this.setState({navigation});
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
      const purchased = Preference.booleanForKey(Preference.Keys.Spheres.Purchased);
      if (purchased) {
        return false;
      }

      let title =  Localizable.t('spheres.text');
      this._pushRoute(sphereInAppPurchaseURL({title, redirect: route, modal: true}));
      return true;
    }
    return false;
  };

  _isSphereRoute = (route: any): boolean => {
    const path = route.path.toLowerCase();
    return path.indexOf('sphere') != -1 && route.path !== sphereInAppPurchaseURL().path && route.path !== sphereHelpURL().path;
  };

  _onHardwareBackPress = () => {
    const canGoBack = this._canGoBack();
    if (canGoBack) {
      this._goBack();
      return true;
    }

    return false;
  };
}

const styles = StyleSheet.create({

});
