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

type Props = {
  bible: Object,
  bookID: string,
  chapterNumber: number,
};

export default class Reader extends Component {
  props: Props;

  render() {
    const book = this.props.bible.books.find(book => book.key === this.props.bookID);
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
  },
});
