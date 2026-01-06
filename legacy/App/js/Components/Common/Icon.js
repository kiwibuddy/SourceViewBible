/* @flow */
'use strict';

import React from 'react';

import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../../Images/font/config.json';
const FontIcon = createIconSetFromFontello(fontelloConfig);

const Icon = (props: Object) => {
  return <FontIcon {...props} />;
};

export default Icon;
