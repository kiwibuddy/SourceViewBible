/* @flow */
'use strict';

import React, { Component } from 'react';
import Icon from './Icon';
import { Colors } from '../../Common';

type Props = {
  size: number,
  source: Object,
  style: any
};

const SourceIcon = (props: Props) => {
  const SOURCE_TYPE_MAP = {
    'The Narrator': 'narrator',
    'God': 'god',
    'Jesus': 'god'
  };
  const ICON_MAP = {
    'narrator': 'avatar-narrator',
    'god': 'avatar-divine',
  };

  const { size, source, style } = props;
  const sourceType = SOURCE_TYPE_MAP[source.name] || 'support';
  const color = Colors.sources[sourceType].tint;
  const defaultIconName = 'avatar-human-group';

  let iconName = ICON_MAP[sourceType];
  if (!iconName) {
    if (source.isHuman) {
      if (source.isIndividual) {
        iconName = source.isFemale ? 'avatar-human-female' : 'avatar-human-male';
      } else {
        iconName = 'avatar-human-group';
      }
    }
  }

  return (
    <Icon
      name={iconName || defaultIconName}
      style={[{color: color}, style]}
      size={size}
    />
  );
};

export default SourceIcon;
