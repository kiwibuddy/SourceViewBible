/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { BarChart, Bar } from './BarChart';

import StyleSheet from '../../Common/StyleSheet';
import Colors from '../../Common/Colors';

const StackedBarChart = (props: Object) => {
  const style = [styles.container, {flexDirection: props.horizontal ? 'row' : 'column'}, props.style];

  return (
    <BarChart style={style}>
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
  );
}

StackedBarChart.propTypes = {
  style: PropTypes.any,
  data: PropTypes.any.isRequired,
  horizontal: PropTypes.bool
};

StackedBarChart.defaultProps = {
  horizontal: false
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default StackedBarChart;
