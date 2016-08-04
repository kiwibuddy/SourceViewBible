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
  Constants,
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

const {
  SourceType,
  SphereType
} = Constants;

import { bookChaptersURL, bookSourcesURL, bookSpheresURL, bookWordsURL, readerURL, sourceURL } from '../../Navigation';

import { SourcesBarChart, SpheresBarChart, WordCloud } from '../../Components/Charts';
import ParallaxMotionView from '../../Components/Common/ParallaxMotionView';
import SourceIcon from '../../Components/Common/SourceIcon';
import Icon from '../../Components/Common/Icon';
import { ReadingTime } from '../../Common/NumberHelper';

const MAX_NUMBER_OF_SOURCES = 4;

import { Book } from '../../Database';

type Props = {
  bookID: string,
  navigate: Function,
};

type State = {
  book: Object
};

export default class BookOverview extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const book = Book.findByID(props.bookID);

    this.state = {book}
  }

  render() {
    const { book } = this.state;

    const sources = book.sourceRelations.slice(0).sort((a, b) => a.wordCount > b.wordCount ? -1 : 1).slice(0, MAX_NUMBER_OF_SOURCES).map((relation) => {
      return this._renderSource(relation.source);
    });

    if (book.sourceCount > MAX_NUMBER_OF_SOURCES) {
      sources.push(this._renderMoreSource());
    }

    const words = book.words.map(word => word.string);

    let overview = null;
    if (book.overview) {
      overview = book.overview.map((section) => this._renderOverviewSection(section));
    }

    const spherePercent = (book.sphereWordCount / book.wordCount) * 100;

    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => this.props.navigate(bookWordsURL({bookID: book.id, title: Localizable.t('book-words', {name: book.name})}))}>
          <WordCloud
            backgroundColors={Colors.sources[book.principalSourceType].gradient.big}
            style={StyleSheet.styles.wordCloud}
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
          </WordCloud>
        </TouchableOpacity>

        <View style={StyleSheet.styles.statisticsContainer}>
          <TouchableOpacity
            style={StyleSheet.styles.statisticContainer}
            onPress={() => this.props.navigate(bookChaptersURL({bookID: book.id, title: Localizable.t('book-chapters', {name: book.name})}))}
          >
            <Text style={StyleSheet.styles.statisticTitle}>{book.chapterCount}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Chapters</Text>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity
            style={StyleSheet.styles.statisticContainer}
            onPress={() => this.props.navigate(bookSourcesURL({bookID: book.id, title: Localizable.t('book-sources', {name: book.name})}))}
          >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={StyleSheet.styles.statisticTitle}>{book.sourceCount}</Text>
              <SourcesBarChart
                style={{flex: 0, marginHorizontal: 4}}
                barStyle={{width: 3, height: 20, marginHorizontal: 1.5}}
                horizontal={false}
                data={[{narrator: book.countOfSourceType(SourceType.NARRATOR)}, {god: book.countOfSourceType(SourceType.GOD)}, {lead: book.countOfSourceType(SourceType.LEAD)}, {support: book.countOfSourceType(SourceType.SUPPORT)}]}
              />
            </View>
            <Text style={StyleSheet.styles.statisticSubtitle}>Sources</Text>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity
            style={StyleSheet.styles.statisticContainer}
            onPress={() => this.props.navigate(bookSpheresURL({bookID: book.id, title: Localizable.t('book-spheres', {name: book.name})}))}
          >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={StyleSheet.styles.statisticTitle}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text>
              <SpheresBarChart
                style={{flex: 0, marginHorizontal: 4}}
                barStyle={{width: 3, height: 20, marginHorizontal: 1.5}}
                horizontal={false}
                data={[{family: book.countOfSphereType(SphereType.FAMILY)}, {economics: book.countOfSphereType(SphereType.ECONOMICS)}, {government: book.countOfSphereType(SphereType.GOVERNMENT)}, {religion: book.countOfSphereType(SphereType.RELIGION)}, {education: book.countOfSphereType(SphereType.EDUCATION)}, {communication: book.countOfSphereType(SphereType.COMMUNICATION)}, {celebration: book.countOfSphereType(SphereType.CELEBRATION)}]}
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
          onPress={() => this.props.navigate(readerURL({bookID: book.id, anchor: 'chapter-1', title: book.name}))}
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
    return (
      <TouchableOpacity
        key={'source-' + source.name}
        onPress={() => this.props.navigate(sourceURL({sourceID: source.id, title: source.name}))}
        style={styles.sourceButton}
      >
        <SourceIcon
          source={source}
          size={40}
          style={styles.sourceIcon}
        />
        <Text style={StyleSheet.styles.statisticSubtitle}>{source.name}</Text>
      </TouchableOpacity>
    );
  };

  _renderMoreSource = () => {
    const { book } = this.state;
    return (
      <TouchableOpacity
        key={'source-more'}
        style={styles.sourceButton}
        onPress={() => this.props.navigate(bookSourcesURL({bookID: book.id, title: Localizable.t('book-sources', {name: book.name})}))}
      >
        <Icon
          name="avatar-more"
          size={40}
          style={[styles.sourceIcon, {color: Colors.tint}]}
        />
        <Text style={StyleSheet.styles.statisticSubtitle}>{Localizable.t("more")}</Text>
      </TouchableOpacity>
    );
  };

  _renderOverviewSection = (section: Object) => {
    return (
      <View key={section.title} style={styles.contentContainer}>
        <Text style={styles.contentHeader}>{section.title}</Text>
        <Text style={styles.contentBody}>{section.body}</Text>
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
    backgroundColor: Colors.tint,
    borderColor: Colors.tint,
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
    fontSize: 24,
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
