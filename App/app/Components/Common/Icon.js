/* @flow */
'use strict';

import React, { Component } from 'react';
import { Text } from 'react-native';
import Icons from '../../Common/Icons';

const Icon = (props: Object) => {
  const { name, size, color, style } = props;

  const styleDefaults = {
    fontFamily: 'sourceview',
    fontSize: size,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color,
  };

  const glyph = Icons.avatar.humanGroup;
  return (<Text {...props}>{glyph}{props.children}</Text>);
};

export default Icon;
