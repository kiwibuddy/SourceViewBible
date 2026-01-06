/* @flow */
'use strict';

import React from 'react';
import Icon from './Icon';
import { Colors } from '../../Common';

type Props = {
  size: number,
  source: Object,
  principalSourceType?: string,
  style: any,
};

const SourceIcon = (props: Props) => {
  const { principalSourceType, size, source, style } = props;
  const color = Colors.sources[principalSourceType || source.principalSourceType || 'support'].tint;

  return <Icon name={source.iconName} style={[{ color: color }, style]} size={size} />;
};

export default SourceIcon;
