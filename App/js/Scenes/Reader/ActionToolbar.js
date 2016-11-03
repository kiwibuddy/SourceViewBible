/* @flow */
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';

import {
  Localizable,
  StyleSheet
} from '../../Common';

import { BACK, readerURL } from '../../Navigation';
import { Toolbar, ToolbarButton } from '../../Components/Navigation';

export default class ActionToolbar extends Component {
  render() {
    return (
      <Toolbar>
        <ToolbarButton
          title={Localizable.t('highlight')}
          onPress={() => {}}
        />
        <ToolbarButton
          title={Localizable.t('bookmark')}
          onPress={() => {}}
        />
        <ToolbarButton
          title={Localizable.t('share')}
          onPress={() => {}}
        />
        <ToolbarButton
          title={Localizable.t('cancel')}
          onPress={() => {}}
        />
      </Toolbar>
    );
  }
}
