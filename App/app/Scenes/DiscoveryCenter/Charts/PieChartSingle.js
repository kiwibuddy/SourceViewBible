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

import PieColors, { DeltaColor } from './PieChartColors';
import PieChartList from './PieChartList';
import { PieChart } from '../../../Components/Charts';

type Props = {
  card: Object,
  data: Object,
};

const PieChartSingle = (props: Props) => {
  const { card, data } = props;

  const slices = data.slice(0, Math.min(data.length, 10)).map((slice, index) => ({...slice, color: PieColors[index]}));

  const totalValue = data.reduce((sum, slice) => sum + slice.value, 0);
  const totalSlices = slices.reduce((sum, slice) => sum + slice.value, 0);
  const deltaValue = totalValue - totalSlices;
  if (deltaValue > 0) {
    // slices.push({color: DeltaColor, value: deltaValue})
  }

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <PieChart
          color={'red'}
          slices={slices}
          sliceWidth={12}
          size={150}
          style={styles.pie}
        />
        <PieChartList
          {...props}
          style={styles.list}
        />
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
    flex: .5,
    alignSelf: 'center',
    marginLeft: 30,
  },
  list: {
    flex: 3.5,
    height: 210,
    marginRight: 10,
  },
});

export default PieChartSingle;
