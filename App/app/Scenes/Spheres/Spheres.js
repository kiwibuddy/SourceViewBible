/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Dimensions,
  Image,
  LayoutAnimation,
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
import SourceIcon from '../../Components/Common/SourceIcon';

const WIDTH = Dimensions.get('window').width;
const CAROUSEL_ITEM_SIZE = 80;
const MAXIMUM_BOOK_COUNT = 5;
const MAXIMUM_SOURCE_COUNT = 5;

import { bookURL, readerURL, sphereBooksURL, spherePassagesURL, sphereSourcesURL, sphereWordsURL, sphereURL } from '../../Navigation';
import { Bible, Actant, Book, Sphere } from '../../Database';
import { Preference } from '../../Preferences';

import FoundationalSphere from './FoundationalSphere';

const SphereIcons = {
  'foundational': require('./Images/sphere-foundational.png'),
  'family': require('./Images/sphere-family.png'),
  'economics': require('./Images/sphere-economics.png'),
  'government': require('./Images/sphere-government.png'),
  'religion': require('./Images/sphere-religion.png'),
  'education': require('./Images/sphere-education.png'),
  'communication': require('./Images/sphere-communication.png'),
  'celebration': require('./Images/sphere-celebration.png')
};

type Props = {
  sphereID?: string,
  navigate: Function,
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

    this._setSphere(props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this._setSphere(nextProps);
  }

  render() {
    const { sphere } = this.state;

    if (sphere.isFoundational) {
      return this._renderFoundationalSphere();
    } else {
      return this._renderSphere(sphere);
    }
  }

  _renderHeader = () => {
    const { sphere } = this.state;
    const spherePercent = (sphere.wordCount / Bible.wordCount) * 100;
    const spheres = Sphere.all({foundational: true});
    const sphereCount = spheres.length;

    let sphereIndex = 0;
    spheres.forEach((s, index) => {
      if (s.id === sphere.id) {
        sphereIndex = index;
      }
    });
    const sortedSpheres = spheres.slice().slice(sphereIndex, sphereCount);
    for (let index = 0; index < sphereIndex; index++) {
      sortedSpheres.push(spheres[index]);
    }

    const carouselIcons = sortedSpheres.map(sphere => this._renderCarouselIcon(sphere));

    const sphereSubtitle = (sphere.isFoundational ? ' ' : Localizable.toPercentage(spherePercent, {precision: 0}));

    return (
      <LinearGradient
        colors={['#E1E9EE', '#FFFFFF']}
        start={[0.5, 0.25]} end={[0.5, 1.0]}
        style={styles.carouselContainer}
      >
        <View style={styles.carousel}>
          <TouchableOpacity
            key={'sphere-' + sortedSpheres[4].id}
            onPress={() => this._onPressSphere(sortedSpheres[4])}
            style={[styles.carouselItem, {bottom: CAROUSEL_ITEM_SIZE*1.3, right: (WIDTH/2) - (CAROUSEL_ITEM_SIZE/2.2), transform:[{scale:0.65}]}]}>
            {carouselIcons[4]}
          </TouchableOpacity>
          <TouchableOpacity
            key={'sphere-' + sortedSpheres[3].id}
            onPress={() => this._onPressSphere(sortedSpheres[3])}
            style={[styles.carouselItem, {bottom: CAROUSEL_ITEM_SIZE*1.2, right: (WIDTH/2 - CAROUSEL_ITEM_SIZE/1.4) - (CAROUSEL_ITEM_SIZE/2.2), transform:[{scale:0.7}]}]}>
            {carouselIcons[3]}
          </TouchableOpacity>
          <TouchableOpacity
            key={'sphere-' + sortedSpheres[5].id}
            onPress={() => this._onPressSphere(sortedSpheres[5])}
            style={[styles.carouselItem, {bottom: CAROUSEL_ITEM_SIZE*1.2, left: (WIDTH/2 - CAROUSEL_ITEM_SIZE/1.25) - (CAROUSEL_ITEM_SIZE/2.2), transform:[{scale:0.7}]}]}>
            {carouselIcons[5]}
          </TouchableOpacity>
          <TouchableOpacity
            key={'sphere-' + sortedSpheres[2].id}
            onPress={() => this._onPressSphere(sortedSpheres[2])}
            style={[styles.carouselItem, {bottom: CAROUSEL_ITEM_SIZE/1.25, right: (WIDTH/2 - CAROUSEL_ITEM_SIZE/2.5) - (CAROUSEL_ITEM_SIZE*1.5), transform:[{scale:0.8}]}]}>
            {carouselIcons[2]}
          </TouchableOpacity>
          <TouchableOpacity
            key={'sphere-' + sortedSpheres[6].id}
            onPress={() => this._onPressSphere(sortedSpheres[6])}
            style={[styles.carouselItem, {bottom: CAROUSEL_ITEM_SIZE/1.25, left: (WIDTH/2 - CAROUSEL_ITEM_SIZE/2.5) - (CAROUSEL_ITEM_SIZE*1.5), transform:[{scale:0.8}]}]}>
            {carouselIcons[6]}
          </TouchableOpacity>
          <TouchableOpacity
            key={'sphere-' + sortedSpheres[1].id}
            onPress={() => this._onPressSphere(sortedSpheres[1])}
            style={[styles.carouselItem, {bottom: CAROUSEL_ITEM_SIZE/2, right: (WIDTH/2 - CAROUSEL_ITEM_SIZE/2.5) - (CAROUSEL_ITEM_SIZE), transform:[{scale:0.9}]}]}>
            {carouselIcons[1]}
          </TouchableOpacity>
          <TouchableOpacity
            key={'sphere-' + sortedSpheres[7].id}
            onPress={() => this._onPressSphere(sortedSpheres[7])}
            style={[styles.carouselItem, {bottom: CAROUSEL_ITEM_SIZE/2, left: (WIDTH/2 - CAROUSEL_ITEM_SIZE/2.5) - (CAROUSEL_ITEM_SIZE), transform:[{scale:0.9}]}]}>
            {carouselIcons[7]}
          </TouchableOpacity>
          <TouchableOpacity
            key={'sphere-' + sortedSpheres[0].id}
            onPress={() => this._onPressSphere(sortedSpheres[0])}
            style={[styles.carouselItem, {bottom: 15, left: WIDTH/2 - CAROUSEL_ITEM_SIZE/2}]}>
            {carouselIcons[0]}
          </TouchableOpacity>
        </View>
        <View style={styles.carouselInfo}>
          <Text style={styles.sphereTitle}>{sphere.name}</Text>
          <Text style={styles.sphereSubtitle}>{sphereSubtitle}</Text>
        </View>
      </LinearGradient>
    );
  };

  _renderSphere = (sphere: Object) => {
    const colors = Colors.spheres[sphere.id];
    const spherePercent = (sphere.wordCount / Bible.wordCount) * 100;

    const books = this._getBooks(sphere);
    const bookRows = books.map(book => this._renderBookRow(book));

    const sources = this._getSources(sphere);
    const sourceRows = sources.map(source => this._renderSourceRow(source));

    const header = this._renderHeader();
    return (
      <ScrollView style={styles.container}>
        {header}
        <View style={styles.carouselGraphContainer}>
          <View style={[styles.carouselGraph, {backgroundColor: colors.tint, flex: spherePercent}]} />
          <View style={[styles.carouselGraph, {flex: 100-spherePercent}]} />
        </View>
        <View style={StyleSheet.styles.statisticsContainer}>
          <TouchableOpacity style={StyleSheet.styles.statisticContainer} onPress={() => this.props.navigate(sphereBooksURL({sphereID: sphere.id, title: Localizable.t('sphere-books', {name: sphere.name})}))}>
            <Text style={[StyleSheet.styles.statisticTitle, {color: colors.chromeTint}]}>{Localizable.toNumber(sphere.bookCount, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Books</Text>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity style={StyleSheet.styles.statisticContainer} onPress={() => this.props.navigate(sphereSourcesURL({sphereID: sphere.id, title: Localizable.t('sphere-sources', {name: sphere.name})}))}>
            <Text style={[StyleSheet.styles.statisticTitle, {color: colors.chromeTint}]}>{Localizable.toNumber(sphere.sourceCount, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Sources</Text>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity style={StyleSheet.styles.statisticContainer} onPress={() => this.props.navigate(sphereWordsURL({sphereID: sphere.id, title: Localizable.t('sphere-words', {name: sphere.name})}))}>
            <Text style={[StyleSheet.styles.statisticTitle, {color: colors.chromeTint}]}>{Localizable.toNumber(sphere.wordCount, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Words</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.readButton, {backgroundColor: colors.chromeTint, borderColor: colors.chromeTint}]} onPress={() => this.props.navigate(spherePassagesURL({sphereID: sphere.id, title: Localizable.t('sphere-passages', {name: sphere.name})}))}>
          <Text style={styles.readButtonTitle}>Explore 52 key passages</Text>
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Text style={[styles.contentBody, {marginBottom: -25, marginTop: -10}]}>Introduction</Text>
          <Text style={styles.contentHeader}>How {sphere.name} Shows Up in Scripture</Text>
          <Text style={[styles.contentBody, {marginTop: 5}]}>{sphere.description}</Text>
        </View>

        <View style={styles.listContainer}>
          <View style={[styles.listItemHeader, {borderTopColor: colors.tint}]}>
            <Text style={StyleSheet.styles.cell.titlebold}>Top Books</Text>
          </View>
        </View>
        {bookRows}
        <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => this.props.navigate(sphereBooksURL({sphereID: sphere.id, title: Localizable.t('sphere-books', {name: sphere.name})}))}>
          <Text style={[StyleSheet.styles.cell.titlemore, {color: colors.chromeTint}]}>View More</Text>
          <Image source={require('../../Images/common/disclosure.png')}  style={styles.disclosure} />
        </TouchableOpacity>

        <View style={styles.listContainer}>
          <View style={[styles.listItemHeader, {borderTopColor: colors.tint}]}>
            <Text style={StyleSheet.styles.cell.titlebold}>Top Sources</Text>
          </View>
        </View>
        {sourceRows}
        <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => this.props.navigate(sphereSourcesURL({sphereID: sphere.id, title: Localizable.t('sphere-sources', {name: sphere.name})}))}>
          <Text style={[StyleSheet.styles.cell.titlemore, {color: colors.chromeTint}]}>View More</Text>
          <Image source={require('../../Images/common/disclosure.png')}  style={styles.disclosure} />
        </TouchableOpacity>
      </ScrollView>
    );
  };

  _renderFoundationalSphere = () => {
    return (
      <FoundationalSphere navigate={this.props.navigate} renderHeader={this._renderHeader} />
    );
  };


  _renderBookRow = (book: Object) => {
    const { sphere } = this.state;
    const colors = Colors.spheres[sphere.id];
    const wordCount = sphere.countOfBook(book.id);
    const spherePercent = (wordCount / book.wordCount) * 100;

    return (
      <TouchableOpacity key={book.id} style={styles.section} onPress={() => this._onPressBook(book)}>
        <View style={[styles.sourcesCellContainer, {paddingVertical: 12}]}>
          <View style={styles.sourcesLeftContainer}>
            <View style={styles.sourcesContent}>
              <Text style={StyleSheet.styles.cell.titlemedium}>{book.name}</Text>
            </View>
          </View>
          <View style={styles.sourcesRightContainer}>
            <BarChart
              bars={[{color: colors.tint, value: spherePercent}]}
              deltaStyle={{backgroundColor: colors.lightTint}}
              maxChartValue={100}
              style={styles.sourcesBarChart}
            />
            <View style={styles.dataPair}>
              <Text style={[StyleSheet.styles.cell.percentage, {color: colors.chromeTint}]}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text>
              <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('words.count', {count: wordCount, localizedCount: Localizable.toNumber(wordCount, {precision: 0})})}</Text>
            </View>
          </View>
        </View>
        <View style={[StyleSheet.styles.separator, {marginLeft: 0}]}></View>
      </TouchableOpacity>
    );
  };

  _renderSourceRow = (source: Object) => {
    const { sphere } = this.state;
    const colors = Colors.sources[source.principalSourceType];
    const wordCount = sphere.countOfSource(source.id);
    const spherePercent = (wordCount / source.wordCount) * 100;

    return (
      <TouchableOpacity key={source.id} style={styles.section}>
        <View style={[styles.sourcesCellContainer, {paddingVertical: 12}]}>
          <View style={styles.sourcesLeftContainer}>
            <SourceIcon
              source={source}
              style={[styles.sourceAvatar]}
              size={20}
            />
            <View style={styles.sourcesContent}>
              <Text style={StyleSheet.styles.cell.titlemedium}>{source.name}</Text>
            </View>
          </View>
          <View style={styles.sourcesRightContainer}>
            <BarChart
              bars={[{color: colors.tint, value: spherePercent}]}
              deltaStyle={{backgroundColor: colors.lightTint}}
              maxChartValue={100}
              style={styles.sourcesBarChart}
            />
            <View style={styles.dataPair}>
              <Text style={[StyleSheet.styles.cell.percentage, {color: '#59626A'}]}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text>
              <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('words.count', {count: wordCount, localizedCount: Localizable.toNumber(wordCount, {precision: 0})})}</Text>
            </View>
          </View>
        </View>
        <View style={[StyleSheet.styles.separator, {marginLeft: 0}]}></View>
      </TouchableOpacity>
    );
  };

  _setSphere = (props: Object) => {
    let sphere = null;
    if (props.sphereID) {
      sphere = Sphere.findByID(props.sphereID);
    } else {
      sphere = Sphere.all({foundational: true})[0];
    }

    const books = this._getBooks(sphere);
    this.state = {
      sphere,
      books
    };
  }

  _getBooks = (sphere: Object) => {
    return sphere.bookCounts.map(count => Book.findByID(count.string)).slice(0, MAXIMUM_BOOK_COUNT);
  };

  _getSources = (sphere: Object) => {
    return sphere.sourceCounts.map(count => Actant.findByID(parseInt(count.string))).slice(0, MAXIMUM_SOURCE_COUNT);
  };

  _renderCarouselIcon = (sphere: Object) => {
    const iconName = SphereIcons[sphere.id];
    return (
      <Image
        source={iconName}
        style={styles.carouselItem}
      />
    );
  };

  _onPressSphere = (sphere: Object) => {
    if (sphere.id === this.state.sphere.id) return;
    this.props.navigate(sphereURL({sphereID: sphere.id, title: Localizable.t('spheres.text'), description: Localizable.t('sphere-overview', {name: sphere.name})}), {replace: true});

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const books = this._getBooks(sphere);
    this.setState({
      sphere,
      books
    });
  };

  _onPressBook = (book: Object) => {
    Preference.setObjectForKey([this.state.sphere.id], Preference.Keys.Reader.spheres);
    this.props.navigate(readerURL({bookID: book.id, anchor: 'chapter-1', title: book.name}));
  };
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    height: 250,
    backgroundColor: '#FFFFFF',
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
    marginTop: -20,
  },
  sphereSubtitle: {
    color: '#9B9B9B',
    fontSize: 17,
    paddingBottom: 10,
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
    alignSelf: 'center',
  },
  sourcesRightContainer: {
    flex: 1,
    marginRight: 8,
    alignSelf: 'center',
  },
  sourcesContent: {
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 8,
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
