/* @flow */
'use strict';

import React, { Component } from 'react';

import ReactNative, {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  NavigationExperimental,
  Image
} from 'react-native';

const { Header: NavigationHeader } = NavigationExperimental;

import { connect } from 'react-redux';

import {
  Colors,
  StyleSheet,
  Localizable,
  Platform
} from '../../../Common';

import BookOverview from './BookOverview';
import BookChapters from './BookChapters';
import BookSources from './BookSources';
import BookSpheres from './BookSpheres';
import BookWords from './BookWords';

export default class Book extends Component {
  state: {
    selectedTab: string
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      selectedTab: 'summary'
    };
  }

  render() {
    return (
      <BookOverview
        book={this.props.book}
        onPressChapters={() => this.props.onPressChapters(this.props.book)}
        onPressSources={() => this.props.onPressSources(this.props.book)}
        onPressSpheres={() => this.props.onPressSpheres(this.props.book)}
        onPressWords={() => this.props.onPressWords(this.props.book)}
        onPressScripture={() => this.props.onPressScripture(this.props.book)}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabTitleStyle: {
    color: '#929292',
  },
  selectedTabTitleStyle: {
    color: Colors.tintColor
  },
  tabIcon: {
    tintColor: '#929292'
  },
  selectedTabIcon: {
    tintColor: Colors.tintColor
  },
  ...Platform.select({
    ios: {

    },
    android: {
      tabBarStyle: {
        height: 56,
        backgroundColor: 'white',
      },
      tabBarShadowStyle: {

      }
    }
  })
});
