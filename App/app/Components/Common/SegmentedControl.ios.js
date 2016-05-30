/* @flow */
"use strict";

import React, { Component } from 'react';
import { SegmentedControlIOS } from 'react-native';

export default class SegmentedControl extends Component {
  render() {
    return (
      <SegmentedControlIOS {...this.props} />
    );
  }
}
