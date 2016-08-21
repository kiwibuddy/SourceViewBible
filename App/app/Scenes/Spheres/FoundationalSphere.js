/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  LayoutAnimation,
  Platform,
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

import { PieChart, SourcesBarChart, SpheresBarChart } from '../../Components/Charts';

// $FlowFixMe: - Flow can't find os module extension
import SegmentedControl from '../../Components/Common/SegmentedControl';

import { readerURL, sphereURL, spherePassagesURL } from '../../Navigation';

import { Preference } from '../../Preferences';

import { Sphere } from '../../Database';

const SEGMENTS = [Localizable.t('whole-bible'), Localizable.t('old-testament'), Localizable.t('new-testament')];
const SEGMENT_INDEXES = {
  WHOLE_BIBLE: 0,
  OLD_TESTAMENT: 1,
  NEW_TESTAMENT: 2
};

const SORT_PREFERENCE = Preference.Keys.Spheres.FoundationalSort;

type Props = {
  navigate: Function,
  renderHeader: Function,
};

type State = {
  dataSource: any,
  selectedSegmentIndex: number,
  sphere: Object,
  wordCount: number,
};

export default class FoundationalSphere extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const sphere = Sphere.findByID('foundational');
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});

    let selectedSegmentIndex = Preference.numberForKey(SORT_PREFERENCE);
    if (selectedSegmentIndex == null) selectedSegmentIndex = SEGMENT_INDEXES.WHOLE_BIBLE;

    this.state = {
      dataSource: dataSource,
      selectedSegmentIndex,
      sphere,
      wordCount: 0,
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this._getDataSource(this.state.selectedSegmentIndex),
      wordCount: this._getWordCount(this.state.selectedSegmentIndex)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderHeader={this._renderHeader}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>
    );
  }

  _renderHeader = (props: any) => {
    const { sphere } = this.state;

    const header = this.props.renderHeader();
    const colors = Colors.spheres[sphere.id];

    return (
      <View>
        {header}
        <View style={StyleSheet.styles.statisticsContainer} />
        <TouchableOpacity style={[styles.readButton, {backgroundColor: colors.chromeTint, borderColor: colors.chromeTint}]} onPress={() => this.props.navigate(spherePassagesURL({sphereID: sphere.id, title: Localizable.t('sphere-passages', {name: sphere.name})}))}>
          <Text style={styles.readButtonTitle}>Explore 52 key passages</Text>
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Text style={[styles.contentBody, {marginBottom: -25, marginTop: -10}]}>Introduction</Text>
          <Text style={[styles.contentBody, {marginTop: 5}]}>{sphere.description}</Text>
        </View>
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

  _renderRow = (sphere: Object) => {
    const wordCount = sphere.countOfBible(this._getTestament(this.state.selectedSegmentIndex));
    const spherePercent = (wordCount / this.state.wordCount) * 100;
    const colors = Colors.spheres[sphere.id];

    return (
      <TouchableOpacity style={styles.listItemContainer} onPress={() => this._onPressSphere(sphere)}>
        <PieChart
          color={colors.chromeTint}
          onPress={() => this._onPressSphereIcon(sphere)}
          slices={[{color: colors.tint, value: spherePercent}, {color: colors.lightTint, value: 100 - spherePercent}]}
          title={Localizable.toPercentage(spherePercent, {precision: 0})}
          size={57}
          style={styles.pie}
        />
        <View style={styles.listItem}>
          <Text style={StyleSheet.styles.cell.title}>{sphere.name}</Text>
          <Text style={StyleSheet.styles.cell.valuetitle}>{Localizable.t('words.count', {count: wordCount, localizedCount: Localizable.toNumber(wordCount, {precision: 0})})}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  _onPressSphere = (sphere: Object) => {
    Preference.setObjectForKey([sphere.id], Preference.Keys.Reader.spheres);
    // this.props.navigate(readerURL({bookID: book.id, anchor: 'chapter-1', title: book.name}));
  };

  _onPressSphereIcon = (sphere: Object) => {
    this.props.navigate(sphereURL({sphereID: sphere.id, title: Localizable.t('spheres.text'), description: Localizable.t('sphere-overview', {name: sphere.name})}));
  };

  _onSegmentedControlValueChanged = (value: number) => {
    Preference.setNumberForKey(value, SORT_PREFERENCE);

    this.setState({
      selectedSegmentIndex: value,
      dataSource: this._getDataSource(value),
      wordCount: this._getWordCount(value)
    });
  };

  _getDataSource = (segmentIndex: number) => {
    const spheres = Sphere.all();

    switch (segmentIndex) {
      case SEGMENT_INDEXES.OLD_TESTAMENT:
        return this.state.dataSource.cloneWithRowsAndSections({wholeBible: spheres});

      case SEGMENT_INDEXES.NEW_TESTAMENT:
        return this.state.dataSource.cloneWithRowsAndSections({oldTestament: spheres});

      default:
        return this.state.dataSource.cloneWithRowsAndSections({newTestament: spheres});
    }
  };

  _getWordCount = (segmentIndex: number) => {
    switch (segmentIndex) {
      case SEGMENT_INDEXES.OLD_TESTAMENT:
        return Sphere.countOfBible(0);

      case SEGMENT_INDEXES.NEW_TESTAMENT:
        return Sphere.countOfBible(1);

      default:
        return Sphere.countOfBible();
    }
  };

  _getTestament = (segmentIndex: number) => {
    switch (segmentIndex) {
      case SEGMENT_INDEXES.OLD_TESTAMENT:
        return 0;

      case SEGMENT_INDEXES.NEW_TESTAMENT:
        return 1;

      default:
        return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingLeft: 8,
    paddingRight: 15,
    paddingVertical: 5,
    flexDirection: 'row',
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
    marginLeft: 8,
  },
  pie: {
    margin: 8,
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
