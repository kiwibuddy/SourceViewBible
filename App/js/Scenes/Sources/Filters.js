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

class Filters extends Component {
  render() {
    return (
      <Modal
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
    this.props.navigate(BACK);
  };
};

export default Filters;
