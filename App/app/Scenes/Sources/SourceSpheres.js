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

import { PieChart, SourcesBarChart, SpheresBarChart } from '../../Components/Charts';

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
  dataSource: any
};

export default class SourceSpheres extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const source = Actant.findByID(props.sourceID);
    const book = props.bookID ? Book.findByID(props.bookID) : null;

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    const spheres = Sphere.all().map(sphere => {
      return ({...sphere, sourceWordCount: source.countOfSphereType(sphere.id)});
    });

    this.state = {
      source,
      book,
      dataSource: dataSource.cloneWithRows(spheres)
    };
  }

  render() {
    const { source } = this.state;
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
    const { source } = this.state;
    const spherePercent = (source.sphereWordCount / source.wordCount) * 100;

    return (
      <View style={StyleSheet.styles.statisticsContainer}>
        <View style={StyleSheet.styles.statisticContainer}>
          <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toNumber(0, {precision: 0})}</Text>
          <Text style={StyleSheet.styles.statisticSubtitle}>Book</Text>
        </View>
        <View style={StyleSheet.styles.statisticKeyline} />
        <View style={StyleSheet.styles.statisticContainer}>
          <Text style={StyleSheet.styles.statisticTitleBold}>{Localizable.toNumber(source.wordCount, {precision: 0})}</Text>
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
              data={[{family: source.countOfSphereType(SphereType.FAMILY)}, {economics: source.countOfSphereType(SphereType.ECONOMICS)}, {government: source.countOfSphereType(SphereType.GOVERNMENT)}, {religion: source.countOfSphereType(SphereType.RELIGION)}, {education: source.countOfSphereType(SphereType.EDUCATION)}, {communication: source.countOfSphereType(SphereType.COMMUNICATION)}, {celebration: source.countOfSphereType(SphereType.CELEBRATION)}]}
            />
          </View>
          <Text style={StyleSheet.styles.statisticSubtitle}>Spheres</Text>
        </View>
      </View>
    );
  };

  _renderRow = (sphere: Object) => {
    const { source } = this.state;
    const wordCount = source.countOfSphereType(sphere.id);
    const spherePercent = (wordCount / source.sphereWordCount) * 100;
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
