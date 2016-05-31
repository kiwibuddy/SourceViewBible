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
      <NavigationHeader.Title>{title}</NavigationHeader.Title>
    );
  };

  _renderLeftComponent = (props: Object) => {
    return (props.scene.index > 0 ? <NavigationHeaderBackButton /> : null);
  };

  _renderScene = (props: Object) => {
    if (props.scene.navigationState.key === 'discover') {
      return this._renderDiscover();
    }

    if (props.scene.navigationState.key === 'book') {
      const book = props.scene.navigationState.book;
      return <Book book={book} onPressScripture={() => this._onPressScripture(book)} />
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
  }

  _onPressBooks = () => {
    this.props.onNavigate({
      type: 'push',
      route: {
        key: 'books',
        title: Localizable.t('books'),
      }
    });
  };

  _onPressScripture = (book: Object, chapterNumber: number) => {
    console.log('c: ' + chapterNumber);

    this.props.onNavigate({
      type: 'push',
      route: {
        key: 'reader',
        title: book.name,
        book,
        chapterNumber
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
