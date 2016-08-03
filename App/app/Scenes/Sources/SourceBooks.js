/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Text,
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import { Actant } from '../../Database';

type Props = {
  sourceID: number,
};

type State = {
  source: Object
};

export default class SourceBooks extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const source = Actant.findByID(props.sourceID);
    this.state = {source};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <View style={styles.listItemHeader}>
            <Text style={StyleSheet.styles.cell.titlebold}>Book of Name</Text>
            <Text style={StyleSheet.styles.cell.subtitle}>0 occurrences</Text>
          </View>
          <View style={styles.listItemContainer}>
            <Text style={StyleSheet.styles.cell.occurence}>1</Text>
            <View style={styles.listItem}>
              <Text style={styles.body}>Lorem ipsum dolor sit amet, eleifend varius. Risus vitae mauris cras lectus ipsum ante, semper id, tincidunt nunc magnis vehicula magnis in, magna massa, lectus donec vestibulum interdum.</Text>
              <Text style={StyleSheet.styles.cell.subtitle}>Genesis 1:1</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItemContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  listItemHeader: {
    borderTopWidth: 2,
    borderTopColor: 'green',
    paddingLeft: 15,
    paddingVertical: 8,
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
  listItem: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 8,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
  },
  body: {
    paddingBottom: 5,
  },
});
