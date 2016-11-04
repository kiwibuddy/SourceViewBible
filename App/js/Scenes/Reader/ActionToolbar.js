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

import { Bookmark } from '../../Preferences';

type Props = {
  onBookmark: Function,
  onCancel: Function,
  onHighlight: Function,
  onShare: Function,
  references: any,
};

const ActionToolbar = (props: Props) => {
  const { onBookmark, onCancel, onHighlight, onShare, references } = props;

  const bookmarks = Bookmark.whereReferences(references);
  const highlightTitle = bookmarks.find(bookmark => bookmark.type === Bookmark.Type.Highlight) ? Localizable.t('unhighlight') : Localizable.t('highlight');
  const bookmarkTitle = bookmarks.find(bookmark => bookmark.type === Bookmark.Type.Bookmark) ? Localizable.t('unbookmark') : Localizable.t('bookmark');

  return (
    <Toolbar>
      <ToolbarButton
        title={highlightTitle}
        onPress={onHighlight}
        style={{marginHorizontal:0}}
      />
      <ToolbarButton
        title={bookmarkTitle}
        onPress={onBookmark}
        style={{marginHorizontal:0}}
      />
      <ToolbarButton
        title={Localizable.t('share')}
        onPress={onShare}
        style={{marginHorizontal:0}}
      />
      <ToolbarButton
        title={Localizable.t('cancel')}
        onPress={onCancel}
        style={{marginHorizontal:0}}
      />
    </Toolbar>
  );
};

export default ActionToolbar;
