/* @flow */
'use strict';

import React, { Component } from 'react';
import { Text } from 'react-native';
import Icons from '../../Common/Icons';

const GLYPH_MAP = {
  "narrator": Icons.avatar.narrator,
  "god": Icons.avatar.divine,
  "divine": Icons.avatar.divine,
}

const Icon = (props: Object) => {
  const { name, size, style } = props;

  const styleDefaults = {
    fontFamily: 'sourceview',
    fontSize: size,
    fontWeight: 'normal',
    fontStyle: 'normal',
  };

  const glyph = GLYPH_MAP[name] || Icons.avatar.humanGroup;

  return (
      <Text style={[styleDefaults, props.style, {fontFamily:"sourceView"}]}>{glyph}{props.children}</Text>
  );
};

export default Icon;
