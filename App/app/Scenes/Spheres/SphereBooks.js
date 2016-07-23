/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  AsyncStorage,
  Dimensions,
  Platform,
  RecyclerViewBackedScrollView,
  ScrollView,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { ListView } from '../../Components/Common/DatabaseListView';

const { width: WIDTH } = Dimensions.get('window');

import {
  Colors,
  Constants,
  Localizable,
  StyleSheet,
} from '../../Common';

const { Preferences } = Constants;

import { BarChart, PieChart } from '../../Components/Charts';

// $FlowFixMe: - Flow can't find os module extension
import SegmentedControl from '../../Components/Common/SegmentedControl';

import { Book, Sphere } from '../../Database';

const SEGMENTS = [Localizable.t('textual'), Localizable.t('alphabetical'), Localizable.t('percentage')];
const SEGMENT_INDEXES = {
  TEXT: 0,
  ALPHABETICAL: 1,
  PRINCIPALITY: 2
};

const SORT_PREFERENCE = Preferences.Books.Sort + '.SphereBooks';

type Props = {
  onPressBook: Function,
  sphereID: string,
};

type State = {
  dataSource: any,
  selectedSegmentIndex?: number,
  sphere: Object,
};

type PieProps = {
  book: Object,
  subtitleStyle?: any,
  size: number,
  sliceWidth?: number,
  style?: any,
  titleStyle?: any
};

export default class SphereBooks extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const sphere = Sphere.findByID(props.sphereID);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});

    this.state = {
      dataSource: dataSource,
      sphere
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(SORT_PREFERENCE).then(sort => {
      let selectedSegmentIndex = this.state.selectedSegmentIndex || SEGMENT_INDEXES.PRINCIPALITY;
      if (sort != null) selectedSegmentIndex = parseInt(sort);

      this.setState({
        dataSource: this._getDataSource(selectedSegmentIndex),
        selectedSegmentIndex
      });
    });
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderHeader={this._renderHeader}
        renderRow={this._renderRow}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={StyleSheet.styles.separator} />}
      />
    );
  }

  _renderHeader = () => {
    const { sphere } = this.state;
    const colors = Colors.spheres[sphere.id];

    let oldTestamentWordCount = 0;
    let oldTestamentSphereWordCount = 0;
    let newTestamentWordCount = 0;
    let newTestamentSphereWordCount = 0;
    Book.all().forEach(book => {
      if (book.testament === 0) {
        oldTestamentWordCount += book.wordCount;
        oldTestamentSphereWordCount += sphere.countOfBook(book.id);
      } else {
        newTestamentWordCount += book.wordCount;
        newTestamentSphereWordCount += sphere.countOfBook(book.id);
      }
    });
    const spherePercent = ((oldTestamentSphereWordCount + newTestamentSphereWordCount) / (oldTestamentWordCount + newTestamentWordCount))  * 100;
    const oldTestamentSpherePercent = (oldTestamentSphereWordCount / oldTestamentWordCount) * 100;
    const newTestamentSpherePercent = (newTestamentSphereWordCount / newTestamentWordCount) * 100;

    const books = this._bookSortedByPercentage().slice(0, 10);

    return (
      <View>
        <View style={StyleSheet.styles.statisticsContainer}>
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Whole Bible</Text>
          </View>
          <View style={StyleSheet.styles.statisticKeyline} />
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toPercentage(oldTestamentSpherePercent, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Old Testament</Text>
          </View>
          <View style={StyleSheet.styles.statisticKeyline} />
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toPercentage(newTestamentSpherePercent, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>New Testament</Text>
          </View>
          <View style={StyleSheet.styles.statisticKeyline} />
        </View>
        <ScrollView style={styles.sphereBooksGraph}>
          {this._renderPie({book: books[0], size: 130, sliceWidth: 6, subtitleStyle: {fontSize: 17}, titleStyle: {fontSize: 24}, style: {top: 50, alignSelf: 'center'}})}
          {this._renderPie({book: books[1], size: 80, subtitleStyle: {fontSize: 15}, titleStyle: {fontSize: 20}, style: [styles.pie, {top: 95, left: 40}]})}
          {this._renderPie({book: books[2], size: 80, subtitleStyle: {fontSize: 15}, titleStyle: {fontSize: 20}, style: [styles.pie, {top: 20, left: -5}]})}
          {this._renderPie({book: books[3], size: 80, subtitleStyle: {fontSize: 15}, titleStyle: {fontSize: 20}, style: [styles.pie, {top: 30, right: 40}]})}
          {this._renderPie({book: books[4], size: 60, subtitleStyle: {fontSize: 12}, titleStyle: {fontSize: 16}, style: [styles.pie, {top: 130, right: 65}]})}
          {this._renderPie({book: books[5], size: 60, subtitleStyle: {fontSize: 12}, titleStyle: {fontSize: 16}, style: [styles.pie, {top: 15, left: 80}]})}
          {this._renderPie({book: books[6], size: 60, subtitleStyle: {fontSize: 12}, titleStyle: {fontSize: 16}, style: [styles.pie, {top: 105, right: 0}]})}
          {this._renderPie({book: books[7], size: 50, subtitleStyle: {fontSize: 10}, titleStyle: {fontSize: 13}, style: [styles.pie, {top: 5, left: 210}]})}
          {this._renderPie({book: books[8], size: 50, subtitleStyle: {fontSize: 10}, titleStyle: {fontSize: 13}, style: [styles.pie, {top: 15, right: -10}]})}
          {this._renderPie({book: books[9], size: 50, subtitleStyle: {fontSize: 10}, titleStyle: {fontSize: 13}, style: [styles.pie, {top: 145, left: -5}]})}
        </ScrollView>
        <SegmentedControl
          style={styles.segmentedControl}
          tintColor={'#59626A'}
          values={SEGMENTS}
          selectedIndex={this.state.selectedSegmentIndex}
          onValueChange={(value) => this._onSegmentedControlValueChanged(SEGMENTS.indexOf(value))}
        />
      </View>
    );
  };

  _renderRow = (book: Object) => {
    const { sphere } = this.state;
    const wordCount = this._getCountOfBook(book);
    const spherePercent = this._getPercentOfBook(book);
    const colors = Colors.spheres[sphere.id];

    return (
      <TouchableOpacity style={styles.section} onPress={() => this.props.onPressBook({sphere, book})}>
        <View style={[styles.sourcesCellContainer, {paddingVertical: 12}]}>
          <View style={styles.sourcesLeftContainer}>
            <Text style={StyleSheet.styles.cell.title}>{book.name}</Text>
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
      </TouchableOpacity>
    );
  };

  _renderPie({book, size, sliceWidth, style, subtitleStyle, titleStyle}: PieProps) {
    const { sphere } = this.state;
    const colors = Colors.spheres[sphere.id];

    const bookPercent = this._getPercentOfBook(book);
    const slices = [{color: colors.tint, value: bookPercent}, {color: colors.lightTint, value: 100-bookPercent}];
    return (
      <PieChart
        color={colors.tint}
        slices={slices}
        sliceWidth={sliceWidth}
        subtitle={book.DJHRef}
        subtitleStyle={subtitleStyle}
        title={Localizable.toPercentage(bookPercent, {precision: 0})}
        titleStyle={[titleStyle, {color: colors.chromeTint}]}
        size={size}
        style={style}
      />
    )
  };

  _getCountOfBook(book: Object) {
    return this.state.sphere.countOfBook(book.id);
  };

  _getPercentOfBook(book: Object) {
    return (this._getCountOfBook(book) / book.wordCount) * 100;
  };

  _getDataSource = (segmentIndex: number) => {
    const { sphere } = this.state;

    switch (segmentIndex) {
      case SEGMENT_INDEXES.TEXT:
        return this.state.dataSource.cloneWithRowsAndSections({textOrder: Book.all().sorted('textOrder')});

      case SEGMENT_INDEXES.ALPHABETICAL:
        return this.state.dataSource.cloneWithRowsAndSections({alphabetical: Book.all().sorted('name')});

      default:
        return this.state.dataSource.cloneWithRowsAndSections({percentage: this._bookSortedByPercentage()});
    }
  };

  _bookSortedByPercentage = () => {
    const { sphere } = this.state;
    return sphere.bookCounts.map(count => Book.findByID(count.string));
  }

  _onSegmentedControlValueChanged = (value: number) => {
    AsyncStorage.setItem(SORT_PREFERENCE, value.toString());
    
    this.setState({
      selectedSegmentIndex: value,
      dataSource: this._getDataSource(value)
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sphereBooksGraph: {
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
  sectionHeaderContainer: {
    ...StyleSheet.styles.sectionHeaderContainer,
    marginLeft: 8,
    backgroundColor: 'transparent',
  },
  section: {
    marginLeft: 8,
  },
  sourcesCellContainer: {
    flex: 1,
    marginRight: 15,
    flexDirection: 'row',
  },
  sourcesLeftContainer: {
    flex: 1.5,
    flexDirection: 'row',
    paddingTop: 2,
  },
  sourcesRightContainer: {
    flex: 2,
  },
  sourceAvatar: {
    width: 20,
    height: 20,
    marginRight: 5
  },
  dataPair: {
    flex: 1,
    flexDirection: 'row',
  },
  sourcesBarChart: {
    flex: 0,
    height: 4,
    marginBottom: 7,
  },
  pie: {
    position: 'absolute',
  },
  ...Platform.select({
      ios: {
        segmentedControl: {
          marginTop: 10,
          marginHorizontal: 8,
        },
      },
      android: {
        segmentedControl: {
          shadowColor: 'red',
          elevation: 2,
        },
      },
  })
});
