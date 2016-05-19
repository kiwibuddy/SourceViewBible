/* @flow */
'use strict';

import React, { Component } from 'react';

import ReactNative, {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  NavigationExperimental,
  Image
} from 'react-native';

const { Header: NavigationHeader } = NavigationExperimental;

import {
  Colors,
  StyleSheet,
  Localizable,
  Platform
} from '../../Common';

import { SourcesBarChart, SpheresBarChart } from '../Charts';

class BookSummary extends Component {
  render() {
    return (
      <View style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.sectionText} numberOfLines={4}>
              Commodo id deserunt ea proident reprehenderit aliquip deserunt tempor sit aute excepteur esse veniam magna. Sit dolore laborum ex cillum ex fugiat sint. Minim labore exercitation exercitation exercitation sit eu labore Lorem. In aute amet do voluptate minim qui ex commodo magna amet dolore excepteur voluptate ullamco aliquip. Duis culpa pariatur ea laboris consectetur aliqua non sint aliquip. Anim ullamco sint ullamco est laborum occaecat ullamco sunt ipsum eu amet esse dolore laboris ea eiusmod amet. Do cillum elit consectetur dolore occaecat magna est nulla ex tempor laboris qui Lorem ad ex aliquip pariatur.
            </Text>
            <Text style={styles.sectionMore}>more</Text>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: NavigationHeader.HEIGHT,
  },
  section: {
    marginLeft: 15,
  },
  sectionMore: {
    color: Colors.tintColor,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  ...Platform.select({
      ios: {
      },
      android: {
      },
  })
});

export default BookSummary;
