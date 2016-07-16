/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ListView,
  Platform,
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

// $FlowFixMe: - Flow can't find os module extension
import SegmentedControl from '../../Components/Common/SegmentedControl';
import { SourcesBarChart, SpheresBarChart } from '../../Components/Charts';
import { ReadingTime } from '../../Common/NumberHelper';
import Icon from '../../Components/Common/Icon';

const LISTVIEW_REF = 'LISTVIEW_REF';

type Props = {
  bible: Object,
  onPressSource: Function,
};

type State = {
  dataSource: any,
};

export default class Sources extends Component {
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.key !== r2.key, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    const sources = props.bible.sources.slice(0).sort((a, b) => a.name > b.name ? 1 : -1);

    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections({sources: sources})
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          ref="LISTVIEW_REF"
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>
    );
  }

  _renderRow = (source: Object, sectionID: any, rowID: any) => {
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
      <TouchableOpacity style={styles.section} onPress={() => this.props.onPressSource(source)}>
        <View style={[styles.sourcesCellContainer, {paddingVertical: 12}]}>
          <View style={styles.sourcesLeftContainer}>
              <Icon
                name={iconName}
                style={[styles.sourceAvatar, {color: color}]}
                size={20}
              />
            <Text style={StyleSheet.styles.cell.title}>{source.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
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
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 8,
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
