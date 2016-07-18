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
    const book = this._findBook(route.bookID);
    const source = this._findSource(route.sourceID);
    const sphere = this._findSphere(route.sphereID);

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
          onPressBook={book => this._pushRoute({key: '/Books/Overview', bookID: book.key, title: Localizable.t('book-overview', {name: book.name})})}
        />;
      case '/Books/Chapters':
        return <BookChapters
          bible={Bible}
          bookID={route.bookID}
          onPressScripture={({book, chapterNumber}) => this._pushRoute({key: '/Reader', bookID: route.bookID, chapterNumber, title: book.name})}
        />;
      case '/Books/Overview':
        return <BookOverview
          bible={Bible}
          bookID={route.bookID}
          onPressChapters={() => this._pushRoute({key: '/Books/Chapters', bookID: route.bookID, title: Localizable.t('book-chapters', {name: book.name})})}
          onPressScripture={({book, chapterNumber}) => this._pushRoute({key: '/Reader', bookID: book.key, chapterNumber, title: book.name})}
          onPressSource={(source) => this._pushRoute({key: '/Sources/Overview', sourceID: source.key, bookID: route.bookID, title: Localizable.t('book-source', {book: book.name, source: source.name})})}
          onPressSources={() => this._pushRoute({key: '/Books/Sources', bookID: route.bookID, title: Localizable.t('book-sources', {name: book.name})})}
          onPressSpheres={() => this._pushRoute({key: '/Books/Spheres', bookID: route.bookID, title: Localizable.t('book-spheres', {name: book.name})})}
          onPressWords={() => this._pushRoute({key: '/Books/Words', bookID: route.bookID, title: Localizable.t('book-words', {name: book.name})})}
        />;
      case '/Books/Sources':
        return <BookSources
          bible={Bible}
          bookID={route.bookID}
          onPressScripture={({book, chapterNumber}) => this._pushRoute({key: '/Reader', bookID: book.key, chapterNumber, title: book.name})}
          onPressSource={(source) => this._pushRoute({key: '/Sources/Overview', sourceID: source.key, bookID: route.bookID, title: Localizable.t('book-source', {book: book.name, source: source.name})})}
        />;
      case '/Books/Spheres':
        return <BookSpheres
          bible={Bible}
          bookID={route.bookID}
          onPressSphere={sphere => this._pushRoute({key: '/Spheres', sphereID: sphere.key, title: Localizable.t('spheres.text')})}
        />;
      case '/Books/Words':
        return <BookWords
          bible={Bible}
          bookID={route.bookID}
          onPressWords={() => {}}
        />;
      case '/Discover':
        return <Discover
          bible={Bible}
          onPressBook={book => this._pushRoute({key: '/Books/Overview', bookID: book.key, title: Localizable.t('book-overview', {name: book.name})})}
          onPressBooks={() => this._pushRoute({key: '/Books', title: Localizable.t('books')})}
          onPressScripture={({book, chapterNumber}) => this._pushRoute({key: '/Reader', bookID: book.key, chapterNumber, title: book.name})}
          onPressSphere={sphere => this._pushRoute({key: '/Spheres', sphereID: sphere.key, title: Localizable.t('spheres.text')})}
          onPressSource={(source) => this._pushRoute({key: '/Sources/Overview', sourceID: source.key, title: source.name})}
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
          bookID={route.bookID}
          chapterNumber={route.chapterNumber || 1
        }/>;
      case '/Sources':
        return <Sources
          bible={Bible}
          onPressSource={(source) => source && this._pushRoute({key: '/Sources/Overview', sourceID: source.key, title: source.name})}
        />;
      case '/Sources/Overview':
        return <SourceOverview
          bible={Bible}
          onPressBooks={() => this._pushRoute({key: '/Sources/Books', sourceID: route.sourceID, title: Localizable.t('source-books', {name: source.name})})}
          onPressConversations={() => this._pushRoute({key: '/Sources/Conversations', sourceID: route.sourceID, title: Localizable.t('source-conversations', {name: source.name})})}
          onPressSource={(source) => source && this._pushRoute({key: '/Sources/Overview', sourceID: source.key, title: source.name})}
          onPressSpheres={() => this._pushRoute({key: '/Sources/Spheres', sourceID: route.sourceID, title: Localizable.t('source-spheres', {name: source.name})})}
          onPressWords={() => this._pushRoute({key: '/Sources/Words', sourceID: route.sourceID, title: Localizable.t('source-words', {name: source.name})})}
          sourceID={route.sourceID}
        />;
      case '/Sources/Books':
        return <SourceBooks
          bible={Bible}
          sourceID={route.sourceID}
        />;
      case '/Sources/Conversations':
        return <SourceConversations
          bible={Bible}
          sourceID={route.sourceID}
        />;
      case '/Sources/Spheres':
        return <SourceSpheres
          bible={Bible}
          sourceID={route.sourceID}
        />;
      case '/Sources/Words':
        return <SourceWords
          bible={Bible}
          sourceID={route.sourceID}
        />;
      case '/Spheres':
        return <Spheres
          bible={Bible}
          onPressBook={({sphere, book}) => this._pushRoute({key: '/Books/Overview', bookID: book.key, title: Localizable.t('book-overview', {name: book.name})})}
          onPressBooks={({sphere}) => this._pushRoute({key: '/Spheres/Books', sphereID: sphere.key, title: sphere.name })}
          onPressPassages={({sphere}) => this._pushRoute({key: '/Spheres/Passages', sphereID: sphere.key, title: sphere.name })}
          onPressSources={({sphere}) => this._pushRoute({key: '/Spheres/Sources', sphereID: sphere.key, title: sphere.name })}
          onPressWords={({sphere}) => this._pushRoute({key: '/Spheres/Words', sphereID: sphere.key, title: sphere.name })}
          sphereID={route.sphereID}
        />;
      case '/Spheres/Books':
        return <SphereBooks
          bible={Bible}
          onPressBook={({sphere, book}) => this._pushRoute({key: '/Books/Overview', bookID: book.key, title: Localizable.t('book-overview', {name: book.name})})}
          sphereID={route.sphereID}
        />;
      case '/Spheres/Passages':
        return <SpherePassages
          bible={Bible}
          sphereID={route.sphereID}
        />;
      case '/Spheres/Sources':
        return <SphereSources
          bible={Bible}
          sphereID={route.sphereID}
        />;
      case '/Spheres/Words':
        return <SphereWords
          bible={Bible}
          onPressWords={() => {}}
          sphereID={route.sphereID}
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

  _findBook(bookID: string) {
    return Bible.books.find(book => book.key === bookID);
  }

  _findSource(sourceID: string): Object {
    return Bible.sources.find(source => source.key === sourceID);
  }

  _findSphere(sphereID: string): Object {
    return Bible.spheres.find(sphere => sphere.key === sphereID);
  }
}

const styles = StyleSheet.create({

});
