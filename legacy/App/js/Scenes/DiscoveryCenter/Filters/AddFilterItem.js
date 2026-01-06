/* @flow */
'use strict';

import React, { Component } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import { Colors, StyleSheet } from '../../../Common';

import { actantFiltersURL, bookFiltersURL, chronologyFiltersURL, spheresFilterURL, wordFilterURL } from '../../../Navigation';

const hitSlop = { top: 10, left: 5, bottom: 10, right: 0 };

type Props = {
  onPressFilterType: Function,
};

type State = {
  showFilterOptions: boolean,
};

export default class AddFilterItem extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      showFilterOptions: false,
    };
  }

  render() {
    const addFilterButtonStyle = this.state.showFilterOptions ? { color: '#9B9B9B' } : null;
    return (
      <View style={styles.filterItem}>
        <View style={StyleSheet.styles.discoveryCenter.topContainer}>
          <View style={StyleSheet.styles.discoveryCenter.leftContainer}>
            <TouchableOpacity hitSlop={hitSlop} onPress={() => this.setState({ showFilterOptions: !this.state.showFilterOptions })}>
              <Text style={[styles.button, addFilterButtonStyle]}>+ ADD FILTER</Text>
            </TouchableOpacity>
          </View>
        </View>
        {this._renderFilterTypes()}
      </View>
    );
  }

  _renderFilterTypes = () => {
    const { showFilterOptions } = this.state;

    if (!showFilterOptions) return null;
    return (
      <View style={styles.blockContainer}>
        <View style={styles.blockItem}>
          <TouchableOpacity hitSlop={hitSlop} onPress={() => this._onPressFilterType(bookFiltersURL({ title: 'Book Filters' }))}>
            <Text style={styles.button}>BOOKS</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={hitSlop} onPress={() => this._onPressFilterType(chronologyFiltersURL({ title: 'Time Period Filters' }))}>
            <Text style={styles.button}>TIME PERIOD</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={hitSlop} onPress={() => this._onPressFilterType(wordFilterURL({ title: 'Word Filter' }))}>
            <Text style={styles.button}>WORDS</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.blockItem}>
          <TouchableOpacity hitSlop={hitSlop} onPress={() => this._onPressFilterType(actantFiltersURL({ title: 'Source Filters', type: 'source' }))}>
            <Text style={styles.button}>SOURCES</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={hitSlop} onPress={() => this._onPressFilterType(actantFiltersURL({ title: 'Recipient Filters', type: 'recipient' }))}>
            <Text style={styles.button}>RECIPIENTS</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={hitSlop} onPress={() => this._onPressFilterType(spheresFilterURL({ title: 'Sphere Filter' }))}>
            <Text style={styles.button}>SPHERES</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _onPressFilterType = (filterType: string) => {
    this.props.onPressFilterType(filterType);
    this.setState({ showFilterOptions: false });
  };
}

const styles = StyleSheet.create({
  blockContainer: {
    flex: 0,
    flexDirection: 'column',
    marginLeft: 20,
    marginTop: -7,
  },
  blockItem: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterItem: {
    flex: 0,
    flexDirection: 'column',
  },
  button: {
    color: Colors.tint,
    fontSize: 11,
    fontWeight: 'bold',
    paddingRight: 15,
    paddingVertical: 8,
  },
});
