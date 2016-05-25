/* @flow */
'use strict';

import React, { Component } from 'react';

import ReactNative, {
  View,
  Text,
  ListView,
  RecyclerViewBackedScrollView,
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

import SourcesBarChart from '../Charts/SourcesBarChart';

class BookSources extends Component {
  state: {
    dataSource: any
  };

  constructor(props: Object) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      dataSource: dataSource
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.props.book.sourceCounts)
    });
  }

  render() {
    const { book } = this.props
    const narratorPercent = (book.sourceTypeCounts.narrator / book.wordCount) * 100;
    const godPercent = (book.sourceTypeCounts.god / book.wordCount) * 100;
    const leadPercent = (book.sourceTypeCounts.lead / book.wordCount) * 100;
    const supportPercent = (book.sourceTypeCounts.support / book.wordCount) * 100;

    return (
      <View style={styles.container}>
        <SourcesBarChart
          style={styles.stackedBarChartHeader}
          data={[{narrator: 1, god: 1, lead: 1, support: 1}]}
        />
        <View style={styles.sourceFilterContainer}>
          <TouchableOpacity style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, {color: Colors.sources.narrator}]}>{Localizable.toPercentage(narratorPercent, {precision: 0})}</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.narrator}]}>
              <Text style={[styles.roundButtonTitle, {color: Colors.sources.narrator}]}>{Localizable.t('sources.narrator').toLocaleUpperCase()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, {color: Colors.sources.god}]}>{Localizable.toPercentage(godPercent, {precision: 0})}</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.god}]}>
              <Text style={[styles.roundButtonTitle, {color: Colors.sources.god}]}>{Localizable.t('sources.god').toLocaleUpperCase()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, {color: Colors.sources.lead}]}>{Localizable.toPercentage(leadPercent, {precision: 0})}</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.lead}]}>
              <Text style={[styles.roundButtonTitle, {color: Colors.sources.lead}]}>{Localizable.t('sources.lead').toLocaleUpperCase()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, {color: Colors.sources.support}]}>{Localizable.toPercentage(supportPercent, {precision: 0})}</Text>
            <View style={[styles.roundButton, {borderColor: Colors.sources.support}]}>
              <Text style={[styles.roundButtonTitle, {color: Colors.sources.support}]}>{Localizable.t('sources.support').toLocaleUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ListView
          contentContainerStyle={styles.list}
          dataSource={this.state.dataSource}
          initialListSize={18}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
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
    }
    const sourceType = SOURCE_TYPE_MAP[source.name] || "support";
    const tintColor = Colors.sources[sourceType];
    const IMAGE_MAP = {
      "narrator": require('../../Images/avatars/narrator.png'),
      "god": require('../../Images/avatars/divine.png'),
    }
    const image = IMAGE_MAP[sourceType] || require('../../Images/avatars/human-group.png');
    const chartData = {};
    chartData[sourceType] = source.wordCount;

    return (
      <View style={styles.section}>
        <View style={StyleSheet.styles.separator}></View>
        <View style={[styles.sourcesCellContainer, {paddingVertical: 12}]}>
          <View style={styles.sourcesLeftContainer}>
            <Image source={image} style={[styles.sourceAvatar, {tintColor: tintColor}]} />
            <Text style={StyleSheet.styles.cell.title}>{source.name}</Text>
          </View>
          <View style={styles.sourcesRightContainer}>
            <SourcesBarChart
              style={styles.sourcesBarChart}
              data={[chartData]}
              maxChartValue={book.maxSourceWordCount}
            />
            <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('words.count', {count: source.wordCount, localizedCount: source.wordCount.toLocaleString()})}</Text>
          </View>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: NavigationHeader.HEIGHT,
  },
  stackedBarChartHeader: {
    height: 3,
    flex: 0,
  },
  sourceFilterContainer: {
    flexDirection: 'row',
    marginHorizontal: 9,
    marginVertical: 8,
  },
  sourceButtonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  sourceButtonTitle: {
    fontSize: 25,
    fontWeight: '300',
    marginBottom: 5,
    alignSelf: 'center',
  },
  roundButton: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  roundButtonTitle: {
    fontSize: 11,
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
  sourceAvatar: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  sourcesBarChart: {
    height: 4,
    flex: 0,
    marginBottom: 7,
  },
});

export default BookSources;
