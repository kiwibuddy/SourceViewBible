/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
  TouchableOpacity,
} from 'react-native';

import {
  StyleSheet,
} from '../../Common';

export const DeleteButton = (props: Object) => {
  return (
    <TouchableOpacity {...props}>
      <Image source={require('./Images/btn-delete.png')} />
    </TouchableOpacity>
  );
};

export const DuplicateButton = (props: Object) => {
  return (
    <TouchableOpacity {...props}>
      <Image source={require('./Images/btn-duplicate.png')} />
    </TouchableOpacity>
  );
};

export const ShareButton = (props: Object) => {
  return (
    <TouchableOpacity {...props}>
      <Image source={require('./Images/btn-share.png')} />
    </TouchableOpacity>
  );
};
