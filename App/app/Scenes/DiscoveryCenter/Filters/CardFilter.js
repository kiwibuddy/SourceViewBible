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

const FilterType = {

};

type Props = {
  onPressAddFilter: Function,
};

const CardFilter = (props: Props) => {
  return (
    <View {...props}>
      <View style={styles.filterItem}>
        <View style={StyleSheet.styles.discoveryCenter.leftContainer}>
          <Chart.Button title="+ ADD FILTER" style={{color: Colors.tint}} onPress={props.onPressAddFilter} />
        </View>
      </View>
      <View style={styles.blankslate}>
        <Image source={require('../Images/filter-blankslate.png')} />
      </View>
    </View>
  );
};
CardFilter.Type = FilterType;

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
});

export default CardFilter;
