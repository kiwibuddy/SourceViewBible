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
import DiscoverSources from './DiscoverSources';
import DiscoverSpheres from './DiscoverSpheres';

import * as Navigation from '../../Components/Navigation';
import { discoverHelpURL } from '../../Navigation';

const NavigationBar = (props: Props) => {
  return (
    <Navigation.NavigationBar title={props.title}>
      <Navigation.NavigationBarButton
        imageSource={require('../../Components/Navigation/Images/nav-help.png')}
        onPress={() => props.navigate(discoverHelpURL({title: Localizable.t('help'), modal: true}))}
        style={{position: 'absolute', right: 5}}
      />
    </Navigation.NavigationBar>
  );
};

type Props = {

};

export default class Discovery extends Component {
  static NavigationBar = NavigationBar;

  render() {
    return (
      <ScrollView style={styles.container}>
        <DiscoverBooks navigate={this.props.navigate} />

        <View style={styles.separator}></View>

        <DiscoverSources navigate={this.props.navigate} />

        <View style={styles.separator}></View>

        <DiscoverSpheres navigate={this.props.navigate} />

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
