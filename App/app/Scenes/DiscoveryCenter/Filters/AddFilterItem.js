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
            <TouchableOpacity onPress={() => this.setState({showFilterOptions: true})}>
              <Text style={[styles.button, addFilterButtonStyle]}>+ ADD FILTER</Text>
            </TouchableOpacity>
          </View>
          {this._renderFilterTypes()}
        </View>
      </View>
    );
  }

  _renderFilterTypes = () => {
    const { showFilterOptions } = this.state;
    const { onPressFilterType } = this.props;

    if (!showFilterOptions) return null;
    return (
      <View style={[StyleSheet.styles.discoveryCenter.rightContainer, {justifyContent: 'flex-end', paddingRight: -10}]}>
        <TouchableOpacity onPress={() => this._onPressFilterType(FilterType.BOOK)} >
          <Text style={styles.button}>BOOKS</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._onPressFilterType(FilterType.WORD)} >
          <Text style={styles.button}>WORDS</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._onPressFilterType(FilterType.SOURCE)} >
          <Text style={styles.button}>SOURCES</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._onPressFilterType(FilterType.SPHERE)} >
          <Text style={styles.button}>SPHERES</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    height: 44,
    overflow: 'hidden',
  },
  button: {
    color: Colors.tint,
    fontSize: 11,
    fontWeight: 'bold',
    paddingRight: 15,
  },
});
