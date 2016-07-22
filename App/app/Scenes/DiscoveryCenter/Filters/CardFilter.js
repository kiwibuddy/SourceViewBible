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

import AddFilter from './AddFilter';

const FilterType = {

};

type Props = {
  onPressFilterType: Function,
};

export default class CardFilter extends Component {
  static Type = FilterType;

  props: Props;

  render() {
    return (
      <View>
        <AddFilter onPressFilterType={this.props.onPressFilterType} />
        <View style={styles.blankslate}>
          <Image source={require('../Images/filter-blankslate.png')} />
        </View>
      </View>
    );
  }
}

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
  filterButton: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.tint,
    paddingHorizontal: 2,
    marginHorizontal: 8,
  },
  filterButtonTitle: {
    color: Colors.tint,
  },
  filterDelete: {
    position: 'absolute',
    right: 5,
  },
});
