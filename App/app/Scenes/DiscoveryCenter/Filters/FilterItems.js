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
import BookRangeFilterItem from './BookRangeFilterItem';
import BookFilterItem from './BookFilterItem';
import SphereFilterItem from './SphereFilterItem';
import WordFilterItem from './WordFilterItem';
import AddFilterItem from './AddFilterItem';


const Blankslate = () => {
  return (
    <View style={styles.blankslate}>
      <Image source={require('../Images/filter-blankslate.png')} />
    </View>
  );
};

type Props = {
  filters: any,
  onPressDeleteFilter: Function,
  onPressFilterType: Function,
};

const FilterItems = (props: Props) => {
  const { filters } = props;
  const filterItems = filters.map(filter => {
    let Item = null;

    switch (filter.type) {
      case 'book-range':
        Item = BookRangeFilterItem;
        break;

      case 'book':
        Item = BookFilterItem;
        break;

      case 'sphere':
        Item = SphereFilterItem;
        break;

      case 'word':
        Item = WordFilterItem;
        break;

      default:
        Item = FilterItem;
        break;
    }

    return <Item
      key={filter.id}
      filter={filter}
      onPressDeleteFilter={() => props.onPressDeleteFilter(filter)}
    />
  });
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
