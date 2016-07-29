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
  anchor: string,
  navigate: Function,
};

export default class Reader extends Component {
  props: Props;

  render() {
    const book = Book.findByID(this.props.bookID);

    return (
      <ScriptureView
        book={book}
        anchor={this.props.anchor}
        navigate={this.props.navigate}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
