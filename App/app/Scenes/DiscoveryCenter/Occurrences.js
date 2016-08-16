/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  AsyncStorage,
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

import { NavigationBar, Toolbar, ToolbarButton } from '../../Components/Navigation';

import { BACK, discoveryCenterURL, readerURL } from '../../Navigation';

import Emdros from '../../API/Emdros';
import { BookSourceOccurrence } from '../../Database';
import Query from './Query';

type Props = {
  card: Object,
  navigate: Function,
};

type State = {
  dataSource: any,
  contents: any
};

export default class DiscoveryCenterOccurrences extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      dataSource: dataSource,
      contents: {}
    };
  }

  componentDidMount() {
    this._getOccurrences();
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar title={Localizable.t('occurrences')}>
          <TouchableOpacity
            onPress={() => this.props.navigate(BACK)}
            style={{position: 'absolute', left: 16}}
          >
            <Text style={StyleSheet.styles.navigationBar.doneButtonTitle}>{Localizable.t('back')}</Text>
          </TouchableOpacity>
        </NavigationBar>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          style={styles.content}
        />
      </View>
    );
  }

  _renderRow = (occurrence: Object, sectionID: any, rowID: any) => {
    const number = parseInt(rowID) + 1;
    const book = occurrence.book;
    const { contents } = this.state;
    const content = contents[occurrence.id];
    const url = readerURL({bookID: book.id, anchor: `source-${occurrence.name}-${occurrence.occurrence}`, title: book.name});

    return (
      <TouchableOpacity key={occurrence.id} style={styles.listItemContainer} onPress={() => this.props.navigate(url)}>
        <Text style={StyleSheet.styles.cell.occurrence}>{number}</Text>
        <View style={styles.listItem}>
          <Text style={styles.body}>{content}</Text>
          <Text style={StyleSheet.styles.cell.subtitle}>{occurrence.reference}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  async _getOccurrences() {
    const { card } = this.props;
    const query = new Query(card);
    const occurrences = await query.occurrences();
    const contents = {};

    for (let occurrence of occurrences) {
      const content = await Emdros.scripture({monadSet: occurrence.monadSet, stylesheet: 'occurrence'});
      contents[occurrence.id] = content;
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(occurrences),
      contents
    });
  };
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: NavigationBar.HEIGHT,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 8,
  },
  listItemContainer: {
    paddingLeft: 8,
    paddingRight: 15,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  listItem: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 3,
  },
  body: {
    paddingBottom: 5,
  },
});
