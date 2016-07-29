/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Text,
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import ScriptureView from './ScriptureView';

import { Book } from '../../Database';

type Props = {
  bookID: string,
  chapterNumber: number,
  anchor?: string,
  navigate: Function,
};

export default class Reader extends Component {
  props: Props;

  render() {
    const book = Book.findByID(this.props.bookID);
    const { chapterNumber, anchor, navigate } = this.props;
    const chapter = book.chapters[chapterNumber - 1];

    return (
      <ScriptureView
        anchor={anchor}
        book={book}
        chapter={chapter}
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
