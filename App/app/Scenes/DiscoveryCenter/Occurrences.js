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
  occurrences: any
};

export default class DiscoveryCenterOccurrences extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      dataSource: dataSource,
      occurrences: null,
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
    const { occurrences } = this.state;

    const number = parseInt(rowID) + 1;
    const book = occurrence.book;
    const url = readerURL({bookID: book.id, anchor: `source-${occurrence.name}-${occurrence.occurrence}`, title: book.name, description: `${book.name} ${occurrence.name} ${occurrence.occurrence}`, occurrences});

    return (
      <TouchableOpacity key={occurrence.id} style={styles.listItemContainer} onPress={() => this.props.navigate(url)}>
        <Text style={StyleSheet.styles.cell.occurrence}>{number}</Text>
        <View style={styles.listItem}>
          <Text style={styles.body}>{occurrence.text}</Text>
          <Text style={StyleSheet.styles.cell.subtitle}>{occurrence.reference}</Text>
          <Text style={[StyleSheet.styles.cell.subtitle, {color: 'red'}]}>Jesus 18</Text>
        </View>
      </TouchableOpacity>
    );
  };

  async _getOccurrences() {
    const { card } = this.props;
    const query = new Query(card);
    let occurrences = await query.occurrences();
    const contents = {};

    for (let occurrence of occurrences) {
      const content = await Emdros.scripture({monadSet: occurrence.monadSet, stylesheet: 'occurrence'});
      contents[occurrence.id] = content;
    }

    occurrences = occurrences.map(occurrence => ({...occurrence, reference: occurrence.reference, text: contents[occurrence.id]}));

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(occurrences)
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
