/* @flow */

'use strict'

import SourceViewBibleApp from './SourceViewBibleApp';
import React, { Component } from 'react';

import { Provider } from 'react-redux';
import configureStore from './Store/configureStore';

export default class SourceViewBible extends Component {
  state: {
    isLoading: boolean,
    store: ?Object
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      store: null
    };
  }

  componentWillMount() {
    this.setState({
      store: configureStore(() => this.setState({isLoading: false}))
    });
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }

    return (
      <Provider store={this.state.store}>
        <SourceViewBibleApp />
      </Provider>
    );
  }
}
