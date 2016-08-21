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
  TextInput,
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

import { Preference } from '../../Preferences';

import { BarChart, PieChart } from '../../Components/Charts';
import Icon from '../../Components/Common/Icon';
import SourceIcon from '../../Components/Common/SourceIcon';

// $FlowFixMe: - Flow can't find os module extension
import SegmentedControl from '../../Components/Common/SegmentedControl';

import { readerURL } from '../../Navigation';

import { Actant, Sphere } from '../../Database';

const SEGMENTS = [Localizable.t('alphabetical'), Localizable.t('percentage')];
const SEGMENT_INDEXES = {
  ALPHABETICAL: 0,
  PRINCIPALITY: 1
};

const SORT_PREFERENCE = Preference.Keys.Spheres.SourcesSort;

type Props = {
  navigate: Function,
  sphereID: string,
};

type State = {
  dataSource: any,
  selectedSegmentIndex: number,
  sphere: Object,
};

type PieProps = {
  source: Object,
  subtitleStyle?: any,
  size: number,
  sliceWidth?: number,
  style?: any,
  titleStyle?: any
};

export default class SphereSources extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const sphere = Sphere.findByID(props.sphereID);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});

    let selectedSegmentIndex = Preference.numberForKey(SORT_PREFERENCE);
    if (selectedSegmentIndex == null) selectedSegmentIndex = SEGMENT_INDEXES.PRINCIPALITY;

    this.state = {
      dataSource: dataSource,
      sphere,
      selectedSegmentIndex
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this._getDataSource(this.state.selectedSegmentIndex)
    });
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderHeader={this._renderHeader}
        renderRow={this._renderRow}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={[StyleSheet.styles.separator, {marginLeft: 8}]} />}
      />
    );
  }

  _renderHeader = () => {
    const { sphere } = this.state;
    const colors = Colors.spheres[sphere.id];
    const sources = this._sourceSortedByPercentage().slice(0, 10);

    return (
      <View>
        <ScrollView style={styles.sphereSourcesGraph}>
          {this._renderPie({source: sources[0], size: 130, sliceWidth: 6, subtitleStyle: {fontSize: 17}, titleStyle: {fontSize: 24}, style: {top: 50, alignSelf: 'center'}})}
          {this._renderPie({source: sources[1], size: 80, subtitleStyle: {fontSize: 15}, titleStyle: {fontSize: 20}, style: [styles.pie, {top: 95, left: 40}]})}
          {this._renderPie({source: sources[2], size: 80, subtitleStyle: {fontSize: 15}, titleStyle: {fontSize: 20}, style: [styles.pie, {top: 20, left: -5}]})}
          {this._renderPie({source: sources[3], size: 80, subtitleStyle: {fontSize: 15}, titleStyle: {fontSize: 20}, style: [styles.pie, {top: 30, right: 40}]})}
          {this._renderPie({source: sources[4], size: 60, subtitleStyle: {fontSize: 12}, titleStyle: {fontSize: 16}, style: [styles.pie, {top: 130, right: 65}]})}
          {this._renderPie({source: sources[5], size: 60, subtitleStyle: {fontSize: 12}, titleStyle: {fontSize: 16}, style: [styles.pie, {top: 15, left: 80}]})}
          {this._renderPie({source: sources[6], size: 60, subtitleStyle: {fontSize: 12}, titleStyle: {fontSize: 16}, style: [styles.pie, {top: 105, right: 0}]})}
          {this._renderPie({source: sources[7], size: 50, subtitleStyle: {fontSize: 10}, titleStyle: {fontSize: 13}, style: [styles.pie, {top: 5, left: 210}]})}
          {this._renderPie({source: sources[8], size: 50, subtitleStyle: {fontSize: 10}, titleStyle: {fontSize: 13}, style: [styles.pie, {top: 15, right: -10}]})}
          {this._renderPie({source: sources[9], size: 50, subtitleStyle: {fontSize: 10}, titleStyle: {fontSize: 13}, style: [styles.pie, {top: 145, left: -5}]})}
        </ScrollView>
        <View style={styles.textInputContainer}>
          <TextInput
            autoCapitalize="words"
            autoCorrect={false}
            autoFocus={false}
            clearButtonMode="always"
            onChangeText={(text) => this.setState({search: text})}
            placeholder={Localizable.t('name')}
            style={styles.textInput}
            value={this.state.search || ''}
          />
        </View>
      </View>
    );
  };

  _renderRow = (source: Object) => {
    const { sphere } = this.state;
    const wordCount = this._getCountOfSource(source);
    const spherePercent = this._getPercentOfSource(source);
    const colors = Colors.spheres[sphere.id];

    return (
      <TouchableOpacity style={styles.section} onPress={() => this._onPressSource(source)}>
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
              <Text style={[StyleSheet.styles.cell.percentage, {color: colors.chromeTint}]}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text>
              <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('words.count', {count: wordCount, localizedCount: Localizable.toNumber(wordCount, {precision: 0})})}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderPie({source, size, sliceWidth, style, subtitleStyle, titleStyle}: PieProps) {
    const { sphere } = this.state;
    const colors = Colors.spheres[sphere.id];

    const sourcePercent = this._getPercentOfSource(source);
    const slices = [{color: colors.tint, value: sourcePercent}, {color: colors.lightTint, value: 100-sourcePercent}];
    return (
      <PieChart
        color={colors.tint}
        slices={slices}
        sliceWidth={sliceWidth}
        subtitle={source.name}
        subtitleStyle={subtitleStyle}
        title={Localizable.toPercentage(sourcePercent, {precision: 0})}
        titleStyle={[titleStyle, {color: colors.chromeTint}]}
        size={size}
        style={style}
      />
    )
  };

  _getCountOfSource(source: Object) {
    return this.state.sphere.countOfSource(source.id);
  };

  _getPercentOfSource(source: Object) {
    return (this._getCountOfSource(source) / source.wordCount) * 100;
  };

  _getDataSource = (segmentIndex: number) => {
    const { sphere } = this.state;

    switch (segmentIndex) {
      case SEGMENT_INDEXES.ALPHABETICAL:
        return this.state.dataSource.cloneWithRowsAndSections({alphabetical: Actant.sources().sorted('name')});

      default:
        return this.state.dataSource.cloneWithRowsAndSections({percentage: this._sourceSortedByPercentage()});
    }
  };

  _sourceSortedByPercentage = () => {
    const { sphere } = this.state;
    return sphere.sourceCounts.map(count => Actant.findByID(parseInt(count.string)));
  }

  _onSegmentedControlValueChanged = (value: number) => {
    Preference.setNumberForKey(value, SORT_PREFERENCE);

    this.setState({
      selectedSegmentIndex: value,
      dataSource: this._getDataSource(value)
    });
  };

  _onPressSource = (source: Object) => {
    const book = source.books[0];
    Preference.setObjectForKey([this.state.sphere.id], Preference.Keys.Reader.spheres);
    this.props.navigate(readerURL({bookID: book.id, anchor: 'chapter-1', title: book.name}));
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    fontSize: 14,
    backgroundColor: '#ececec',
    borderColor: '#ececec',
    borderRadius: 3,
    borderWidth: 1,
    paddingLeft: 8,
    marginHorizontal: 8,
    marginVertical: 8,
    height: 26,
  },
  sphereSourcesGraph: {
    height: 200,
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
