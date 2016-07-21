/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Dimensions,
  Image,
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

// $FlowFixMe: Can't find os module extension
import LinearGradient from 'react-native-linear-gradient';
import { BarChart } from '../../Components/Charts';
import Icon from '../../Components/Common/Icon';

const WIDTH = Dimensions.get('window').width;
const CAROUSEL_ITEM_SIZE = 80;
const MAXIMUM_BOOK_COUNT = 5;

import { Bible, Book, Sphere } from '../../Database';

type Props = {
  sphereID?: string,
  onPressBook: Function,
  onPressBooks: Function,
  onPressPassages: Function,
  onPressSources: Function,
  onPressWords: Function,
};

type State = {
  sphere: Object,
  books: any,
};

export default class Spheres extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    let sphere = null;
    if (props.sphereID) {
      sphere = Sphere.findByID(props.sphereID);
    } else {
      sphere = Sphere.all()[0];
    }

    const books = this._getBooks(sphere);
    this.state = {
      sphere,
      books
    };
  }

  render() {
    const { sphere, books } = this.state;
    const colors = Colors.spheres[sphere.id];
    const spherePercent = (sphere.wordCount / Bible.wordCount) * 100;
    const bookRows = books.map(book => this._renderBookRow(book));
    return (
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={['#E1E9EE', '#FFFFFF']}
          start={[0.5, 0.25]} end={[0.5, 1.0]}
          style={styles.carouselContainer}
        >
          <View style={styles.carousel}>
            <View style={[styles.carouselItem, {bottom: CAROUSEL_ITEM_SIZE*1.2, right: (WIDTH/2 - CAROUSEL_ITEM_SIZE/2) - (CAROUSEL_ITEM_SIZE/2.2), transform:[{scale:0.7}]}]} />
            <View style={[styles.carouselItem, {bottom: CAROUSEL_ITEM_SIZE*1.2, left: (WIDTH/2 - CAROUSEL_ITEM_SIZE/2) - (CAROUSEL_ITEM_SIZE/2.2), transform:[{scale:0.7}]}]} />
            <View style={[styles.carouselItem, {bottom: CAROUSEL_ITEM_SIZE/1.25, right: (WIDTH/2 - CAROUSEL_ITEM_SIZE/2.5) - (CAROUSEL_ITEM_SIZE*1.4), transform:[{scale:0.8}]}]} />
            <View style={[styles.carouselItem, {bottom: CAROUSEL_ITEM_SIZE/1.25, left: (WIDTH/2 - CAROUSEL_ITEM_SIZE/2.5) - (CAROUSEL_ITEM_SIZE*1.4), transform:[{scale:0.8}]}]} />
            <View style={[styles.carouselItem, {bottom: CAROUSEL_ITEM_SIZE/2, right: (WIDTH/2 - CAROUSEL_ITEM_SIZE/2.5) - (CAROUSEL_ITEM_SIZE), transform:[{scale:0.9}]}]} />
            <View style={[styles.carouselItem, {bottom: CAROUSEL_ITEM_SIZE/2, left: (WIDTH/2 - CAROUSEL_ITEM_SIZE/2.5) - (CAROUSEL_ITEM_SIZE), transform:[{scale:0.9}]}]} />
            <View style={[styles.carouselItem, {bottom: 0, left: WIDTH/2 - CAROUSEL_ITEM_SIZE/2}]} />
          </View>
          <View style={styles.carouselInfo}>
            <Text style={styles.sphereTitle}>{sphere.name}</Text>
            <Text style={styles.sphereSubtitle}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text>
          </View>
        </LinearGradient>
        <View style={styles.carouselGraphContainer}>
          <View style={[styles.carouselGraph, {backgroundColor: colors.tint, flex: spherePercent}]} />
          <View style={[styles.carouselGraph, {flex: 100-spherePercent}]} />
        </View>
        <View style={StyleSheet.styles.statisticsContainer}>
          <TouchableOpacity style={StyleSheet.styles.statisticContainer} onPress={() => this.props.onPressBooks({sphere})}>
            <Text style={[StyleSheet.styles.statisticTitle, {color: colors.chromeTint}]}>{sphere.bookCount}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Books</Text>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity style={StyleSheet.styles.statisticContainer} onPress={() => this.props.onPressSources({sphere})}>
            <Text style={[StyleSheet.styles.statisticTitle, {color: colors.chromeTint}]}>0</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Sources</Text>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity style={StyleSheet.styles.statisticContainer} onPress={() => this.props.onPressWords({sphere})}>
            <Text style={[StyleSheet.styles.statisticTitle, {color: colors.chromeTint}]}>{Localizable.toNumber(sphere.wordCount, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Words</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.readButton, {backgroundColor: colors.chromeTint, borderColor: colors.chromeTint}]} onPress={() => this.props.onPressPassages({sphere})}>
          <Text style={styles.readButtonTitle}>Explore 52 key passages</Text>
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Text style={[styles.contentBody, {marginBottom: -25, marginTop: -10}]}>Introduction</Text>
          <Text style={styles.contentHeader}>How {sphere.name} Shows Up in Scripture</Text>
          <Text style={[styles.contentBody, {marginTop: 5}]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu imperdiet ipsum, at pellentesque arcu. Quisque eleifend enim id felis semper, id euismod dolor hendrerit. Sed fringilla dui eget enim pulvinar, vitae consequat dui bibendum. Maecenas nulla odio.</Text>
        </View>
        <View style={styles.listContainer}>
          <View style={[styles.listItemHeader, {borderTopColor: colors.tint}]}>
            <Text style={StyleSheet.styles.cell.titlebold}>Top Books</Text>
          </View>
        </View>
        {bookRows}
        <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => this.props.onPressBooks({sphere})}>
          <Text style={[StyleSheet.styles.cell.titlemore, {color: colors.chromeTint}]}>View More</Text>
          <Image source={require('../../Images/common/disclosure.png')}  style={styles.disclosure} />
        </TouchableOpacity>
        <View style={styles.listContainer}>
          <View style={[styles.listItemHeader, {borderTopColor: colors.tint}]}>
            <Text style={StyleSheet.styles.cell.titlebold}>Top Sources</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.section}>
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
              <View style={[styles.sourcesBarChart, {height: 4, backgroundColor: '#EDEDED'}]} />
              <View style={styles.dataPair}>
                <Text style={[StyleSheet.styles.cell.percentage, {color: 'red'}]}>0%</Text>
                <Text style={StyleSheet.styles.cell.subtitle}>0 words</Text>
              </View>
            </View>
          </View>
          <View style={[StyleSheet.styles.separator, {marginLeft: 0}]}></View>
        </TouchableOpacity>
        <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => this.props.onPressSources({sphere})}>
          <Text style={[StyleSheet.styles.cell.titlemore, {color: colors.chromeTint}]}>View More</Text>
          <Image source={require('../../Images/common/disclosure.png')}  style={styles.disclosure} />
        </TouchableOpacity>
      </ScrollView>
    );
  }

  _renderBookRow = (book: Object) => {
    const { sphere } = this.state;
    const colors = Colors.spheres[sphere.id];
    const wordCount = sphere.countOfBook(book.id);
    const spherePercent = (wordCount / book.wordCount) * 100;

    return (
      <TouchableOpacity key={book.id} style={styles.section} onPress={() => this.props.onPressBook({sphere, book})}>
        <View style={[styles.sourcesCellContainer, {paddingVertical: 12}]}>
          <View style={styles.sourcesLeftContainer}>
            <Text style={StyleSheet.styles.cell.titlemedium}>{book.name}</Text>
          </View>
          <View style={styles.sourcesRightContainer}>
            <BarChart
              bars={[{color: colors.tint, value: spherePercent}]}
              deltaStyle={{backgroundColor: colors.lightTint}}
              maxChartValue={100}
              style={styles.sourcesBarChart}
            />
            <View style={styles.dataPair}>
              <Text style={[StyleSheet.styles.cell.percentage, {color: colors.tint}]}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text>
              <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('words.count', {count: wordCount, localizedCount: Localizable.toNumber(wordCount, {precision: 0})})}</Text>
            </View>
          </View>
        </View>
        <View style={[StyleSheet.styles.separator, {marginLeft: 0}]}></View>
      </TouchableOpacity>
    );
  };

  _getBooks = (sphere: Object) => {
    return sphere.bookCounts.map(count => Book.findByID(count.string)).slice(0, MAXIMUM_BOOK_COUNT);
  };
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    height: 250,
    backgroundColor: '#E1E9EE',
  },
  carousel: {
    flex: 1,
  },
  carouselInfo: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginVertical: 8,
  },
  carouselItem: {
    position: 'absolute',
    width: CAROUSEL_ITEM_SIZE,
    height: CAROUSEL_ITEM_SIZE,
    borderRadius: CAROUSEL_ITEM_SIZE/2,
    borderWidth: 1,
    borderColor: '#B7C0C8',
    overflow:'hidden',
    backgroundColor: '#CED7DF',
    shadowColor: "black",
    shadowOpacity: .5,
    shadowRadius: 5,
    shadowOffset: {
      height: 0,
      width: 0
    },
  },
  carouselGraphContainer: {
    height: 2,
    backgroundColor: '#D8D8D8',
    flexDirection: 'row',
  },
  carouselGraph: {
    height: 2,
  },
  sphereTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#59626A',
  },
  sphereSubtitle: {
    color: '#9B9B9B',
    fontSize: 17,
  },
  keyline: {
    flex:0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator
  },
  readButton: {
    backgroundColor: Colors.tint,
    borderColor: Colors.tint,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    overflow:'hidden',
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
    justifyContent: 'center',
  },
  readButtonTitle: {
    color: 'white',
    fontSize: 18,
    marginVertical: 20,
    marginHorizontal: 40,
  },
  contentContainer: {
    marginHorizontal: 20,
    marginBottom: 35,
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
  listItemContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 5,
    flexDirection: 'row',
  },
  listItemHeader: {
    borderTopWidth: 2,
    paddingLeft: 15,
    paddingVertical: 15,
    borderBottomColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: 'black',
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
  dataPair: {
    flex: 1,
    flexDirection: 'row',
  },
  sourceAvatar: {
    width: 20,
    height: 20,
    marginRight: 5
  },
  sourcesBarChart: {
    flex: 0,
    height: 4,
    marginBottom: 7,
  },
});
