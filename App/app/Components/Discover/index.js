/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, {
  View,
  Text,
  Image,
  ListView,
  ScrollView,
  TouchableOpacity,
  RecyclerViewBackedScrollView,
  NavigationExperimental,
  Dimensions
} from 'react-native';

const {
  Header: NavigationHeader,
  CardStack: NavigationCardStack
} = NavigationExperimental;

const NavigationHeaderBackButton = require('../Common/NavigationHeaderBackButton');

import { connect } from 'react-redux';

import { actions } from 'react-native-navigation-redux-helpers';
const {
  popRoute,
  pushRoute
} = actions;

import Book from '../Books/Book';
import BookChapters from '../Books/Book/BookChapters';
import BookSources from '../Books/Book/BookSources';
import BookSpheres from '../Books/Book/BookSpheres';
import BookWords from '../Books/Book/BookWords';

import Books from '../Books';
import Reader from '../Reader';

import {
  Colors,
  StyleSheet,
} from '../../Common';

import DiscoverBooks from './DiscoverBooks';

import Localizable from '../../Common/Localizable';

class Discover extends Component {
  render() {
    return (
      <NavigationCardStack
        direction={'horizontal'}
        navigationState={this.props.navigation}
        onNavigate={ () => {} }
        renderOverlay={this._renderOverlay}
        renderScene={this._renderScene}
        style={styles.main}
      />
    );
  }

  _renderOverlay = (props: Object) => {
    return (
      <NavigationHeader
        {...props}
        style={{elevation: 0}}
        renderTitleComponent={this._renderTitleComponent}
        renderLeftComponent={this._renderLeftComponent}
      />
    );
  };

  _renderTitleComponent = (props: Object) => {
    const title = props.scene.route.title;
    return (
      <NavigationHeader.Title
        {...props}
        style={{alignSelf: 'center', left: null, right: null}}
      >{title}</NavigationHeader.Title>
    );
  };

  _renderLeftComponent = (props: Object) => {
    const { scene, scenes } = props;
    const { dispatch, navigation } = this.props;
    if (scene.index == 0) return null;
    const title = scene.route.title;

    let backButtonTitle = null;

    const previousScene = scenes[scene.index - 1];
    const previousTitle = previousScene.route.title;
    if (previousTitle && previousTitle !== title && scene.route.showsBackButton !== false && previousTitle.length < 15) {
      backButtonTitle = <Text style={{marginLeft: -10, color: Colors.tintColor, fontSize: 17}}>{previousTitle}</Text>
    }

    return (
      <NavigationHeaderBackButton {...props} onNavigate={() => dispatch(popRoute(navigation.key))}>
      {backButtonTitle}
      </NavigationHeaderBackButton>
    );
  };

  _renderScene = (props: Object) => {
    if (props.scene.route.key === 'discover') {
      return this._renderDiscover();
    }

    if (props.scene.route.key === 'book') {
      const book = props.scene.route.book;
      return <Book
        book={book}
        onPressChapters={this._onPressChapters}
        onPressSources={this._onPressSources}
        onPressSpheres={this._onPressSpheres}
        onPressWords={this._onPressWords}
        onPressScripture={this._onPressScripture}
      />
    }

    if (props.scene.route.key === 'chapters') {
      const book = props.scene.route.book;
      return <BookChapters book={book} onPressScripture={this._onPressScripture} />
    }

    if (props.scene.route.key === 'sources') {
      const book = props.scene.route.book;
      return <BookSources book={book} onPressScripture={this._onPressScripture} />
    }

    if (props.scene.route.key === 'spheres') {
      const book = props.scene.route.book;
      return <BookSpheres book={book} />
    }

    if (props.scene.route.key === 'words') {
      const book = props.scene.route.book;
      return <BookWords book={book} />
    }

    if (props.scene.route.key === 'books') {
      return <Books onPressBook={this._onPressBook}/>
    }

    if (props.scene.route.key === 'reader') {
      const book = props.scene.route.book;
      const chapterNumber = props.scene.route.chapterNumber;
      return <Reader book={book} chapterNumber={chapterNumber} />
    }
  }

  _renderDiscover = () => {
    return (
      <ScrollView style={styles.container}>
        <DiscoverBooks onPressBooks={this._onPressBooks} onPressBook={this._onPressBook} onPressScripture={this._onPressScripture} />

        <View style={styles.separator}></View>

        {this._renderBlankSection("Sources")}

        <View style={styles.separator}></View>

        {this._renderBlankSection("Spheres")}

        <View style={styles.separator}></View>

        {this._renderBlankSection("Words")}

      </ScrollView>
    );
  }

  _renderBlankSection = (title: string) => {
    return (
      <View>
        <View style={styles.sectionHeaderContainer}>
          <Text style={StyleSheet.styles.sectionHeaderTitle}>{title.toLocaleUpperCase()}</Text>
        </View>

        <View style={[styles.sectionContainer, {paddingBottom: 15, marginHorizontal: 4}]}>
          <View style={styles.itemContainerBlank}></View>
          <View style={styles.itemContainerBlank}></View>
          <View style={styles.itemContainerBlank}></View>
        </View>
      </View>
    );
  };

  _onPressBook = (book: Object) => {
    const { dispatch, navigation } = this.props;

    dispatch(pushRoute({
      key: 'book',
      title: book.name,
      book
    }, navigation.key));
  };

  _onPressChapters = (book: Object) => {
    const { dispatch, navigation } = this.props;

    dispatch(pushRoute({
      key: 'chapters',
      title: 'Chapters',
      book
    }, navigation.key));
  };

  _onPressSources = (book: Object) => {
    const { dispatch, navigation } = this.props;

    dispatch(pushRoute({
      key: 'sources',
      title: 'Sources',
      book
    }, navigation.key));
  };

  _onPressSpheres = (book: Object) => {
    const { dispatch, navigation } = this.props;

    dispatch(pushRoute({
      key: 'spheres',
      title: 'Spheres',
      book
    }, navigation.key));
  };

  _onPressWords = (book: Object) => {
    const { dispatch, navigation } = this.props;

    dispatch(pushRoute({
      key: 'words',
      title: 'Words',
      book
    }, navigation.key));
  };

  _onPressBooks = () => {
    const { dispatch, navigation } = this.props;

    dispatch(pushRoute({
      key: 'books',
      title: Localizable.t('books')
    }, navigation.key));
  };

  _onPressScripture = ({book, chapterNumber, showsBackButton}) => {
    const { dispatch, navigation } = this.props;

    dispatch(pushRoute({
      key: 'reader',
      title: book.name,
      book,
      chapterNumber,
      showsBackButton
    }, navigation.key));
  };
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: NavigationHeader.HEIGHT
  },
  sectionHeaderContainer: {
    ...StyleSheet.styles.sectionHeaderContainer,
    borderBottomWidth: 0,
    marginLeft: 8,
  },
  sectionContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  itemContainerBlank: {
    borderRadius: 4,
    backgroundColor: '#F9F9F9',
    margin: 0,
    marginHorizontal: 4,
    flex: 1,
    height: 127,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 8,
  },
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch
	};
}

function mapStateToProps(state) {
	return {
		navigation: state.get('discover')
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Discover);
