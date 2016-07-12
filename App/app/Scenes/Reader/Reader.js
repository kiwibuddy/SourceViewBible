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
  book: Object,
  chapterNumber: number,
};

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
  },
});
