/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { NavigationBar, Toolbar, ToolbarButton } from '../Navigation';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

const Bible = require('../../Locale/en/NLT/SourceView.json');

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
import SphereBooks from '../../Scenes/Spheres/SphereBooks';
import SpherePassages from '../../Scenes/Spheres/SpherePassages';
import SphereSources from '../../Scenes/Spheres/SphereSources';
import SphereWords from '../../Scenes/Spheres/SphereWords';

export default class App extends Component {
  state = {
    navigation: {
      index: 0,
      routes: [
        {key: '/Discover', title: Localizable.t('discover')},
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
    const { route } = props;

    switch (route.key) {
      case '/Bookmarks':
        return <Bookmarks
          bible={Bible}
          onPressDone={() => this._popRoute()}
          onPressRoute={(route) => {
            this._popRoute(() => {
              this._pushRoute(route);
            });
          }}
        />;
      case '/Books':
        return <Books
          bible={Bible}
          onPressBook={book => this._pushRoute({key: '/Books/Overview', book: book, title: Localizable.t('book-overview', {name: book.name})})}
        />;
      case '/Books/Chapters':
        return <BookChapters
          bible={Bible}
          bookID={route.book.key}
          onPressScripture={({book, chapterNumber}) => this._pushRoute({key: '/Reader', book, chapterNumber, title: book.name})}
        />;
      case '/Books/Overview':
        return <BookOverview
          bible={Bible}
          bookID={route.book.key}
          onPressChapters={() => this._pushRoute({key: '/Books/Chapters', book: route.book, title: Localizable.t('book-chapters', {name: route.book.name})})}
          onPressScripture={({book, chapterNumber}) => this._pushRoute({key: '/Reader', book, chapterNumber, title: book.name})}
          onPressSource={(source) => this._pushRoute({key: '/Sources/Overview', source: source, book: route.book, title: Localizable.t('book-source', {book: route.book.name, source: source.name})})}
          onPressSources={() => this._pushRoute({key: '/Books/Sources', book: route.book, title: Localizable.t('book-sources', {name: route.book.name})})}
          onPressSpheres={() => this._pushRoute({key: '/Books/Spheres', book: route.book, title: Localizable.t('book-spheres', {name: route.book.name})})}
          onPressWords={() => this._pushRoute({key: '/Books/Words', book: route.book, title: Localizable.t('book-words', {name: route.book.name})})}
        />;
      case '/Books/Sources':
        return <BookSources
          bible={Bible}
          bookID={route.book.key}
          onPressScripture={({book, chapterNumber}) => this._pushRoute({key: '/Reader', book, chapterNumber, title: book.name})}
          onPressSource={(source) => this._pushRoute({key: '/Sources/Overview', source: source, book: route.book, title: Localizable.t('book-source', {book: route.book.name, source: source.name})})}
        />;
      case '/Books/Spheres':
        return <BookSpheres
          bible={Bible}
          bookID={route.book.key}
          onPressSphere={sphere => this._pushRoute({key: '/Spheres', sphere: sphere, title: Localizable.t('spheres.text')})}
        />;
      case '/Books/Words':
        return <BookWords
          bible={Bible}
          bookID={route.book.key}
          onPressWords={() => {}}
        />;
      case '/Discover':
        return <Discover
          bible={Bible}
          onPressBook={book => this._pushRoute({key: '/Books/Overview', book: book, title: Localizable.t('book-overview', {name: book.name})})}
          onPressBooks={() => this._pushRoute({key: '/Books', title: Localizable.t('books')})}
          onPressScripture={({book, chapterNumber}) => this._pushRoute({key: '/Reader', book, chapterNumber, title: book.name})}
          onPressSphere={sphere => this._pushRoute({key: '/Spheres', sphere: sphere, title: Localizable.t('spheres.text')})}
          onPressSource={(source) => this._pushRoute({key: '/Sources/Overview', source: source, title: source.name})}
          onPressSources={() => this._pushRoute({key: '/Sources', title: Localizable.t('sources.text')})}
          onPressSpheres={() => this._pushRoute({key: '/Spheres', title: Localizable.t('spheres.text')})}
        />;
      case '/DiscoveryCenter':
        return <DiscoveryCenter
          bible={Bible}
          onPressDone={() => this._popRoute()}
        />;
      case '/Reader':
        return <Reader
          bible={Bible}
          book={route.book}
          chapterNumber={route.chapterNumber || 1
        }/>;
      case '/Sources':
        return <Sources
          bible={Bible}
          bible={Bible}
          onPressSource={(source) => source && this._pushRoute({key: '/Sources/Overview', source: source, title: source.name})}
        />;
      case '/Sources/Overview':
        return <SourceOverview
          bible={Bible}
          onPressBooks={() => this._pushRoute({key: '/Sources/Books', source: route.source, title: Localizable.t('source-books', {name: route.source.name})})}
          onPressConversations={() => this._pushRoute({key: '/Sources/Conversations', source: route.source, title: Localizable.t('source-conversations', {name: route.source.name})})}
          onPressSource={(source) => source && this._pushRoute({key: '/Sources/Overview', source: source, title: source.name})}
          onPressSpheres={() => this._pushRoute({key: '/Sources/Spheres', source: route.source, title: Localizable.t('source-spheres', {name: route.source.name})})}
          onPressWords={() => this._pushRoute({key: '/Sources/Words', source: route.source, title: Localizable.t('source-words', {name: route.source.name})})}
          source={route.source}
        />;
      case '/Sources/Books':
        return <SourceBooks
          bible={Bible}
          source={route.source}
        />;
      case '/Sources/Conversations':
        return <SourceConversations
          bible={Bible}
          source={route.source}
        />;
      case '/Sources/Spheres':
        return <SourceSpheres
          bible={Bible}
          source={route.source}
        />;
      case '/Sources/Words':
        return <SourceWords
          bible={Bible}
          source={route.source}
        />;
      case '/Spheres':
        return <Spheres
          bible={Bible}
          onPressBook={({sphere, book}) => this._pushRoute({key: '/Books/Overview', book: book, title: Localizable.t('book-overview', {name: book.name})})}
          onPressBooks={({sphere}) => this._pushRoute({key: '/Spheres/Books', sphere: sphere, title: sphere.name })}
          onPressPassages={({sphere}) => this._pushRoute({key: '/Spheres/Passages', sphere: sphere, title: sphere.name })}
          onPressSources={({sphere}) => this._pushRoute({key: '/Spheres/Sources', sphere: sphere, title: sphere.name })}
          onPressWords={({sphere}) => this._pushRoute({key: '/Spheres/Words', sphere: sphere, title: sphere.name })}
          sphere={route.sphere}
        />;
      case '/Spheres/Books':
        return <SphereBooks
          bible={Bible}
          onPressBook={({sphere, book}) => this._pushRoute({key: '/Books/Overview', book: book, title: Localizable.t('book-overview', {name: book.name})})}
          sphere={route.sphere}
        />;
      case '/Spheres/Passages':
        return <SpherePassages
          bible={Bible}
          sphere={route.sphere}
        />;
      case '/Spheres/Sources':
        return <SphereSources
          bible={Bible}
          sphere={route.sphere}
        />;
      case '/Spheres/Words':
        return <SphereWords
          bible={Bible}
          sphere={route.sphere}
        />;
      default:
        return null;
    };
  };

  _renderNavigationBar = (props: any) => {
    const { navigationState } = props;
    const route = navigationState.routes[navigationState.index];
    return (
      <NavigationBar title={route.title}/>
    );
  };

  _renderToolbar = (props: any) => {
    const { navigationState } = props;
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
            onPress={() => {this._pushRoute({key: '/DiscoveryCenter', modal: true})}}
          />
        </View>
        <ToolbarButton
          imageSource={require('../Navigation/Images/nav-bookmarks.png')}
          onPress={() => {this._pushRoute({key: '/Bookmarks', modal: true})}}
        />
      </Toolbar>
    );
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
    if (route.key === currentRoute.key) return;

    const delta = (state.routes.length - state.index) - 1;

    const routes = [
      ...(delta > 0 ? state.routes.slice(0, -delta) : state.routes),
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

    if (navigation !== this.state.navigation) {
      this.setState({navigation}, callback);
    }
  };
}

const styles = StyleSheet.create({

});
