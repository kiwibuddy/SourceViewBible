/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  LayoutAnimation,
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
import FilterBar from './FilterBar';

import { readerURL, sphereURL } from '../../Navigation';

import { Preference } from '../../Preferences';

import { Actant, Book, Sphere } from '../../Database';

type Props = {
  sourceID: number,
  bookID: ?string,
  navigate: Function,
};

type State = {
  source: Object,
  book: ?Object,
  sourceRelation: ?Object,
  dataSource: any
};

export default class SourceSpheres extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const source = Actant.findByID(props.sourceID);
    const book = (props.bookID ? Book.findByID(props.bookID) : null);
    const sourceRelation = source.relationForBook(book);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});

    this.state = {
      source,
      book,
      sourceRelation,
      dataSource: dataSource
    };
  }

  componentDidMount() {
    this._setSource(this.state.source, this.state.book, this.state.sourceRelation);
  }

  render() {
    const { source, book } = this.state;
    return (
      <View style={styles.container}>
        <FilterBar book={book} onPress={() => this._onPressClearFilter()} />
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
    const { source, sourceRelation } = this.state;
    const object = sourceRelation || source;
    const spherePercent = (object.sphereWordCount / object.wordCount) * 100;

    return (
      <View style={StyleSheet.styles.statisticsContainer}>
        <View style={StyleSheet.styles.statisticContainer}>
          <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toNumber(object.wordCount, {precision: 0})}</Text>
          <Text style={StyleSheet.styles.statisticSubtitle}>Words</Text>
        </View>
        <View style={StyleSheet.styles.statisticKeyline} />
        <View style={StyleSheet.styles.statisticContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text>
            <SpheresBarChart
              style={{flex: 0, marginLeft: 4}}
              barStyle={{width: 4, height: 24, marginHorizontal: 2}}
              horizontal={false}
              data={[{family: object.countOfSphereType(SphereType.FAMILY)}, {economics: object.countOfSphereType(SphereType.ECONOMICS)}, {government: object.countOfSphereType(SphereType.GOVERNMENT)}, {religion: object.countOfSphereType(SphereType.RELIGION)}, {education: object.countOfSphereType(SphereType.EDUCATION)}, {communication: object.countOfSphereType(SphereType.COMMUNICATION)}, {celebration: object.countOfSphereType(SphereType.CELEBRATION)}]}
            />
          </View>
          <Text style={StyleSheet.styles.statisticSubtitle}>Spheres</Text>
        </View>
      </View>
    );
  };

  _renderRow = (sphere: Object) => {
    const { source, sourceRelation } = this.state;
    const object = sourceRelation || source;
    const wordCount = object.countOfSphereType(sphere.id);
    const spherePercent = (wordCount / object.sphereWordCount) * 100;
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
    const { source, book } = this.state;
    if (!book) return;
    Preference.setObjectForKey([sphere.id], Preference.Keys.Reader.spheres);
    this.props.navigate(readerURL({bookID: book.id, anchor: 'chapter-1', title: source.name}));
  };

  _onPressSphereIcon = (sphere: Object) => {
    this.props.navigate(sphereURL({sphereID: sphere.id, title: Localizable.t('spheres.text'), description: Localizable.t('sphere-overview', {name: sphere.name})}));
  };

  _onPressClearFilter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this._setSource(this.state.source, null, null);
  };

  _setSource = (source: Object, book: ?Object, sourceRelation: ?Object) => {
    const object = sourceRelation || source;
    const spheres = Sphere.all();
    this.setState({
      source,
      book,
      sourceRelation,
      dataSource: this.state.dataSource.cloneWithRows(spheres)
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  }
});
