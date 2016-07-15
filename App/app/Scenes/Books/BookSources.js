/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ListView,
  RecyclerViewBackedScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import SourcesBarChart from '../../Components/Charts/SourcesBarChart';
import Icon from '../../Components/Common/Icon';

type Props = {
  book: Object,
  onPressScripture: Function,
  onPressSource: Function,
};

type State = {
  dataSource: any,
};

export default class BookSources extends Component {
  state: State;

  constructor(props: Object) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      dataSource: dataSource
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.props.book.sources)
    });
  }

  render() {
    const { book } = this.props

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

  _renderRow = (source: Object, sectionID: string, rowID: string, highlightRow: boolean) => {
    const { book } = this.props;

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
    const chartData = {};
    chartData[sourceType] = source.wordCount;

    return (
      <TouchableOpacity style={styles.section} onPress={() => this._onPressScripture(source)}>
        <View style={[styles.sourcesCellContainer, {paddingVertical: 12}]}>
          <View style={styles.sourcesLeftContainer}>
            <TouchableOpacity onPress={() => this.props.onPressSource(source)}>
              <Icon
                name={iconName}
                style={[styles.sourceAvatar, {color: color}]}
                size={20}
              />
            </TouchableOpacity>
            <Text style={StyleSheet.styles.cell.title}>{source.name}</Text>
          </View>
          <View style={styles.sourcesRightContainer}>
            <SourcesBarChart
              style={styles.sourcesBarChart}
              data={[chartData]}
              maxChartValue={book.maxSourceWordCount}
            />
            <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('words.count', {count: source.wordCount, localizedCount: Localizable.toNumber(source.wordCount, {precision: 0})})}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderHeader = (props: any) => {
    const { book } = this.props;
    const narratorPercent = (book.sourceTypeCounts.narrator / book.wordCount) * 100;
    const godPercent = (book.sourceTypeCounts.god / book.wordCount) * 100;
    const leadPercent = (book.sourceTypeCounts.lead / book.wordCount) * 100;
    const supportPercent = (book.sourceTypeCounts.support / book.wordCount) * 100;

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

  _onPressScripture = (source: Object) => {
    const occurrence = source.occurrences[0];
    if (occurrence) {
      const book = this.props.book;
      const chapterNumber = occurrence.chapterNumber;
      this.props.onPressScripture({book, chapterNumber});
    }
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
