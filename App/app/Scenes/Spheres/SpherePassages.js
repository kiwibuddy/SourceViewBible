/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ListView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import { Sphere } from '../../Database';

type Props = {
  sphereID: string,
};

type State = {
  dataSource: any,
  sphere: Object,
};

export default class SpherePassages extends Component {
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
      <View style={styles.content}>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderTitle}>God and the Sphere of Family</Text>
        </View>
        <TouchableOpacity style={styles.listItemContainer}>
          <Text style={[StyleSheet.styles.cell.occurrence, {marginTop: -5}]}>1</Text>
          <View style={styles.listItem}>
            <Text style={styles.bodybold}>Lorem ipsum dolor sit amet, eleifend varius.</Text>
            <Text style={styles.body}>Lorem ipsum dolor sit amet, eleifend varius. Risus vitae mauris cras lectus ipsum ante, semper id, tincidunt nunc magnis vehicula magnis in, magna massa, lectus donec vestibulum interdum.</Text>
            <View style={styles.referenceContainer}>
              <Text style={[StyleSheet.styles.cell.subtitle, {paddingRight: 8,}]}>John 1:1</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeaderContainer: {
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c7cc',
  },
  sectionHeaderTitle: {
    color: '#59626a',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listItemContainer: {
    paddingLeft: 5,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 13,
    flexDirection: 'row',
  },
  listItem: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 5,
  },
  body: {
    fontFamily: 'Georgia',
    paddingBottom: 15,
    color: '#59626A',
    fontSize: 15,
    lineHeight: 24,
  },
  bodybold: {
    color: '#59626a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  referenceContainer: {
    flexDirection: 'row',
  },
  separator: {
    ...StyleSheet.styles.separator,
  },
});
