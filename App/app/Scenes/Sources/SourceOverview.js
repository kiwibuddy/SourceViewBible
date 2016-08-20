/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Image,
  LayoutAnimation,
  ListView,
  RecyclerViewBackedScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

import { BarChart, SourcesBarChart, SpheresBarChart, WordCloud } from '../../Components/Charts';
import ParallaxMotionView from '../../Components/Common/ParallaxMotionView';
import Icon from '../../Components/Common/Icon';
import SourceIcon from '../../Components/Common/SourceIcon';

import FilterBar from './FilterBar';

import { sourceURL, sourceBooksURL, sourceConversationsURL, sourceSpheresURL, sourceWordsURL } from '../../Navigation';

import { Actant, Book } from '../../Database';
import Query from './Query';

const Section = {
  SPOKE_TO: 'SPOKE_TO',
  LISTENED_TO: 'LISTENED_TO'
};

const LISTVIEW_REF = "LISTVIEW_REF";

type Props = {
  bookID: ?string,
  sourceID: number,
  navigate: Function,
};

type State = {
  dataSource: any,
  source: Object,
  book: ?Object,
  sourceRelation: ?Object,
  spokeToCount: number,
  spokeToOccurrenceCount: number,
  listenedToCount: number,
  listenedToOccurrenceCount: number,
};

export default class SourceOverview extends Component {
  props: Props;
  state: State;
  shouldFetch: boolean = true;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    const source = Actant.findByID(props.sourceID);
    const book = (props.bookID ? Book.findByID(props.bookID) : null);
    const sourceRelation = source.relationForBook(book);

    this.state = {
      dataSource,
      source,
      book,
      sourceRelation,
      spokeToCount: 0,
      spokeToOccurrenceCount: 0,
      listenedToCount: 0,
      listenedToOccurrenceCount: 0,
    };
  }

  componentDidMount() {
    this._setSource(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this._setSource(nextProps);
  }

  componentWillUnmount() {
    this.shouldFetch = false;
  }

  render() {
    const { book } = this.state;

    return (
      <View style={styles.container}>
        <FilterBar book={book} onPress={() => this._onPressClearFilter()} />
        <ListView
          ref={LISTVIEW_REF}
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          renderHeader={this._renderHeader}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSectionHeader={this._renderSectionHeader}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>
    );
  }

  _renderHeader = () => {
    const { source, book, sourceRelation } = this.state;

    const statistics = this._renderStatistics();
    const metaData = this._renderMetaData();

    const words = source.words.map(word => word.string);
    const principalSourceType = (sourceRelation ? sourceRelation.principalSourceType : source.principalSourceType);

    return (
      <View>
        <TouchableOpacity onPress={() => this.props.navigate(sourceWordsURL({sourceID: source.id, title: Localizable.t('source-words', {name: source.name})}))}>
          <WordCloud
            backgroundColors={this.principalColor.gradient.big}
            style={styles.wordCloud}
          >
            <ParallaxMotionView intensity={5} style={[styles.parallax, {opacity: 0.8}]}>
              <Text style={[styles.wc1, {top: 50, alignSelf: 'center'}]}>{words[0]}</Text>
            </ParallaxMotionView>
            <ParallaxMotionView intensity={10} style={[styles.parallax, {opacity: 0.8}]}>
              <Text style={[styles.wc2, {top: 125, right: 15}]}>{words[1]}</Text>
              <Text style={[styles.wc2, {top: 150, left: 15}]}>{words[2]}</Text>
              <Text style={[styles.wc2, {top: -15, left: -10}]}>{words[3]}</Text>
              <Text style={[styles.wc2, {top: -20, right: 40}]}>{words[4]}</Text>
            </ParallaxMotionView>
            <ParallaxMotionView intensity={20} style={[styles.parallax, {opacity: 0.6}]}>
              <Text style={[styles.wc3, {top: 90, right: 10}]}>{words[5]}</Text>
              <Text style={[styles.wc3, {top: 55, left: 10}]}>{words[6]}</Text>
              <Text style={[styles.wc3, {top: 30, right: -10}]}>{words[7]}</Text>
              <Text style={[styles.wc3, {top: 125, left: 30}]}>{words[8]}</Text>
            </ParallaxMotionView>
            <ParallaxMotionView intensity={30} style={[styles.parallax, {opacity: 0.3}]}>
              <Text style={[styles.wc4, {top: 20, right: 150}]}>{words[9]}</Text>
              <Text style={[styles.wc4, {top: 150, right: 170}]}>{words[10]}</Text>
              <Text style={[styles.wc4, {top: 35, left: 80}]}>{words[11]}</Text>
              <Text style={[styles.wc4, {top: 100, left: -10}]}>{words[12]}</Text>
              <Text style={[styles.wc4, {top: -10, left: 130}]}>{words[13]}</Text>
              <Text style={[styles.wc4, {top: 65, right: 60}]}>{words[14]}</Text>
            </ParallaxMotionView>

            <View style={styles.sourceBackgroundContainer}>
              <Image style={styles.sourceBackground} source={require('../../Images/sources/avatar-background.png')} />
            </View>
            <View style={styles.sourceIconContainer}>
              <SourceIcon
                principalSourceType={principalSourceType}
                source={source}
                size={100}
                style={[styles.sourceIcon]}
              />
            </View>
          </WordCloud>
        </TouchableOpacity>

        {statistics}
        {metaData}
      </View>
    );
  };

  _renderSectionHeader = (section: Object, sectionID: any) => {
    const { source, spokeToCount, spokeToOccurrenceCount, listenedToCount, listenedToOccurrenceCount } = this.state;

    let title = null;
    let sourceCount = 0;
    let occurrenceCount = 0;

    if (sectionID === Section.SPOKE_TO) {
      title = Localizable.t('source-spoke-to', {name: source.name});
      sourceCount = spokeToCount;
      occurrenceCount = spokeToOccurrenceCount;
    } else {
      title = Localizable.t('spoke-to-source', {name: source.name});
      sourceCount = listenedToCount;
      occurrenceCount = listenedToOccurrenceCount;
    }

    return (
      <View style={[styles.listItemHeader, {borderTopColor: this.principalColor.tint}]}>
        <Text style={StyleSheet.styles.cell.titlebold}>{title}</Text>
        <View style={styles.sourcesCellContainer}>
          <View style={styles.sourcesLeftContainer}>
            <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('sources.count', {count: sourceCount, localizedCount: Localizable.toNumber(sourceCount, {precision: 0})})}</Text>
          </View>
          <View style={styles.sourcesRightContainer}>
            <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('occurrences.count', {count: occurrenceCount, localizedCount: Localizable.toNumber(occurrenceCount, {precision: 0})})}</Text>
          </View>
        </View>
      </View>
    );
  };

  _renderRow = (row: Object, sectionID: any, rowID: any) => {
    const { spokeToOccurrenceCount, listenedToOccurrenceCount } = this.state;
    const actant = row.actant;
    const sourceRelation = actant.relationForBook(this.state.book);

    const occurrenceCount = row.count;
    const totalOccurrenceCount = (sectionID === Section.SPOKE_TO ? spokeToOccurrenceCount : listenedToOccurrenceCount);
    const occurrencePercent = (occurrenceCount / totalOccurrenceCount) * 100;

    const principalSourceType = (sourceRelation ? sourceRelation.principalSourceType : actant.principalSourceType);
    const principalColor = Colors.sources[principalSourceType];

    return (
      <TouchableOpacity style={styles.section} onPress={() => this._onPressActant(actant)}>
        <View style={[styles.sourcesCellContainer, {paddingVertical: 10}]}>
          <View style={styles.sourcesLeftContainer}>
            <TouchableOpacity onPress={() => this._onPressActantIcon(actant)}>
              <SourceIcon
                principalSourceType={principalSourceType}
                source={actant}
                style={[styles.sourceAvatar]}
                size={20}
              />
            </TouchableOpacity>
            <View style={styles.sourcesContent}>
              <Text style={StyleSheet.styles.cell.titlemedium}>{actant.name}</Text>
            </View>
          </View>
          <View style={styles.sourcesRightContainer}>
            <BarChart
              bars={[{color: principalColor.tint, value: occurrencePercent}]}
              deltaStyle={{backgroundColor: principalColor.lightTint}}
              maxChartValue={100}
              style={styles.sourcesBarChart}
            />
            <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('occurrences.count', {count: occurrenceCount, localizedCount: Localizable.toNumber(occurrenceCount, {precision: 0})})}</Text>
          </View>
        </View>
        <View style={[StyleSheet.styles.separator, {marginLeft: 0}]}></View>
      </TouchableOpacity>
    );
  };

  _renderMetaData = () => {
    const { source, sourceRelation } = this.state;
    const metaData = [];

    const roleDescription = (sourceRelation ? sourceRelation.roleDescription : source.roleDescription);
    if (roleDescription) {
      metaData.push(this._renderMetaValue(Localizable.t('roles.text'), 'metadata-role', roleDescription));
    }

    if (source.natureDescription) {
      metaData.push(this._renderMetaValue(Localizable.t('nature'), 'metadata-nature', source.natureDescription));
    }

    if (source.genderDescription) {
      metaData.push(this._renderMetaValue(Localizable.t('gender'), 'metadata-gender', source.genderDescription));
    }

    if (source.chronologyDescription) {
      metaData.push(this._renderMetaValue(Localizable.t('time-period'), 'metadata-timeperiod', source.chronologyDescription));
    }

    if (source.professionDescription) {
      const profession = <View key="profession">
        <View style={styles.listItemContainer}>
          <Icon
            name="metadata-profession"
            size={20}
            style={[styles.listItemIcon, {color: '#59626A', alignSelf: 'auto', paddingTop: 5}]}
          />
          <View style={styles.listItemAlt}>
            <Text style={StyleSheet.styles.cell.titlemedium}>{Localizable.t('profession')}</Text>
            <Text style={StyleSheet.styles.cell.valuetitlemedium}>{source.professionDescription}</Text>
          </View>
        </View>
      </View>
      metaData.push(profession);
    }

    return (
      <View style={styles.listContainer}>{metaData}</View>
    );
  }

  _renderMetaValue = (title: string, icon: string, value: string) => {
    return (
      <View key={title}>
        <View style={styles.listItemContainer}>
          <Icon
            name={icon}
            size={20}
            style={[styles.listItemIcon, {color: '#59626A'}]}
          />
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.titlemedium}>{title}</Text>
            <Text style={StyleSheet.styles.cell.valuetitlemedium}>{value}</Text>
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    );
  };

  _renderStatistics = () => {
    const { source, book, sourceRelation } = this.state;

    const object = (sourceRelation ? sourceRelation : source);
    const bookCount = source.bookCount;
    const wordCount = object.wordCount;
    const spherePercent = (object.sphereWordCount / wordCount) * 100;

    return (
      <View style={[StyleSheet.styles.statisticsContainer, {marginTop: 25}]}>
        <TouchableOpacity style={[StyleSheet.styles.statisticContainer, {marginHorizontal: -20}]} onPress={() => this.props.navigate(sourceBooksURL({sourceID: source.id, title: Localizable.t('source-books', {name: source.name})}))}>
          <Text style={StyleSheet.styles.statisticTitle}>{Localizable.toNumber(bookCount, {precision: 0})}</Text>
          <Text style={StyleSheet.styles.statisticSubtitle}>Books</Text>
        </TouchableOpacity>
        <View style={StyleSheet.styles.statisticKeyline} />
        <TouchableOpacity style={StyleSheet.styles.statisticContainer} onPress={() => this.props.navigate(sourceWordsURL({sourceID: source.id, bookID: book && book.id, title: Localizable.t('source-words', {name: source.name})}))}>
          <Text style={StyleSheet.styles.statisticTitle}>{Localizable.toNumber(wordCount, {precision: 0})}</Text>
          <Text style={StyleSheet.styles.statisticSubtitle}>{Localizable.t('words.text')}</Text>
        </TouchableOpacity>
        <View style={StyleSheet.styles.statisticKeyline} />
        <TouchableOpacity style={StyleSheet.styles.statisticContainer} onPress={() => this.props.navigate(sourceSpheresURL({sourceID: source.id, bookID: book && book.id, title: Localizable.t('source-spheres', {name: source.name})}))}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={StyleSheet.styles.statisticTitle}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text>
          <SpheresBarChart
            style={{flex: 0, marginHorizontal: 4}}
            barStyle={{width: 3, height: 20, marginHorizontal: 1.5}}
            horizontal={false}
            data={[{family: object.countOfSphereType(SphereType.FAMILY)}, {economics: object.countOfSphereType(SphereType.ECONOMICS)}, {government: object.countOfSphereType(SphereType.GOVERNMENT)}, {religion: object.countOfSphereType(SphereType.RELIGION)}, {education: object.countOfSphereType(SphereType.EDUCATION)}, {communication: object.countOfSphereType(SphereType.COMMUNICATION)}, {celebration: object.countOfSphereType(SphereType.CELEBRATION)}]}
          />
        </View>
        <Text style={StyleSheet.styles.statisticSubtitle}>Spheres</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _onPressClearFilter = () => {
    const { source } = this.state;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this._setSource({sourceID: source.id, book: null, sourceRelation: null});
  };

  _onPressActant(actant: Actant) {
    // ReaderURL with occurrences
  };

  _onPressActantIcon(actant: Actant) {
    const { book } = this.state;
    this.props.navigate(sourceURL({sourceID: actant.id, bookID: book && book.id, title: actant.name}));
  };

  async _setSource(props: Object) {
    if (!this.shouldFetch) return;

    const sourceChanged = this.state.source.id != props.sourceID;

    const source = Actant.findByID(props.sourceID);
    const book = (props.bookID ? Book.findByID(props.bookID) : null);
    const sourceRelation = source.relationForBook(book);

    const query = new Query(source, book);

    const rows = {};
    const sections = [];

    const spokeTo = await query.spokeTo();
    const spokeToCount = spokeTo.length;
    const spokeToOccurrenceCount = spokeTo.reduce((sum, occurrence) => sum + occurrence.count, 0);
    if (spokeToCount > 0) {
      sections.push(Section.SPOKE_TO);
      rows[Section.SPOKE_TO] = spokeTo;
    }

    const listenedTo = await query.listenedTo();
    const listenedToCount = listenedTo.length;
    const listenedToOccurrenceCount = listenedTo.reduce((sum, occurrence) => sum + occurrence.count, 0);
    if (listenedToCount > 0) {
      sections.push(Section.LISTENED_TO);
      rows[Section.LISTENED_TO] = listenedTo;
    }

    const dataSource = this.state.dataSource.cloneWithRowsAndSections(rows, sections);

    if (this.shouldFetch) {
      this.setState({
        source,
        book,
        sourceRelation,
        dataSource,
        spokeToCount,
        spokeToOccurrenceCount,
        listenedToCount,
        listenedToOccurrenceCount
      }, () => {
        if (sourceChanged) this.refs[LISTVIEW_REF].scrollTo({y: 0, animated: false});
      });
    }
  };

  get principalColor(): Object {
    const { source, sourceRelation } = this.state;
    const principalSourceType = (sourceRelation ? sourceRelation.principalSourceType : source.principalSourceType);
    return Colors.sources[principalSourceType];
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sourceBackgroundContainer: {
    alignSelf: 'center',
    marginTop: 100,
  },
  sourceIconContainer: {
    alignSelf: 'center',
    marginTop: -114,
    backgroundColor: 'transparent',
  },
  listItemContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 5,
    flexDirection: 'row',
  },
  listItemHeader: {
    borderTopWidth: 2,
    borderTopColor: 'red',
    paddingLeft: 15,
    paddingVertical: 8,
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
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  listItemAlt: {
    flex: 1,
    paddingVertical: 6,
  },
  listItemIcon: {
    alignSelf: 'center',
    paddingRight: 10,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
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
  sourcesBarChart: {
    height: 4,
    flex: 0,
    marginBottom: 7,
  },
  wordCloud: {
    height: 200
  },
  parallax: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  wc1: {
    color: 'white',
    backgroundColor:'transparent',
    fontSize: 66,
    fontWeight: '200',
  },
  wc2: {
    color: 'white',
    backgroundColor:'transparent',
    fontSize: 42,
    fontWeight: '200',
    position: 'absolute',
  },
  wc3: {
    color: 'white',
    backgroundColor:'transparent',
    fontSize: 30,
    fontWeight: '200',
    position: 'absolute',
  },
  wc4: {
    color: 'white',
    backgroundColor:'transparent',
    fontSize: 18,
    fontWeight: '200',
    position: 'absolute',
  },
});
