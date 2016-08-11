/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Localizable,
  StyleSheet,
} from '../../../Common';

import Chart from './Chart';
import PieChartColors from './PieChartColors';
import PieChartList from './PieChartList';
import { PieChart } from '../../../Components/Charts';

type Props = {
  card: Object,
  data: Object,
};

const PieChartSingle = (props: Props) => {
  const { card, data } = props;
  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <PieChart
          color={'red'}
          slices={[{color: 'blue', value: 30}, {color: 'green', value: 50}, {color: 'orange', value: 20}]}
          sliceWidth={10}
          size={150}
          style={styles.pie}
        />
        <PieChartList {...props} style={styles.list} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 44,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
  },
  pie: {

  },
  list: {

  }
});

export default PieChartSingle;
