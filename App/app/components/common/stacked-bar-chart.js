/* @flow */
'use strict';

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart, Bar } from './bar-chart';

export default class StackedBarChart extends Component {
  props: {
    style: any;
    data: any;
  };

  render() {
    return (
      <BarChart style={[styles.container, this.props.style]} data={this.props.data}>
        <Bar dataKey={'foo'} />
      </BarChart>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
