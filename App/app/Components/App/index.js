/* @flow */
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';

import Reader from '../Reader';
import Discover from '../Discover';

const App = () => {
  return (
    <View style={{flex: 1}}>
      <Discover />
    </View>
  );
}

export default App
