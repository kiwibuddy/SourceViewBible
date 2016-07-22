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

const FilterType = {

};

type ButtonProps = {
  title: string,
  style?: any,
};
const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity>
      <Text {...props} style={[styles.button, props.style]}>{props.title}</Text>
    </TouchableOpacity>
  );
};

type AddFilterTypesProps = {
  onPressFilterType: Function,
};

const AddFilterTypes = (props: AddFilterTypesProps) => {
  return (
    <View style={[StyleSheet.styles.discoveryCenter.rightContainer, {justifyContent: 'flex-end', paddingRight: -10}]}>
      <Button title="BOOKS" onPress={props.onPressFilterType} />
      <Button title="WORDS" onPress={props.onPressFilterType} />
      <Button title="SOURCES" onPress={props.onPressFilterType} />
      <Button title="SPHERES" onPress={props.onPressFilterType} />
    </View>
  );
}

type AddFilterProps = {
  onPressAddFilter: Function,
  onPressFilterType: Function,
  showOptions: boolean,
};

const AddFilter = (props: AddFilterProps) => {
  const addFilterTypes = (props.showOptions ? <AddFilterTypes onPressFilterType={props.onPressFilterType} /> : null)
  const addFilterButtonStyle = (props.showOptions ? {color: '#9B9B9B'} : null);
  return (
    <View style={styles.filterItem}>
      <View style={StyleSheet.styles.discoveryCenter.topContainer}>
        <View style={StyleSheet.styles.discoveryCenter.leftContainer}>
          <Button title="+ ADD FILTER" style={addFilterButtonStyle} onPress={props.onPressAddFilter} />
        </View>
        {addFilterTypes}
      </View>
    </View>
  );
}

type Props = {
  onPressFilterType: Function,
};

type State = {
  showFilterOptions: boolean,
};

export default class CardFilter extends Component {
  static Type = FilterType;
  static Button = Button;

  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      showFilterOptions: false
    };
  }
  render() {
    return (
      <View>
        <AddFilter
          onPressAddFilter={() => {this.setState({showFilterOptions: true})}}
          onPressFilterType={this.props.onPressFilterType}
          showOptions={this.state.showFilterOptions}
        />
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
  button: {
    color: Colors.tint,
    fontSize: 11,
    fontWeight: 'bold',
    paddingRight: 15,
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
