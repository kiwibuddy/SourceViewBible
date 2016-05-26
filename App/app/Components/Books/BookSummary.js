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

import { SourcesBarChart, SpheresBarChart, WordCloud } from '../Charts';

import ParallaxMotionView from '../Common/ParallaxMotionView';

import { ReadingTime } from '../../Common/NumberHelper';

class BookSummary extends Component {
  render() {
    const { book } = this.props;

    const sources = book.sourceCounts.slice(0, 5).map((source) => {
      return this._renderSource(source);
    });

    const words = book.words;

    return (
      <ScrollView style={styles.container}>
        <WordCloud
          backgroundColors={Colors.spheres[book.principalSphere].gradient.big}
          style={styles.wordCloud}
        >
          <ParallaxMotionView intensity={5} style={{opacity: 0.8}}>
            <Text style={[styles.wc1, {top: 50, alignSelf: 'center'}]}>{words[0].word}</Text>
          </ParallaxMotionView>
          <ParallaxMotionView intensity={10} style={{opacity: 0.8}}>
            <Text style={[styles.wc2, {top: 55, right: 15}]}>{words[1].word}</Text>
            <Text style={[styles.wc2, {top: 85, left: 15}]}>{words[2].word}</Text>
            <Text style={[styles.wc2, {top: -95, left: -10}]}>{words[3].word}</Text>
            <Text style={[styles.wc2, {top: -100, right: 40}]}>{words[4].word}</Text>
          </ParallaxMotionView>
          <ParallaxMotionView intensity={20} style={{opacity: 0.6}}>
            <Text style={[styles.wc3, {top: 10, right: 10}]}>{words[5].word}</Text>
            <Text style={[styles.wc3, {top: -25, left: 10}]}>{words[6].word}</Text>
            <Text style={[styles.wc3, {top: -50, right: -10}]}>{words[7].word}</Text>
            <Text style={[styles.wc3, {top: 45, left: 30}]}>{words[8].word}</Text>
          </ParallaxMotionView>
          <ParallaxMotionView intensity={30} style={{opacity: 0.3}}>
            <Text style={[styles.wc4, {top: -60, right: 150}]}>{words[9].word}</Text>
            <Text style={[styles.wc4, {top: 80, right: 170}]}>{words[10].word}</Text>
            <Text style={[styles.wc4, {top: -45, left: 80}]}>{words[11].word}</Text>
            <Text style={[styles.wc4, {top: 20, left: -10}]}>{words[12].word}</Text>
            <Text style={[styles.wc4, {top: -90, left: 130}]}>{words[13].word}</Text>
            <Text style={[styles.wc4, {top: -15, right: 60}]}>{words[14].word}</Text>
          </ParallaxMotionView>
        </WordCloud>

        <View style={styles.statisticsContainer}>
          <TouchableOpacity
            style={styles.statisticContainer}
            onPress={this.props.onPressChapters}
          >
            <Text style={styles.statisticTitle}>{book.chapterCount}</Text>
            <Text style={styles.buttonSubtitle}>Chapters</Text>
          </TouchableOpacity>

          <View style={styles.keyline} />

          <TouchableOpacity
            style={styles.statisticContainer}
            onPress={this.props.onPressSources}
          >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.statisticTitle}>{book.sourceCount}</Text>
              <SourcesBarChart
                style={{flex: 0, marginHorizontal: 4}}
                barStyle={{width: 3, height: 20, marginHorizontal: 1.5}}
                horizontal={false}
                data={[{narrator: book.sourceTypeCounts.narrator}, {god: book.sourceTypeCounts.god}, {lead: book.sourceTypeCounts.lead}, {support: book.sourceTypeCounts.support}]}
              />
            </View>
            <Text style={styles.buttonSubtitle}>Sources</Text>
          </TouchableOpacity>

          <View style={styles.keyline} />

          <TouchableOpacity
            style={styles.statisticContainer}
            onPress={this.props.onPressSpheres}
          >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.statisticTitle}>0</Text>
              <SpheresBarChart
                style={{flex: 0, marginHorizontal: 4}}
                barStyle={{width: 3, height: 20, marginHorizontal: 1.5}}
                horizontal={false}
                data={[{family: 1}, {economics: 1}, {government: 1}, {religion: 1}, {education: 1}, {communication: 1}, {celebration: 1}]}
              />
            </View>
            <Text style={styles.buttonSubtitle}>Spheres</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sourcesContainer}>
          {sources}
        </View>

        <TouchableOpacity style={styles.readButton}>
          <Text style={styles.readButtonTitle}>{ReadingTime(book.wordCount)} read</Text>
        </TouchableOpacity>

        <View style={[{marginBottom: 20}, StyleSheet.styles.separator]} />

        <View style={styles.contentContainer}>
          <Text style={styles.contentHeader}>{Localizable.t('how-to-read', {name: this.props.book.name}).toLocaleUpperCase()}</Text>
          <Text style={styles.contentBody}>Lorem magna laboris proident proident aliqua ea et nisi. Elit amet et non aute dolor eu anim nostrud do enim dolore. Non do esse dolore velit incididunt eiusmod voluptate sunt. Duis sunt labore proident culpa ullamco duis magna ullamco consectetur voluptate ipsum ut sint velit anim. Incididunt aute id fugiat esse irure excepteur eu eiusmod eiusmod nostrud consequat velit id.</Text>
        </View>
      </ScrollView>
    );
  }

  _renderSource = (source: Object) => {
    const SOURCE_TYPE_MAP = {
      "The Narrator": "narrator",
      "God": "god",
      "Jesus": "god"
    }
    const sourceType = SOURCE_TYPE_MAP[source.name] || "support";
    const tintColor = Colors.sources[sourceType];
    const IMAGE_MAP = {
      "narrator": require('../../Images/avatars/narrator-medium.png'),
      "god": require('../../Images/avatars/divine-medium.png'),
    }
    const image = IMAGE_MAP[sourceType] || require('../../Images/avatars/human-group-medium.png');
    return (
      <TouchableOpacity key={'source-' + source.name} style={styles.sourceButton}>
        <Image source={image} style={[styles.sourceImage, {tintColor: tintColor}]}/>
        <Text style={styles.buttonSubtitle}>{source.name}</Text>
      </TouchableOpacity>
    );
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: NavigationHeader.HEIGHT,
  },
  wordCloud: {
    height: 200
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
  statisticsContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    borderBottomColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statisticContainer: {
    flex: 1,
  },
  statisticTitle: {
    fontSize: 24,
    color: Colors.tintColor,
    alignSelf: 'center'
  },
  buttonSubtitle: {
    flex: 1,
    color: Colors.subtitle,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  sourcesContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 4,
  },
  sourceButton: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  sourceImage: {
    width: 40,
    height: 40,
    margin: 4,
  },
  readButton: {
    backgroundColor: Colors.tintColor,
    borderColor: Colors.tintColor,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    overflow:'hidden',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 40,
    justifyContent: 'center',
  },
  readButtonTitle: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 20,
    paddingHorizontal: 40
  },
  contentContainer: {
    marginHorizontal: 15
  },
  contentHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#59626a',
  },
  contentBody: {
    fontSize: 16,
    lineHeight: 22,
    color: '#59626a',
    marginVertical: 4,
  },
  keyline: {
    flex:0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator
  },
  ...Platform.select({
      ios: {
      },
      android: {
      },
  })
});

export default BookSummary;
