/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { BarChart, Bar } from './bar-chart';

import StyleSheet from '../../common/stylesheet';
import Colors from '../../common/colors';

export default class StackedBarChart extends Component {
  static defaultProps = {
    horizontal: false
  };

  static propTypes = {
    style: PropTypes.any,
    data: PropTypes.any.isRequired,
    horizontal: PropTypes.bool
  };

  render() {
    const style = [styles.container, {flexDirection: this.props.horizontal ? 'row' : 'column'}, this.props.style];

    return (
      <BarChart style={style} data={this.props.data}>
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
    flex: 1
  }
});
