/* @flow */
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';

import { NavigationBar, Toolbar, ToolbarButton } from '../Navigation';

import Bookmarks from '../../Scenes/Bookmarks/Bookmarks';
import BookChapters from '../../Scenes/Books/BookChapters';
import BookOverview from '../../Scenes/Books/BookOverview';
import Books from '../../Scenes/Books/Books';
import BookSources from '../../Scenes/Books/BookSources';
import BookSpheres from '../../Scenes/Books/BookSpheres';
import BookWords from '../../Scenes/Books/BookWords';
import Discover from '../../Scenes/Discover/Discover';
import DiscoveryCenter from '../../Scenes/DiscoveryCenter/DiscoveryCenter';
import Reader from '../../Scenes/Reader/Reader';
import Sources from '../../Scenes/Sources/Sources';
import SourceOverview from '../../Scenes/Sources/SourceOverview';
import SourceBooks from '../../Scenes/Sources/SourceBooks';
import SourceConversations from '../../Scenes/Sources/SourceConversations';
import SourceSpheres from '../../Scenes/Sources/SourceSpheres';
import SourceWords from '../../Scenes/Sources/SourceWords';
import Spheres from '../../Scenes/Spheres/Spheres';
import SphereOverview from '../../Scenes/Spheres/SphereOverview';
import SphereBooks from '../../Scenes/Spheres/SphereBooks';
import SphereSources from '../../Scenes/Spheres/SphereSources';
import SphereWords from '../../Scenes/Spheres/SphereWords';

export default class App extends Component {
  state = {
    navigation: {
      index: 0,
      routes: [
        {key: '/Bookmarks'},
      ],
    }
  };

  render() {
    const { navigation } = this.state;
    const route = navigation.routes[navigation.index];
    const scene = this._renderPage({route});
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
    return (
      <View style={{flex: 1, marginTop: NavigationBar.HEIGHT, marginBottom: Toolbar.HEIGHT}}>
        {scene}
      </View>
    );
  };

  _renderScene = (props: any) => {
    const { route } = props;

    switch (route.key) {
      case '/Bookmarks':
        return <Bookmarks onPress={(route) => this._pushRoute(this.state.navigation, route)}/>;
      case '/Books':
        return <Books />;
      case '/Books/Chapters':
        return <BookChapters />;
      case '/Books/Overview':
        return <BookOverview />;
      case '/Books/Sources':
        return <BookSources />;
      case '/Books/Spheres':
        return <BookSpheres />;
      case '/Books/Words':
        return <BookWords />;
      case '/Discover':
        return <Discover />;
      case '/DiscoveryCenter':
        return <DiscoveryCenter />;
      case '/Reader':
        return <Reader />;
      case '/Sources':
        return <Sources />;
      case '/Sources/Overview':
        return <SourceOverview />;
      case '/Sources/Books':
        return <SourceBooks />;
      case '/Sources/Conversations':
        return <SourceConversations />;
      case '/Sources/Spheres':
        return <SourceSpheres />;
      case '/Sources/Words':
        return <SourceWords />;
      case '/Spheres':
        return <Spheres />;
      case '/Spheres/Overview':
        return <SphereOverview />;
      case '/Spheres/Books':
        return <SphereBooks />;
      case '/Spheres/Sources':
        return <SphereSources />;
      case '/Spheres/Words':
        return <SphereWords />;
      default:
        return null;
    };
  };

  _renderNavigationBar = (props: any) => {
    const { navigationState } = props;
    const route = navigationState.routes[navigationState.index];
    return (
      <NavigationBar title={route.key}/>
    );
  };

  _renderToolbar = (props: any) => {
    const { navigationState, jumpToIndex } = props;
    const canGoBack = navigationState.index > 0;
    const canGoForward = navigationState.index < navigationState.routes.length - 1;

    return (
      <Toolbar>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <ToolbarButton
            disabled={!canGoBack}
            imageSource={require('../Navigation/Images/nav-back.png')}
            onPress={() => this._popRoute(this.state.navigation)}
          />
          <ToolbarButton
            disabled={!canGoForward}
            imageSource={require('../Navigation/Images/nav-forward.png')}
            onPress={() => jumpToIndex(navigationState.index + 1)}
          />
        </View>
        <View style={{flex: 1}}>
          <ToolbarButton
            imageSource={require('../Navigation/Images/nav-discoverycenter.png')}
            onPress={() => {}}
          />
        </View>
        <ToolbarButton
          imageSource={require('../Navigation/Images/nav-bookmarks.png')}
          onPress={() => {}}
        />
      </Toolbar>
    );
  };

  _jumpToIndex = (index: number) => {
    this.setState({
      navigation: { ...this.state.navigation, index },
    });
  };

  _pushRoute = (state: any, route: any) => {
    const routes = [
      ...state.routes,
      route,
    ];

    const navigation = {
      ...state,
      index: routes.length - 1,
      routes,
    };

    if (navigation !== this.state.navigation) {
      this.setState({navigation});
    }
  };

  _popRoute = (state: any) => {
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

    if (navigation !== this.state.navigation) {
      this.setState({navigation});
    }
  };
}
