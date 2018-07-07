/* @flow */
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import BarChart from './BarChart';

import StyleSheet from '../../Common/StyleSheet';
import Colors from '../../Common/Colors';

import Realm from 'realm';

const SOURCES = ['narrator', 'god', 'lead', 'support'];

const SourcesBarChart = (props: Object) => {
  const bars = props.data.map(barData => {
    let data = {};
    if (barData instanceof Realm.List) {
      barData.forEach(count => (data[count.string] = count.count));
    } else {
      data = barData;
    }

    const slices = SOURCES.map(source => {
      const value = data[source];
      if (value === undefined) return null;
      return {
        color: Colors.sources[source].tint,
        value
      };
    }).filter(bar => bar != null);

    return { slices };
  });

  return <BarChart {...props} bars={bars} />;
};

SourcesBarChart.propTypes = {
  style: PropTypes.any,
  barStyle: PropTypes.any,
  data: PropTypes.any.isRequired,
  horizontal: PropTypes.bool
};

SourcesBarChart.defaultProps = {
  horizontal: true
};

export default SourcesBarChart;
