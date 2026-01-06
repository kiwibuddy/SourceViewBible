/* @flow */
'use strict';

import React, { Component } from 'react';

import { Localizable } from '../../Common';

import Modal from '../../Components/Common/Modal';
import { BACK, sourcesFilterItemsURL } from '../../Navigation';
import { Preference } from '../../Preferences';

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

    const card = {
      type: 'sources',
      filters: Preference.objectForKey(Preference.Keys.Sources.filters) || [],
    };

    this.state = { card };
  }

  render() {
    return (
      <Modal
        card={this.state.card}
        initialRoute={sourcesFilterItemsURL({ title: Localizable.t('filters') })}
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
    Preference.setObjectForKey(card.filters, Preference.Keys.Sources.filters);
    this.props.navigate(BACK);
  };
}

export default Filters;
