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
  StyleSheet,
  Localizable
} from '../../Common';

import { SourcesBarChart, SpheresBarChart, WordCloud } from '../../Components/Charts';
import ParallaxMotionView from '../../Components/Common/ParallaxMotionView';
import FilterBar from './FilterBar';

import { Actant, Book } from '../../Database';

type Props = {
  sourceID: number,
  bookID: ?string,
  navigate: Function,
};

type State = {
  dataSource: any,
  source: Object,
  book: ?Object,
  sourceRelation: ?Object,
};

export default class SourceWords extends Component {
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
    const { book } = this.state;

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

  _renderRow = (word: Object, sectionID: any, rowID: any) => {
    return (
      <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.title}>{word.string}</Text>
        <Text style={StyleSheet.styles.cell.valuetitle}>{Localizable.toNumber(word.count, {precision: 0})}</Text>
      </TouchableOpacity>
    );
  };

  _renderHeader = (props: any) => {
    const { source, sourceRelation } = this.state;
    const object = sourceRelation || source;
    const words = object.words.map(word => word.string);

    return (
      <WordCloud
        backgroundColors={Colors.sources[object.principalSourceType].gradient.big}
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
      </WordCloud>
    );
  };

  _onPressClearFilter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this._setSource(this.state.source, null, null);
  };

  _setSource = (source: Object, book: ?Object, sourceRelation: ?Object) => {
    const object = sourceRelation || source;
    const words = object.words;
    this.setState({
      source,
      book,
      sourceRelation,
      dataSource: this.state.dataSource.cloneWithRows(words)
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
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
  wordCloudButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  }
});
