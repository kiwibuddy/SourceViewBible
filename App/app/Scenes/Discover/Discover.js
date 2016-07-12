/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ScrollView,
  Text,
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import DiscoverBooks from './DiscoverBooks';

type Props = {
  onPressBook: Function,
  onPressBooks: Function,
  onPressScripture: Function,
};

export default class Discovery extends Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <DiscoverBooks onPressBooks={this.props.onPressBooks} onPressBook={this.props.onPressBook} onPressScripture={this.props.onPressScripture} />

        <View style={styles.separator}></View>

        {this._renderBlankSection("Sources")}

        <View style={styles.separator}></View>

        {this._renderBlankSection("Spheres")}

        <View style={styles.separator}></View>

        {this._renderBlankSection("Words")}

      </ScrollView>
    );
  }

  _renderBlankSection = (title: string) => {
    return (
      <View>
        <View style={styles.sectionHeaderContainer}>
          <Text style={StyleSheet.styles.sectionHeaderTitle}>{title.toLocaleUpperCase()}</Text>
        </View>

        <View style={[styles.sectionContainer, {paddingBottom: 15, marginHorizontal: 4}]}>
          <View style={styles.itemContainerBlank}></View>
          <View style={styles.itemContainerBlank}></View>
          <View style={styles.itemContainerBlank}></View>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeaderContainer: {
    ...StyleSheet.styles.sectionHeaderContainer,
    borderBottomWidth: 0,
    marginLeft: 8,
  },
  sectionContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  itemContainerBlank: {
    borderRadius: 4,
    backgroundColor: '#F9F9F9',
    margin: 0,
    marginHorizontal: 4,
    flex: 1,
    height: 127,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 8,
  },
});
