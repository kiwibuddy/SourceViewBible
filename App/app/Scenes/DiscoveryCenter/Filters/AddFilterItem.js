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

import { FilterType } from '../Constants';

const hitSlop = {top: 10, left: 5, bottom: 10, right: 0};

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
      showFilterOptions: false
    };
  }

  render() {
    const addFilterButtonStyle = (this.state.showFilterOptions ? {color: '#9B9B9B'} : null);
    return (
      <View style={styles.filterItem}>
        <View style={StyleSheet.styles.discoveryCenter.topContainer}>
          <View style={StyleSheet.styles.discoveryCenter.leftContainer}>
            <TouchableOpacity hitSlop={hitSlop} onPress={() => this.setState({showFilterOptions: true})}>
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
    const { onPressFilterType } = this.props;

    if (!showFilterOptions) return null;
    return (
      <View style={StyleSheet.styles.discoveryCenter.blockContainer}>
        <View style={StyleSheet.styles.discoveryCenter.blockItem}>
          <TouchableOpacity hitSlop={hitSlop} onPress={() => this._onPressFilterType(FilterType.BOOK)} >
            <Text style={styles.button}>BOOKS</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={hitSlop} onPress={() => this._onPressFilterType(FilterType.BOOK)} >
            <Text style={styles.button}>TIME PERIOD</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={hitSlop} onPress={() => this._onPressFilterType(FilterType.WORD)} >
            <Text style={styles.button}>WORDS</Text>
          </TouchableOpacity>
        </View>
        <View style={StyleSheet.styles.discoveryCenter.blockItem}>
          <TouchableOpacity hitSlop={hitSlop} onPress={() => this._onPressFilterType(FilterType.SOURCE)} >
            <Text style={styles.button}>SOURCES</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={hitSlop} onPress={() => this._onPressFilterType(FilterType.SOURCE)} >
            <Text style={styles.button}>RECIPIENTS</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={hitSlop} onPress={() => this._onPressFilterType(FilterType.SPHERE)} >
            <Text style={styles.button}>SPHERES</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _onPressFilterType = (filterType: string) => {
    this.props.onPressFilterType(filterType);
    this.setState({showFilterOptions: false});
  };
}

const styles = StyleSheet.create({
  filterItem: {
    flex: 0,
    flexDirection: 'column',
  },
  button: {
    color: Colors.tint,
    fontSize: 11,
    fontWeight: 'bold',
    paddingRight: 15,
  },
});
