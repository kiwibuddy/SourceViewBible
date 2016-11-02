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
    const { book } = this.props;

    return (
      <Toolbar>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <ToolbarButton
            title={Localizable.t('highlight')}
            onPress={() => {}}
          />
          <ToolbarButton
            title={Localizable.t('bookmark')}
            onPress={() => {}}
          />
        </View>
        <ToolbarButton
          title={Localizable.t('cancel')}
          titleStyle={StyleSheet.styles.navigationBar.doneButtonTitle}
          onPress={() => {}}
          style={{paddingHorizontal: 0, marginHorizontal: 0, marginRight: -20}}
        />
      </Toolbar>
    );
  }
}
