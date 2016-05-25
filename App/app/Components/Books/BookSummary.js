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

import { ReadingTime } from '../../Common/NumberHelper';

class BookSummary extends Component {
  render() {
    const { book } = this.props;

    const sources = Object.keys(book.sources).sort((a, b) => book.sources[a] > book.sources[b] ? -1 : 1).slice(0, 5).map((source) => {
      return this._renderSource({name: source, actant: 'human', type: 'support'});
    });

    return (
      <ScrollView style={styles.container}>
        <WordCloud
          backgroundColors={['#a856cd',  '#3722a7']}
          style={styles.wordCloud}
        />

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
    return (
      <TouchableOpacity key={'source-' + source.name} style={styles.sourceButton}>
        <Image source={require('../../Images/avatars/human-group-medium.png')} style={styles.sourceImage}/>
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
