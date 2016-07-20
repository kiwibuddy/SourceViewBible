/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ListView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import Icon from '../../Components/Common/Icon';

import { Sphere } from '../../Database';

type Props = {
  bible: Object,
  sphereID: string,
};

type State = {
  dataSource: any,
  sphere: Object,
};

export default class SphereSources extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const sphere = Sphere.findByID(props.sphereID);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      dataSource: dataSource,
      sphere
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={StyleSheet.styles.statisticsContainer}>
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toNumber(0, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>All Sources</Text>
          </View>
          <View style={StyleSheet.styles.statisticKeyline} />
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toNumber(0, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>OT Sources</Text>
          </View>
          <View style={StyleSheet.styles.statisticKeyline} />
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toNumber(0, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>NT Sources</Text>
          </View>
          <View style={StyleSheet.styles.statisticKeyline} />
        </View>
        <View style={styles.sphereBooksGraph}>
        </View>
        <TouchableOpacity style={styles.section}>
          <View style={[styles.sourcesCellContainer, {paddingVertical: 12}]}>
          <View style={styles.sourcesLeftContainer}>
            <Icon
              name={'avatar-human-group'}
              style={[styles.sourceAvatar, {color: 'red', marginRight: 5}]}
              size={20}
            />
            <Text style={StyleSheet.styles.cell.titlemedium}>Source Name</Text>
          </View>
            <View style={styles.sourcesRightContainer}>
              <View style={[styles.sourcesBarChart, {height: 4, backgroundColor: '#EDEDED'}]} />
              <View style={styles.dataPair}>
                <Text style={[StyleSheet.styles.cell.percentage, {color: 'red'}]}>0%</Text>
                <Text style={StyleSheet.styles.cell.subtitle}>0 words</Text>
              </View>
            </View>
          </View>
          <View style={[StyleSheet.styles.separator]}></View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sphereBooksGraph: {
    height: 200,
    borderBottomColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 0.4,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  sectionHeaderContainer: {
    ...StyleSheet.styles.sectionHeaderContainer,
    marginLeft: 8,
    backgroundColor: 'transparent',
  },
  section: {
    marginLeft: 8,
  },
  sourcesCellContainer: {
    flex: 1,
    marginRight: 15,
    flexDirection: 'row',
  },
  sourcesLeftContainer: {
    flex: 1.5,
    flexDirection: 'row',
    paddingTop: 2,
  },
  sourcesRightContainer: {
    flex: 2,
  },
  sourceAvatar: {
    width: 20,
    height: 20,
    marginRight: 5
  },
  sourcesBarChart: {
    height: 4,
    flex: 0,
    marginBottom: 7,
  },
  dataPair: {
    flex: 1,
    flexDirection: 'row',
  },
});
