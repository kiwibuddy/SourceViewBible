/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Platform,
  RecyclerViewBackedScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ListView } from '../../Components/Common/DatabaseListView';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

// $FlowFixMe: - Flow can't find os module extension
import SegmentedControl from '../../Components/Common/SegmentedControl';
import { SourcesBarChart, SpheresBarChart } from '../../Components/Charts';
import { ReadingTime } from '../../Common/NumberHelper';
import SourceIcon from '../../Components/Common/SourceIcon';

const LISTVIEW_REF = 'LISTVIEW_REF';

import { sourceURL } from '../../Navigation';

import { Source } from '../../Database';

type Props = {
  navigate: Function,
};

type State = {
  dataSource: any,
};

export default class Sources extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    const sources = Source.all().sorted('firstInitial').sorted('name');
    const { rows, sections } = this._getRowsAndSections(sources);

    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(rows, sections)
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.listIndexContainer}>
          <TouchableOpacity><Text style={styles.listIndexTitle}>A</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>B</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>C</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>D</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>E</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>F</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>G</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>H</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>I</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>J</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>K</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>L</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>M</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>N</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>O</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>P</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>Q</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>R</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>S</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>T</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>U</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>V</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>W</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>X</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>Y</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>Z</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.listIndexTitle}>#</Text></TouchableOpacity>
        </View>
        <ListView
          ref="LISTVIEW_REF"
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSectionHeader={this._renderSectionHeader}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>
    );
  }

  _renderSectionHeader = (sectionData: Object, sectionID: any) => {
    const title = sectionID;
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderTitle}>{title}</Text>
      </View>
    );
  };

  _renderRow = (source: Object, sectionID: any, rowID: any) => {
    const SOURCE_TYPE_MAP = {
      "The Narrator": "narrator",
      "God": "god",
      "Jesus": "god"
    };

    const sourceType = SOURCE_TYPE_MAP[source.name] || "support";
    const chartData = {};
    chartData[sourceType] = source.wordCount;

    const wordCount = source.wordCount;

    return (
      <TouchableOpacity style={styles.section} onPress={() => this.props.navigate(sourceURL({sourceID: source.id, title: source.name}))}>
        <View style={styles.sourcesCellContainer}>
          <View style={styles.sourcesAvatar}>
            <SourceIcon
              source={source}
              style={styles.sourceAvatar}
              size={20}
            />
          </View>
          <View style={styles.sourcesLeftContainer}>
            <Text style={StyleSheet.styles.cell.title}>{source.name}</Text>
            <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('words.count', {count: wordCount, localizedCount: Localizable.toNumber(wordCount, {precision: 0})})}</Text>
          </View>
          <View style={styles.sourcesRightContainer}>
            <Text style={StyleSheet.styles.cell.subtitle}>0 BC</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _getRowsAndSections = (sources: any) => {
    const rows = {};
    const sections = [];

    sources.forEach((source) => {
      const section = source.firstInitial;
      if (sections.indexOf(section) === -1) {
        sections.push(section);
        rows[section] = [];
      }
      rows[section].push(source);
    });

    const numericSection = sections[0];
    sections.shift();
    sections.push(numericSection);

    return {rows, sections};
  };
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginLeft: 8,
  },
  sourcesCellContainer: {
    flex: 1,
    marginRight: 15,
    paddingVertical: 6,
    flexDirection: 'row',
  },
  sourcesAvatar: {
    justifyContent: 'center',
    paddingRight: 5,
  },
  sourcesLeftContainer: {
    flex: 2,
    flexDirection: 'column',
  },
  sourcesRightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 8,
    paddingTop: 4,
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
  sectionHeaderContainer: {
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
    backgroundColor: '#FAFAFA',
    marginRight: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c7cc',
  },
  sectionHeaderTitle: {
    color: '#59626a',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 8,
    marginRight: 15,
  },
  listIndexContainer: {
    top: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 3,
  },
  listIndexTitle: {
    color: '#CF1E00',
    fontSize: 11,
    fontWeight: '500',
  },
  ...Platform.select({
      ios: {
        segmentedControl: {
          marginTop: 8,
          marginHorizontal: 8,
          marginBottom: 10,
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
