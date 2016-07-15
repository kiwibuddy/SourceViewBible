/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import { SourcesBarChart, SpheresBarChart, WordCloud } from '../../Components/Charts';
import ParallaxMotionView from '../../Components/Common/ParallaxMotionView';
import Icon from '../../Components/Common/Icon';

type Props = {
  source: Object,
  onPressBooks: Function,
  onPressConversations: Function,
  onPressSource: Function,
  onPressSpheres: Function,
  onPressWords: Function,
};

export default class SourceOverview extends Component {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { source } = this.props;
    const words = source.words.map(word => word.word);
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={this.props.onPressWords}>
          <WordCloud
            backgroundColors={Colors.spheres['family'].gradient.big}
            style={styles.wordCloud}
          >
            <ParallaxMotionView intensity={5} style={[styles.parallax, {opacity: 0.8}]}>
              <Text style={[styles.wc1, {top: 50, alignSelf: 'center'}]}>{words[0]}</Text>
            </ParallaxMotionView>
            <ParallaxMotionView intensity={10} style={[styles.parallax, {opacity: 0.8}]}>
              <Text style={[styles.wc2, {top: 125, right: 15}]}>{words[1]}</Text>
              <Text style={[styles.wc2, {top: 150, left: 15}]}>{words[2]}</Text>
              <Text style={[styles.wc2, {top: -15, left: -10}]}>{words[3]}</Text>
              <Text style={[styles.wc2, {top: -20, right: 40}]}>{words[4]}</Text>
            </ParallaxMotionView>
            <ParallaxMotionView intensity={20} style={[styles.parallax, {opacity: 0.6}]}>
              <Text style={[styles.wc3, {top: 90, right: 10}]}>{words[5]}</Text>
              <Text style={[styles.wc3, {top: 55, left: 10}]}>{words[6]}</Text>
              <Text style={[styles.wc3, {top: 30, right: -10}]}>{words[7]}</Text>
              <Text style={[styles.wc3, {top: 125, left: 30}]}>{words[8]}</Text>
            </ParallaxMotionView>
            <ParallaxMotionView intensity={30} style={[styles.parallax, {opacity: 0.3}]}>
              <Text style={[styles.wc4, {top: 20, right: 150}]}>{words[9]}</Text>
              <Text style={[styles.wc4, {top: 150, right: 170}]}>{words[10]}</Text>
              <Text style={[styles.wc4, {top: 35, left: 80}]}>{words[11]}</Text>
              <Text style={[styles.wc4, {top: 100, left: -10}]}>{words[12]}</Text>
              <Text style={[styles.wc4, {top: -10, left: 130}]}>{words[13]}</Text>
              <Text style={[styles.wc4, {top: 65, right: 60}]}>{words[14]}</Text>
            </ParallaxMotionView>

            <View style={styles.sourceBackgroundContainer}>
              <Image style={styles.sourceBackground} source={require('../../Images/sources/avatar-background.png')} />
            </View>
            <View style={styles.sourceIconContainer}>
              <Icon
                name={'avatar-human-group'}
                size={100}
                style={[styles.sourceIcon, {color: 'black'}]}
              />
            </View>
          </WordCloud>
        </TouchableOpacity>
        <View style={[StyleSheet.styles.statisticsContainer, {marginTop: 25}]}>
          <TouchableOpacity style={StyleSheet.styles.statisticContainer} onPress={this.props.onPressBooks}>
            <Text style={StyleSheet.styles.statisticTitle}>0</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Books</Text>
          </TouchableOpacity>
          <View style={StyleSheet.styles.statisticKeyline} />
          <TouchableOpacity style={StyleSheet.styles.statisticContainer} onPress={this.props.onPressConversations}>
            <Text style={StyleSheet.styles.statisticTitle}>0</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Conversations</Text>
          </TouchableOpacity>
          <View style={StyleSheet.styles.statisticKeyline} />
          <TouchableOpacity style={StyleSheet.styles.statisticContainer} onPress={this.props.onPressWords}>
            <Text style={StyleSheet.styles.statisticTitle}>{Localizable.toNumber(source.wordCount, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Words</Text>
          </TouchableOpacity>
          <View style={StyleSheet.styles.statisticKeyline} />
          <TouchableOpacity style={StyleSheet.styles.statisticContainer} onPress={this.props.onPressSpheres}>
            <Text style={StyleSheet.styles.statisticTitle}>0</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Spheres</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          <View style={styles.listItemContainer}>
            <Icon
              name={'avatar-human-group'}
              size={20}
              style={[styles.listItemIcon, {color: '#59626A'}]}
            />
            <View style={styles.listItem}>
              <Text style={StyleSheet.styles.cell.titlemedium}>Meta Data Title</Text>
              <Text style={StyleSheet.styles.cell.valuetitlemedium}>Value</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
        <View style={styles.listContainer}>
          <View style={styles.listItemHeader}>
            <Text style={StyleSheet.styles.cell.titlebold}>Source spoke to</Text>
            <View style={styles.sourcesCellContainer}>
              <View style={styles.sourcesLeftContainer}>
                <Text style={StyleSheet.styles.cell.subtitle}>0 sources</Text>
              </View>
              <View style={styles.sourcesRightContainer}>
                <Text style={StyleSheet.styles.cell.subtitle}>0 occurrences</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.section} onPress={() => this.props.onPressSource()}>
            <View style={[styles.sourcesCellContainer, {paddingVertical: 12}]}>
              <View style={styles.sourcesLeftContainer}>
                <Icon
                  name={'avatar-human-group'}
                  style={[styles.sourceAvatar, {color: 'red'}]}
                  size={20}
                />
                <Text style={StyleSheet.styles.cell.titlemedium}>Source Name</Text>
              </View>
              <View style={styles.sourcesRightContainer}>
                <View style={styles.sourcesBarChart} />
                <Text style={StyleSheet.styles.cell.subtitle}>0 words</Text>
              </View>
            </View>
            <View style={[StyleSheet.styles.separator, {marginLeft: 0}]}></View>
          </TouchableOpacity>
          <View style={styles.listItemHeader}>
            <Text style={StyleSheet.styles.cell.titlebold}>Spoke to</Text>
            <View style={styles.sourcesCellContainer}>
              <View style={styles.sourcesLeftContainer}>
                <Text style={StyleSheet.styles.cell.subtitle}>0 sources</Text>
              </View>
              <View style={styles.sourcesRightContainer}>
                <Text style={StyleSheet.styles.cell.subtitle}>0 occurrences</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.section} onPress={() => this.props.onPressSource()}>
            <View style={[styles.sourcesCellContainer, {paddingVertical: 12}]}>
              <View style={styles.sourcesLeftContainer}>
                <Icon
                  name={'avatar-human-group'}
                  style={[styles.sourceAvatar, {color: 'red'}]}
                  size={20}
                />
                <Text style={StyleSheet.styles.cell.titlemedium}>Source Name</Text>
              </View>
              <View style={styles.sourcesRightContainer}>
                <View style={styles.sourcesBarChart} />
                <Text style={StyleSheet.styles.cell.subtitle}>0 words</Text>
              </View>
            </View>
            <View style={[StyleSheet.styles.separator, {marginLeft: 0}]}></View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sourceBackgroundContainer: {
    alignSelf: 'center',
    marginTop: 100,
  },
  sourceIconContainer: {
    alignSelf: 'center',
    marginTop: -114,
    backgroundColor: 'transparent',
  },
  listItemContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 5,
    flexDirection: 'row',
  },
  listItemHeader: {
    borderTopWidth: 2,
    borderTopColor: 'red',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  listItemIcon: {
    alignSelf: 'center',
    paddingRight: 10,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
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
    flex: 1,
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
  wordCloud: {
    height: 200
  },
  parallax: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  wc1: {
    color: 'white',
    backgroundColor:'transparent',
    fontSize: 66,
    fontWeight: '200',
  },
  wc2: {
    color: 'white',
    backgroundColor:'transparent',
    fontSize: 42,
    fontWeight: '200',
    position: 'absolute',
  },
  wc3: {
    color: 'white',
    backgroundColor:'transparent',
    fontSize: 30,
    fontWeight: '200',
    position: 'absolute',
  },
  wc4: {
    color: 'white',
    backgroundColor:'transparent',
    fontSize: 18,
    fontWeight: '200',
    position: 'absolute',
  },
});
