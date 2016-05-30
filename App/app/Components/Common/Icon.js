/* @flow */
"use strict";

import React, { Component } from 'react';
import { Text } from 'react-native';

import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../../Images/font/config.json';
const FontIcon = createIconSetFromFontello(fontelloConfig);

const Icon = (props: Object) => {
  return (
    <FontIcon {...props} />
  );
};

export default Icon;
