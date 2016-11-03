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

type Props = {
  onBookmark: Function,
  onCancel: Function,
  onHighlight: Function,
  onShare: Function,
  references: any,
};

const ActionToolbar = (props: Props) => {
  const { onBookmark, onCancel, onHighlight, onShare } = props;
  return (
    <Toolbar>
      <ToolbarButton
        title={Localizable.t('highlight')}
        onPress={onHighlight}
      />
      <ToolbarButton
        title={Localizable.t('bookmark')}
        onPress={onBookmark}
      />
      <ToolbarButton
        title={Localizable.t('share')}
        onPress={onShare}
      />
      <ToolbarButton
        title={Localizable.t('cancel')}
        onPress={onCancel}
      />
    </Toolbar>
  );
};

export default ActionToolbar;
