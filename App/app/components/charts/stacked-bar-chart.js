/* @flow */
'use strict';

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart, Bar } from './bar-chart';
const Colors = require('../common/colors');

export default class StackedBarChart extends Component {
  props: {
    style: any;
    data: any;
  };

  render() {
    return (
      <BarChart style={[styles.container, this.props.style]} data={this.props.data}>
        <Bar
          style={{backgroundColor: Colors.sources.black}}
          dataKey={'black'}
        />
        <Bar
          style={{backgroundColor: Colors.sources.red}}
          dataKey={'red'}
        />
        <Bar
          style={{backgroundColor: Colors.sources.green}}
          dataKey={'green'}
        />
        <Bar
          style={{backgroundColor: Colors.sources.blue}}
          dataKey={'blue'}
        />
      </BarChart>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  }
});
