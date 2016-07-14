/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import { SourcesBarChart, SpheresBarChart, WordCloud } from '../../Components/Charts';
import ParallaxMotionView from '../../Components/Common/ParallaxMotionView';

type Props = {
  sphere: Object,
  onPressWords: Function,
};

export default class SphereWords extends Component {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { sphere } = this.props;
    const words = [
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
      {word: 'Lorem'},
    ];

    return (
      <View style={styles.container}>
        <WordCloud
          backgroundColors={Colors.spheres[sphere.key].gradient.big}
          style={styles.wordCloud}
        >
          <ParallaxMotionView intensity={5} style={[styles.parallax, {opacity: 0.8}]}>
            <Text style={[styles.wc1, {top: 50, alignSelf: 'center'}]}>{words[0].word}</Text>
          </ParallaxMotionView>
          <ParallaxMotionView intensity={10} style={[styles.parallax, {opacity: 0.8}]}>
            <Text style={[styles.wc2, {top: 125, right: 15}]}>{words[1].word}</Text>
            <Text style={[styles.wc2, {top: 150, left: 15}]}>{words[2].word}</Text>
            <Text style={[styles.wc2, {top: -15, left: -10}]}>{words[3].word}</Text>
            <Text style={[styles.wc2, {top: -20, right: 40}]}>{words[4].word}</Text>
          </ParallaxMotionView>
          <ParallaxMotionView intensity={20} style={[styles.parallax, {opacity: 0.6}]}>
            <Text style={[styles.wc3, {top: 90, right: 10}]}>{words[5].word}</Text>
            <Text style={[styles.wc3, {top: 55, left: 10}]}>{words[6].word}</Text>
            <Text style={[styles.wc3, {top: 30, right: -10}]}>{words[7].word}</Text>
            <Text style={[styles.wc3, {top: 125, left: 30}]}>{words[8].word}</Text>
          </ParallaxMotionView>
          <ParallaxMotionView intensity={30} style={[styles.parallax, {opacity: 0.3}]}>
            <Text style={[styles.wc4, {top: 20, right: 150}]}>{words[9].word}</Text>
            <Text style={[styles.wc4, {top: 150, right: 170}]}>{words[10].word}</Text>
            <Text style={[styles.wc4, {top: 35, left: 80}]}>{words[11].word}</Text>
            <Text style={[styles.wc4, {top: 100, left: -10}]}>{words[12].word}</Text>
            <Text style={[styles.wc4, {top: -10, left: 130}]}>{words[13].word}</Text>
            <Text style={[styles.wc4, {top: 65, right: 60}]}>{words[14].word}</Text>
          </ParallaxMotionView>

          <TouchableOpacity style={styles.wordCloudButton} onPressWords={this.props.onPressWords}>
            <Image source={require('../../Images/common/btn-expand.png')} />
          </TouchableOpacity>
        </WordCloud>
        <View style={styles.listContainer}>
          <View style={StyleSheet.styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Word</Text>
            <Text style={StyleSheet.styles.cell.valuetitle}>0</Text>
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
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
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
  wordCloudButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  }
});
