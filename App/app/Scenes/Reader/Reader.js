/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import ScriptureView from './ScriptureView';

import { Book } from '../../Database';
import * as Navigation from '../../Components/Navigation';

import { readerSearchURL } from '../../Navigation';

type Props = {
  bookID: string,
  anchor?: string,
  navigate: Function,
};

const NavigationBar = (props: Props) => {
  const book = Book.findByID(props.bookID);
  return (
    <Navigation.NavigationBar title={book.name}>
      <Navigation.NavigationBarButton
        imageSource={require('../../Components/Navigation/Images/nav-search.png')}
        onPress={() => {props.navigate(readerSearchURL({modal: true}))}}
        style={{position: 'absolute', left: 0}}
      />
    </Navigation.NavigationBar>
  );
};

export default class Reader extends Component {
  static NavigationBar = NavigationBar;

  props: Props;

  render() {
    const book = Book.findByID(this.props.bookID);
    const { anchor, navigate } = this.props;

    return (
      <ScriptureView
        anchor={anchor}
        book={book}
        navigate={navigate}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
