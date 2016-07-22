/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  StyleSheet,
} from '../../../Common';

import FilterItem from './FilterItem';
import AddFilterItem from './AddFilterItem';


const Blankslate = () => {
  return (
    <View style={styles.blankslate}>
      <Image source={require('../Images/filter-blankslate.png')} />
    </View>
  );
};

type Props = {
  onPressFilterType: Function,
};

const FilterItems = (props: Props) => {
  const filters = [{id: 0}, {id: 1}];
  const filterItems = filters.map(filter => <FilterItem key={filter.id} filter={filter} />);
  const blankslate = (filters.length > 0 ? null : <Blankslate />);

  return (
    <View>
      {filterItems}
      <AddFilterItem onPressFilterType={props.onPressFilterType} />
      {blankslate}
    </View>
  );
};

const styles = StyleSheet.create({
  blankslate: {
    paddingVertical: 50,
    alignSelf: 'center',
  },
});

export default FilterItems;
