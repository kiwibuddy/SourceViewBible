/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  Analytics,
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import Modal from '../../Components/Common/Modal';
import { BACK, sourcesFilterItemsURL } from '../../Navigation';

type Props = {
  navigate: Function,
};

type State = {
  card: Object,
};

class Filters extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      card: {filters: []}
    };
  }

  render() {
    return (
      <Modal
        card={this.state.card}
        initialRoute={sourcesFilterItemsURL({title: Localizable.t('filters')})}
        onPressCancel={this._onPressCancel}
        onDone={this._onDone}
      />
    );
  }

  _onPressCancel = () => {
    this.props.navigate(BACK);
  };

  _onDone = () => {
    const { card } = this.state;
    this.props.navigate(BACK);
  };
};

export default Filters;
