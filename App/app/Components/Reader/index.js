/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  View,
  TouchableOpacity,
  NavigationExperimental
} from 'react-native';

const {
  Header: NavigationHeader,
  CardStack: NavigationCardStack
} = NavigationExperimental;

import { connect } from 'react-redux';

const NavigationHeaderBackButton = require('../Common/NavigationHeaderBackButton');

import ScriptureView from './ScriptureView';
import Discover from '../Discover';

import {
  Colors,
  StyleSheet
} from '../../Common';

export default class Reader extends Component {
  render() {
    const book = this.props.book;
    const chapterNumber = this.props.chapterNumber || 1;
    const chapter = book.chapters[chapterNumber - 1];

    return (
      <ScriptureView book={book} chapter={chapter} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
