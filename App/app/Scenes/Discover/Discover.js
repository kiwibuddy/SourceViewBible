/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ScrollView,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import AppInfo from 'react-native-app-info';

import DiscoverBooks from './DiscoverBooks';
import DiscoverSources from './DiscoverSources';
import DiscoverSpheres from './DiscoverSpheres';

import * as Navigation from '../../Components/Navigation';
import { aboutURL, discoverHelpURL } from '../../Navigation';
import { Preference } from '../../Preferences';

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
    const shouldRefresh = this._shouldRefresh();

    return (
      <ScrollView style={styles.container}>
        <DiscoverBooks navigate={this.props.navigate} shouldRefresh={shouldRefresh} />

        <View style={styles.separator}></View>

        <DiscoverSources navigate={this.props.navigate} shouldRefresh={shouldRefresh} />

        <View style={styles.separator}></View>

        <DiscoverSpheres navigate={this.props.navigate} shouldRefresh={shouldRefresh} />

        <View style={styles.separator}></View>

        <TouchableOpacity style={styles.aboutContainer} onPress={() => this.props.navigate(aboutURL({title: Localizable.t('about-sourceview'), modal: true}))}>
          <Text style={styles.copyright}>SourceView Publishing, LLC ©2016</Text>
          <Text style={styles.copyright}>Version {AppInfo.getInfoShortVersion()} ({AppInfo.getInfoVersion()})</Text>
          <Text style={styles.button}>Learn More</Text>
        </TouchableOpacity>

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

  _shouldRefresh = () => {
    let refreshDate = Preference.stringForKey(Preference.Keys.Discover.RefreshDate);

    const date = new Date();
    const month = date.getUTCMonth() + 1; //months from 1-12
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const currentDate = `${year}${month}${day}`;

    const shouldRefresh = (!refreshDate || currentDate !== refreshDate);
    if (shouldRefresh) {
      Preference.setStringForKey(currentDate, Preference.Keys.Discover.RefreshDate);
    }

    // return true;
    return shouldRefresh;
  }
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
  aboutContainer: {
    paddingVertical: 10,
    alignItems: 'center'
  },
  copyright: {
    fontSize: 13,
    color: '#9B9B9B',
  },
  button: {
    fontSize: 13,
    color: Colors.tint,
  }
});
