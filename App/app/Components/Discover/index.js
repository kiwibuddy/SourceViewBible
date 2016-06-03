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
  PropTypes,
  Dimensions
} from 'react-native';

const {
  AnimatedView: NavigationAnimatedView,
  Header: NavigationHeader,
  CardStack: NavigationCardStack
} = NavigationExperimental;

const NavigationHeaderBackButton = require('../Common/NavigationHeaderBackButton');

import { connect } from 'react-redux';


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
        onNavigate={this.props.onNavigate}
        renderScene={this._renderScene}
        renderOverlay={this._renderHeader}
        style={styles.main}
      />
    );
  }

  _renderHeader = (props: Object) => {
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
    const title = props.scene.navigationState.title;
    return (
      <NavigationHeader.Title
        {...props}
        style={{alignSelf: 'center', left: null, right: null}}
      >{title}</NavigationHeader.Title>
    );
  };

  _renderLeftComponent = (props: Object) => {
    const { scene, scenes } = props;
    if (scene.index == 0) return null;
    const title = scene.navigationState.title;

    let backButtonTitle = null;

    const previousScene = scenes[scene.index - 1];
    const previousTitle = previousScene.navigationState.title;
    if (previousTitle && previousTitle !== title && scene.navigationState.showsBackButton !== false && previousTitle.length < 15) {
      backButtonTitle = <Text style={{marginLeft: -10, color: Colors.tintColor, fontSize: 17}}>{previousTitle}</Text>
    }

    return (
      <NavigationHeaderBackButton {...props}>
      {backButtonTitle}
      </NavigationHeaderBackButton>
    );
  };

  _renderScene = (props: Object) => {
    if (props.scene.navigationState.key === 'discover') {
      return this._renderDiscover();
    }

    if (props.scene.navigationState.key === 'book') {
      const book = props.scene.navigationState.book;
      return <Book
        book={book}
        onPressChapters={this._onPressChapters}
        onPressSources={this._onPressSources}
        onPressSpheres={this._onPressSpheres}
        onPressWords={this._onPressWords}
        onPressScripture={this._onPressScripture}
      />
    }

    if (props.scene.navigationState.key === 'chapters') {
      const book = props.scene.navigationState.book;
      return <BookChapters book={book} onPressScripture={this._onPressScripture} />
    }

    if (props.scene.navigationState.key === 'sources') {
      const book = props.scene.navigationState.book;
      return <BookSources book={book} onPressScripture={this._onPressScripture} />
    }

    if (props.scene.navigationState.key === 'spheres') {
      const book = props.scene.navigationState.book;
      return <BookSpheres book={book} />
    }

    if (props.scene.navigationState.key === 'words') {
      const book = props.scene.navigationState.book;
      return <BookWords book={book} />
    }

    if (props.scene.navigationState.key === 'books') {
      return <Books onPressBook={this._onPressBook}/>
    }

    if (props.scene.navigationState.key === 'reader') {
      const book = props.scene.navigationState.book;
      const chapterNumber = props.scene.navigationState.chapterNumber;
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
    this.props.onNavigate({
      type: 'push',
      route: {
        key: 'book',
        title: book.name,
        book
      }
    });
  };

  _onPressChapters = (book: Object) => {
    this.props.onNavigate({
      type: 'push',
      route: {
        key: 'chapters',
        title: 'Chapters',
        book
      }
    });
  };

  _onPressSources = (book: Object) => {
    this.props.onNavigate({
      type: 'push',
      route: {
        key: 'sources',
        title: 'Sources',
        book
      }
    });
  };

  _onPressSpheres = (book: Object) => {
    this.props.onNavigate({
      type: 'push',
      route: {
        key: 'spheres',
        title: 'Spheres',
        book
      }
    });
  };

  _onPressWords = (book: Object) => {
    this.props.onNavigate({
      type: 'push',
      route: {
        key: 'words',
        title: 'Words',
        book
      }
    });
  };

  _onPressBooks = () => {
    this.props.onNavigate({
      type: 'push',
      route: {
        key: 'books',
        title: Localizable.t('books'),
      }
    });
  };

  _onPressScripture = ({book, chapterNumber, showsBackButton}) => {
    this.props.onNavigate({
      type: 'push',
      route: {
        key: 'reader',
        title: book.name,
        book,
        chapterNumber,
        showsBackButton
      }
    });
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

export default connect(mapStateToProps, mapDispatchToProps, (stateProps, dispatchProps, ownProps) => {
	return Object.assign({}, ownProps, stateProps, dispatchProps, {
		onNavigate: (action) => {
			dispatchProps.dispatch(Object.assign(action, {
				scope: stateProps.navigation.key
			}));
		}
	});
})(Discover);
