/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  RecyclerViewBackedScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ListView } from '../../Components/Common/DatabaseListView';

import {
  Colors,
  Constants,
  StyleSheet,
  Localizable
} from '../../Common';

const {
  SourceType,
  SphereType
} = Constants;

import SourcesBarChart from '../../Components/Charts/SourcesBarChart';
import SourceIcon from '../../Components/Common/SourceIcon';

import { readerURL, sourceURL } from '../../Navigation';

import { Book } from '../../Database';

type Props = {
  bookID: string,
  navigate: Function,
};

type State = {
  book: Object,
  dataSource: any,
};

export default class BookSources extends Component {
  props: Props;
  state: State;

  constructor(props: Object) {
    super(props);

    const book = Book.findByID(props.bookID);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      book,
      dataSource
    };
  }

  componentDidMount() {
    const { book } = this.state;
    const sourceRelations = book.sourceRelations.slice(0).sort((a, b) => a.wordCount > b.wordCount ? -1 : 1);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(sourceRelations)
    });
  }

  render() {
    const { book } = this.state;

    return (
      <View style={styles.container}>
        <ListView
          contentContainerStyle={styles.list}
          dataSource={this.state.dataSource}
          initialListSize={18}
          enableEmptySections={true}
          renderHeader={this._renderHeader}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={[StyleSheet.styles.separator, {marginLeft: 0}]} />}
        />
      </View>
    );
  }

  _renderHeader = (props: any) => {
    const { book } = this.state;
    const narratorPercent = (book.countOfSourceType(SourceType.NARRATOR) / book.wordCount) * 100;
    const godPercent = (book.countOfSourceType(SourceType.GOD) / book.wordCount) * 100;
    const leadPercent = (book.countOfSourceType(SourceType.LEAD) / book.wordCount) * 100;
    const supportPercent = (book.countOfSourceType(SourceType.SUPPORT) / book.wordCount) * 100;

    return (
      <View>
        <SourcesBarChart
          style={styles.stackedBarChartHeader}
          data={[book.sourceTypeCounts]}
        />
        <View style={StyleSheet.styles.statisticsContainer}>
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toPercentage(narratorPercent, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Narrator</Text>
          </View>
          <View style={StyleSheet.styles.statisticKeyline} />
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toPercentage(godPercent, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Divine</Text>
          </View>
          <View style={StyleSheet.styles.statisticKeyline} />
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toPercentage(leadPercent, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Lead</Text>
          </View>
          <View style={StyleSheet.styles.statisticKeyline} />
          <View style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toPercentage(supportPercent, {precision: 0})}</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Support</Text>
          </View>
        </View>
      </View>
    );
  };

  _renderRow = (sourceRelation: Object, sectionID: string, rowID: string, highlightRow: boolean) => {
    const { book } = this.state;
    const source = sourceRelation.source;
    const chartData = Object.keys(sourceRelation.sourceTypeCounts).filter(sourceType => sourceRelation.sourceTypeCounts[sourceType].count > 0).map(sourceType => {
      const sourceTypeCount = sourceRelation.sourceTypeCounts[sourceType];
      const data = {};
      data[sourceTypeCount.string] = sourceTypeCount.count;
      return data;
    });

    return (
      <TouchableOpacity style={styles.section} onPress={() => this._onPressScripture(source)}>
        <View style={[styles.sourcesCellContainer, {paddingVertical: 12}]}>
          <View style={styles.sourcesLeftContainer}>
            <TouchableOpacity onPress={() => this.props.navigate(sourceURL({sourceID: source.id, title: source.name}))}>
              <SourceIcon
                principalSourceType={sourceRelation.principalSourceType}
                source={source}
                style={styles.sourceAvatar}
                size={20}
              />
            </TouchableOpacity>
            <Text style={StyleSheet.styles.cell.title}>{source.name}</Text>
          </View>
          <View style={styles.sourcesRightContainer}>
            <SourcesBarChart
              style={styles.sourcesBarChart}
              data={chartData}
              maxChartValue={book.maxSourceWordCount}
            />
            <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('words.count', {count: sourceRelation.wordCount, localizedCount: Localizable.toNumber(sourceRelation.wordCount, {precision: 0})})}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _onPressScripture = (source: Object) => {
    const { book } = this.state;

    this.props.navigate(readerURL({bookID: book.id, anchor: `source-${source.name}-1`, title: book.name, description: `${book.name} ${source.name} 1`}));
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackedBarChartHeader: {
    height: 2,
    flex: 0,
  },
  sourceFilterContainer: {
    flex: 0,
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 8,
    marginBottom: 15,
    justifyContent: 'space-around'
  },
  sourceButtonContainer: {
    flex: 1,
  },
  sourcePercentageTitle: {
    fontSize: 25,
    fontWeight: '200',
    alignSelf: 'center',
    marginTop: 5,
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
    flex: 2,
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
});
