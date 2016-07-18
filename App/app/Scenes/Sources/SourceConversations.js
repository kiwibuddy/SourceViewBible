/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import SourcesBarChart from '../../Components/Charts/SourcesBarChart';

import Icon from '../../Components/Common/Icon';

type Props = {
  bible: Object,
  sourceID: string,
};

type State = {
  source: Object
};

export default class SourceConversation extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const source = props.bible.sources.find(source => source.key === props.sourceID);
    this.state = {source};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={StyleSheet.styles.statisticsContainer}>
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toNumber(0, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Book</Text>
          </View>
          <View style={StyleSheet.styles.statisticKeyline} />
          <View style={StyleSheet.styles.statisticContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toNumber(0, {precision: 0})}</Text>
              <View style={styles.SpheresBarChart}></View>
            </View>
            <Text style={StyleSheet.styles.statisticSubtitle}>Spheres</Text>
          </View>
        </View>
        <View style={styles.conversationGraph}>
        </View>
        <TouchableOpacity style={styles.section}>
          <View style={[styles.sourcesCellContainer, {paddingVertical: 15}]}>
            <View style={styles.sourcesLeftContainer}>
              <TouchableOpacity onPress={() => {}}>
                <Icon
                  name={'avatar-human-group'}
                  style={[styles.sourceAvatar, {color: 'black'}]}
                  size={20}
                />
              </TouchableOpacity>
              <Text style={StyleSheet.styles.cell.title}>Source Name</Text>
            </View>
            <View style={styles.sourcesRightContainer}>
              <View styl={styles.sourcesBarChart} />
              <Text style={StyleSheet.styles.cell.subtitle}>0 conversations</Text>
            </View>
            <Image source={require('../../Images/common/disclosure.png')}  style={styles.disclosure} />
          </View>
          <View style={[StyleSheet.styles.separator, {marginLeft: -15}]}></View>
        </TouchableOpacity>
        <View style={styles.sourceOccurences}>
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
  conversationGraph: {
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
  section: {
    marginLeft: 15,
  },
  sourcesCellContainer: {
    flex: 1,
    marginRight: 15,
    flexDirection: 'row',
  },
  sourcesLeftContainer: {
    flex: 2,
    flexDirection: 'row',
    paddingTop: 2,
  },
  sourcesRightContainer: {
    flex: 1,
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
  listItemContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
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
  },
  body: {
    paddingBottom: 5,
  },
});
