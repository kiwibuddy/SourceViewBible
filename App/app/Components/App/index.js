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
        {key: '/Discover'},
      ],
    },
    showBookmarks: false
  };

  render() {
    if (this.state.showBookmarks) {
      return this._renderBookmarks();
    }

    const { navigation } = this.state;
    const route = navigation.routes[navigation.index];
    const navigationBar = this._renderNavigationBar({navigationState: navigation});
    const toolbar = this._renderToolbar({navigationState: navigation, jumpToIndex: this._jumpToIndex});
    const scene = this._renderPage({route});

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
      case '/Books':
        return <Books onPressBook={book => this._pushRoute({key: '/Books/Overview', book: book})} />;
      case '/Books/Chapters':
        return <BookChapters
          book={route.book}
          onPressScripture={({book, chapterNumber}) => this._pushRoute({key: '/Reader', book, chapterNumber})}
        />;
      case '/Books/Overview':
        return <BookOverview
          book={route.book}
          onPressChapters={() => this._pushRoute({key: '/Books/Chapters', book: route.book})}
          onPressScripture={({book, chapterNumber}) => this._pushRoute({key: '/Reader', book, chapterNumber})}
          onPressSource={(source) => this._pushRoute({key: '/Sources/Overview', source: source})}
          onPressSources={() => this._pushRoute({key: '/Books/Sources', book: route.book})}
          onPressSpheres={() => this._pushRoute({key: '/Books/Spheres', book: route.book})}
          onPressWords={() => this._pushRoute({key: '/Books/Words', book: route.book})}
        />;
      case '/Books/Sources':
        return <BookSources
          book={route.book}
          onPressScripture={({book, chapterNumber}) => this._pushRoute({key: '/Reader', book, chapterNumber})}
        />;
      case '/Books/Spheres':
        return <BookSpheres book={route.book} />;
      case '/Books/Words':
        return <BookWords book={route.book} />;
      case '/Discover':
        return <Discover
          onPressBook={book => this._pushRoute({key: '/Books/Overview', book: book})}
          onPressBooks={() => this._pushRoute({key: '/Books'})}
          onPressScripture={({book, chapterNumber}) => this._pushRoute({key: '/Reader', book, chapterNumber})}
        />;
      case '/DiscoveryCenter':
        return <DiscoveryCenter />;
      case '/Reader':
        return <Reader book={route.book} chapterNumber={route.chapterNumber || 1}/>;
      case '/Sources':
        return <Sources />;
      case '/Sources/Overview':
        return <SourceOverview source={route.source} />;
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

  _renderBookmarks = () => {
    return (
      <View style={{flex: 1}}>
        <NavigationBar title='Bookmarks'/>
        <View style={{flex: 1, marginTop: NavigationBar.HEIGHT}}>
          <Bookmarks
            onPress={(route) => {
              this.setState({showBookmarks: false}, () => {
                this._pushRoute(route);
              });
            }}
          />
        </View>
      </View>
    );
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
            onPress={() => jumpToIndex(navigationState.index - 1)}
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
          onPress={() => {this.setState({showBookmarks: true})}}
        />
      </Toolbar>
    );
  };

  _jumpToIndex = (index: number) => {
    this.setState({
      navigation: { ...this.state.navigation, index },
    });
  };

  _pushRoute = (route: any) => {
    const routes = [
      ...this.state.navigation.routes,
      route,
    ];

    const navigation = {
      ...this.state.navigation,
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
