/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
  View,
} from 'react-native';

import { Chart } from '../Charts';

import {
  Colors,
  StyleSheet,
} from '../../../Common';

const FilterBlankslate = (props: Object) => {
  return (
    <View {...props}>
      <View style={styles.filterItem}>
        <View style={styles.leftContainer}>
          <Chart.Button title="+ ADD FILTER" style={{color: Colors.tint}} />
        </View>
      </View>
      <View style={styles.blankslate}>
        <Image source={require('../../../Images/discoverycenter/filter-blankslate.png')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterItem: {
    flex: 0,
    flexDirection: 'row',
    height: 44,
  },
  blankslate: {
    paddingVertical: 50,
    alignSelf: 'center',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(255, 255, 255, 0.35)',
    paddingHorizontal: 10,
    height: 44,
  },
});

export default FilterBlankslate;
