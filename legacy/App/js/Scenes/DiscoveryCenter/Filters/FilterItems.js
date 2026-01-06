/* @flow */
'use strict';

import React from 'react';

import { View } from 'react-native';

import { StyleSheet } from '../../../Common';

import ActantFilterItem from './ActantFilterItem';
import BookRangeFilterItem from './BookRangeFilterItem';
import BookFilterItem from './BookFilterItem';
import ChronologyRangeFilterItem from './ChronologyRangeFilterItem';
import ChronologyFilterItem from './ChronologyFilterItem';
import GenderFilterItem from './GenderFilterItem';
import NatureFilterItem from './NatureFilterItem';
import ProfessionFilterItem from './ProfessionFilterItem';
import RoleFilterItem from './RoleFilterItem';
import SphereFilterItem from './SphereFilterItem';
import WordFilterItem from './WordFilterItem';
import AddFilterItem from './AddFilterItem';

const Blankslate = () => {
  return <View style={styles.blankslate} />;
};

type Props = {
  card: Object,
  filters: any,
  onPressDeleteFilter: Function,
  onPressEditFilter: Function,
  onPressFilterType: Function,
};

const FilterItems = (props: Props) => {
  const { filters } = props;
  const filterItems = filters.map(filter => {
    let Item = null;

    switch (filter.type) {
      case 'actant':
        Item = ActantFilterItem;
        break;

      case 'book-range':
        Item = BookRangeFilterItem;
        break;

      case 'book':
        Item = BookFilterItem;
        break;

      case 'chronology-range':
        Item = ChronologyRangeFilterItem;
        break;

      case 'chronology':
        Item = ChronologyFilterItem;
        break;

      case 'gender':
        Item = GenderFilterItem;
        break;

      case 'nature':
        Item = NatureFilterItem;
        break;

      case 'profession':
        Item = ProfessionFilterItem;
        break;

      case 'role':
        Item = RoleFilterItem;
        break;

      case 'sphere':
        Item = SphereFilterItem;
        break;

      case 'word':
        Item = WordFilterItem;
        break;
    }
    if (Item == null) return;

    return <Item key={filter.id} filter={filter} onPressDeleteFilter={() => props.onPressDeleteFilter(filter)} onPressEditFilter={props.onPressEditFilter} />;
  });
  const blankslate = filters.length > 0 ? null : <Blankslate />;

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
    paddingVertical: 82,
    alignSelf: 'center',
  },
});

export default FilterItems;
