/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, {
  View,
  Text,
  Image,
  ListView,
  ScrollView,
  TouchableOpacity,
  RecyclerViewBackedScrollView,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

import {
  Colors,
  StyleSheet,
} from '../../Common';

// $FlowFixMe: Can't find os module extension
import LinearGradient from 'react-native-linear-gradient';
import { SourcesBarChart, SpheresBarChart } from '../../Components/Charts';
import PageControl from '../../Components/Common/PageControl';
import { ReadingTime } from '../../Common/NumberHelper';
import Localizable from '../../Common/Localizable';
import Icon from '../../Components/Common/Icon';

const Bible = require('../../Locale/en/NLT/SourceView.json');
const MAXIMUM_BOOK_COUNT = 9;

type Props = {
  onPressBook: Function,
  onPressBooks: Function,
};

type State = {
  dataSource: any,
  currentPage: number
}

export default class DiscoverBooks extends Component {
  state: State;

  constructor(props: Object) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      dataSource: dataSource,
      currentPage: 0
    };
  }

  componentDidMount() {
    const books = Bible.books.slice(0).sort((a, b) => a.sourceCount > b.sourceCount ? -1 : 1).slice(0, MAXIMUM_BOOK_COUNT);

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(books)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onPressBooks}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={StyleSheet.styles.sectionHeaderTitle}>BOOKS</Text>
            <View style={styles.sectionHeaderDetail}>
              <Text style={[StyleSheet.styles.sectionHeaderTitle, {color: Colors.tintColor, fontWeight: 'normal'}]}>View All</Text>
              <Image source={require('../../Images/common/disclosure.png')}  style={styles.disclosure} />
            </View>
            </View>
        </TouchableOpacity>

        <View style={[styles.sectionContainer, {flexDirection: 'column'}]}>
          <ListView
            style={{marginHorizontal: 4}}
            contentContainerStyle={styles.list}
            dataSource={this.state.dataSource}
            initialListSize={3}
            pageSize={3}
            enableEmptySections={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            renderRow={this._renderBook}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            onMomentumScrollEnd={this._onScrollEnd}
          />
          <PageControl
            numberOfPages={3}
            currentPage={this.state.currentPage}
          />
        </View>
      </View>
    );
  }

  _renderBook = (book: Object) => {
    const spherePercent = (book.sphereWordCount / book.wordCount) * 100;

    return (
      <TouchableOpacity key={'book-' + book.key} style={styles.itemContainer} onPress={ () => this.props.onPressBook(book) }>
        <View style={styles.item}>
          <LinearGradient
            colors={Colors.sources[book.principalSourceType].gradient.tiny}
            start={[0.0, 0.25]} end={[0.5, 1.0]}
            style={styles.gradient}
          />
          <Icon
            name="icon-books"
            size={40}
            style={[styles.icon, {color: Colors.sources[book.principalSourceType].tint}]}
          />
          <Text style={styles.bookTitle}>{book.name}</Text>
          <Text style={styles.bookReadTime}>{ReadingTime(book.wordCount)}</Text>
          <View style={styles.keyline} />
          <View style={styles.statisticsContainer}>
            <View style={styles.statisticContainer} >
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.statisticTitle}>{book.sourceCount}</Text>
                <Text style={styles.statisticSubtitle}>Sources</Text>
                <SourcesBarChart
                  style={{flex: 0, marginLeft: 4}}
                  barStyle={{width: 2, height: 12, marginHorizontal: 1}}
                  horizontal={false}
                  data={[{narrator: book.sourceTypeCounts.narrator}, {god: book.sourceTypeCounts.god}, {lead: book.sourceTypeCounts.lead}, {support: book.sourceTypeCounts.support}]}
                />
              </View>
            </View>
            <View style={styles.statisticContainer} >
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.statisticTitle}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text>
                <Text style={styles.statisticSubtitle}>Spheres</Text>
                <SpheresBarChart
                  style={{flex: 0, marginLeft: 4}}
                  barStyle={{width: 2, height: 12, marginHorizontal: 1}}
                  horizontal={false}
                  data={[{family: book.sphereCounts.family}, {economics: book.sphereCounts.economics}, {government: book.sphereCounts.government}, {religion: book.sphereCounts.religion}, {education: book.sphereCounts.education}, {communication: book.sphereCounts.communication}, {celebration: book.sphereCounts.celebration}]}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _onScrollEnd = (e: Object) => {
    // making our events coming from android compatible to updateIndex logic
    if (!e.nativeEvent.contentOffset) {
      e.nativeEvent.contentOffset = {x: e.nativeEvent.position * width}
    }

    const currentPage = Math.floor((e.nativeEvent.contentOffset.x - width / 2) / width) + 1;

    this.setState({
      currentPage: currentPage
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeaderContainer: {
    ...StyleSheet.styles.sectionHeaderContainer,
    borderBottomWidth: 0,
    marginLeft: 8,
  },
  sectionContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  sectionHeaderDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  disclosure: {
    width: 15,
    height: 15,
    marginTop: 8,
    marginLeft: 5,
    marginRight: -10,
  },
  list: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginHorizontal: 4,
  },
  itemContainer: {
    width: ((width - 8) / 3),
  },
  item: {
    marginHorizontal: 4,
    marginBottom: 8,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    backgroundColor: '#fff',
    height: 138,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 0.4,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  gradient: {
    flex: 0,
    height: 3,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden'
  },
  icon: {
    alignSelf: 'center',
    marginTop: 7,
    color: Colors.tintColor
  },
  bookTitle: {
    flex: 0,
    fontSize: (width <= 320 ? 11 : 13),
    color: '#59626a',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 1,
  },
  bookReadTime: {
    flex: 0,
    fontSize: 11,
    color: '#9b9b9b',
    textAlign: 'center',
    marginTop: 1,
    marginBottom: 7,
  },
  statisticsContainer: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: (width <= 320 ? 2 : 5),
  },
  statisticContainer: {
    marginTop: 7,
  },
  statisticTitle: {
    fontSize: 11,
    color: Colors.tintColor,
    marginRight: 3,
  },
  statisticSubtitle: {
    flex: 1,
    color: Colors.subtitle,
    fontSize: 11,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 8,
  },
  sourcesContainer: {
    flexDirection: 'row',
    margin: 4,
  },
  sourceImage: {
    width: 10,
    height: 10,
    margin: 4,
  },
  readTitle: {
    color: Colors.subtitle,
    fontSize: 12,
    alignSelf: 'center',
    paddingBottom: 8,
  },
  keyline: {
    flex:0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 2,
  },
});
