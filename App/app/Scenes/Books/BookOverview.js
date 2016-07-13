/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ScrollView,
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
import Icon from '../../Components/Common/Icon';
import { ReadingTime } from '../../Common/NumberHelper';

const MAX_NUMBER_OF_SOURCES = 4;

type Props = {
  book: Object,
  onPressScripture: Function,
  onPressChapters: Function,
  onPressSource: Function,
  onPressSources: Function,
  onPressSpheres: Function,
  onPressWords: Function,
};

export default class BookOverview extends Component {
  render() {
    const { book } = this.props;

    const sources = book.sources.slice(0, MAX_NUMBER_OF_SOURCES).map((source) => {
      return this._renderSource(source);
    });

    if (book.sourceCount > MAX_NUMBER_OF_SOURCES) {
      sources.push(this._renderMoreSource());
    }

    const words = book.words;

    let overview = null;
    if (book.overview) {
      overview = book.overview.map((section) => this._renderOverviewSection(section));
    }

    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={this.props.onPressWords}>
          <WordCloud
            backgroundColors={Colors.spheres[book.principalSphere].gradient.big}
            style={StyleSheet.styles.wordCloud}
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
          </WordCloud>
        </TouchableOpacity>

        <View style={StyleSheet.styles.statisticsContainer}>
          <TouchableOpacity
            style={StyleSheet.styles.statisticContainer}
            onPress={this.props.onPressChapters}
          >
            <Text style={StyleSheet.styles.statisticTitle}>{book.chapterCount}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Chapters</Text>
          </TouchableOpacity>

          <View style={styles.keyline} />

          <TouchableOpacity
            style={StyleSheet.styles.statisticContainer}
            onPress={this.props.onPressSources}
          >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={StyleSheet.styles.statisticTitle}>{book.sourceCount}</Text>
              <SourcesBarChart
                style={{flex: 0, marginHorizontal: 4}}
                barStyle={{width: 3, height: 20, marginHorizontal: 1.5}}
                horizontal={false}
                data={[{narrator: book.sourceTypeCounts.narrator}, {god: book.sourceTypeCounts.god}, {lead: book.sourceTypeCounts.lead}, {support: book.sourceTypeCounts.support}]}
              />
            </View>
            <Text style={StyleSheet.styles.statisticSubtitle}>Sources</Text>
          </TouchableOpacity>

          <View style={styles.keyline} />

          <TouchableOpacity
            style={StyleSheet.styles.statisticContainer}
            onPress={this.props.onPressSpheres}
          >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={StyleSheet.styles.statisticTitle}>7</Text>
              <SpheresBarChart
                style={{flex: 0, marginHorizontal: 4}}
                barStyle={{width: 3, height: 20, marginHorizontal: 1.5}}
                horizontal={false}
                data={[{family: 1}, {economics: 1}, {government: 1}, {religion: 1}, {education: 1}, {communication: 1}, {celebration: 1}]}
              />
            </View>
            <Text style={StyleSheet.styles.statisticSubtitle}>Spheres</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sourcesContainer}>
          {sources}
        </View>

        <TouchableOpacity
          style={styles.readButton}
          onPress={() => this.props.onPressScripture({book})}
        >
          <Text style={styles.readButtonTitle}>{ReadingTime(book.wordCount)} read</Text>
        </TouchableOpacity>

        <View style={[{marginBottom: 5}, StyleSheet.styles.separator]} />
        <View style={styles.overviewContainer}>
          {overview}
        </View>
      </ScrollView>
    );
  }

  _renderSource = (source: Object) => {
    const SOURCE_TYPE_MAP = {
      "The Narrator": "narrator",
      "God": "god",
      "Jesus": "god"
    };
    const ICON_MAP = {
      "narrator": "avatar-narrator",
      "god": "avatar-divine",
    };

    const sourceType = SOURCE_TYPE_MAP[source.name] || "support";
    const color = Colors.sources[sourceType].tint;
    const iconName = ICON_MAP[sourceType] || "avatar-human-group";
    return (
      <TouchableOpacity
        key={'source-' + source.name}
        onPress={() => this.props.onPressSource(source)}
        style={styles.sourceButton}
      >
        <Icon
          name={iconName}
          size={40}
          style={[styles.sourceIcon, {color: color}]}
        />
        <Text style={StyleSheet.styles.statisticSubtitle}>{source.name}</Text>
      </TouchableOpacity>
    );
  };

  _renderMoreSource = () => {
    return (
      <TouchableOpacity
        key={'source-more'}
        style={styles.sourceButton}
        onPress={this.props.onPressSources}
      >
        <Icon
          name="avatar-more"
          size={40}
          style={[styles.sourceIcon, {color: Colors.tintColor}]}
        />
        <Text style={StyleSheet.styles.statisticSubtitle}>{Localizable.t("more")}</Text>
      </TouchableOpacity>
    );
  };

  _renderOverviewSection = (section: Object) => {
    return (
      <View key={section.title} style={styles.contentContainer}>
        <Text style={styles.contentHeader}>{section.title.toLocaleUpperCase()}</Text>
        <Text style={styles.contentBody}>{section.content}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  sourcesContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 1,
  },
  sourceButton: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  sourceIcon: {
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
    marginVertical: 20,
    marginHorizontal: 40,
  },
  overviewContainer: {
    paddingBottom: 30,
  },
  contentContainer: {
    marginHorizontal: 20,
  },
  contentHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#59626a',
    marginTop: 25,
  },
  contentBody: {
    fontSize: 16,
    lineHeight: 26,
    color: '#59626a',
  },
  keyline: {
    flex:0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator
  },
});
