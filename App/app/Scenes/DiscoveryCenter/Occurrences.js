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
import { BookSourceOccurrence, Role } from '../../Database';
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
            onPress={() => this.props.navigate(discoveryCenterURL({title: Localizable.t('discovery-center'), modal: true}), {replace: true})}
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
    const occurrenceIndex = parseInt(rowID);
    const number = occurrenceIndex + 1;
    const book = occurrence.book;
    const role = occurrence.role;

    const bcvReference = Localizable.t('bcv-reference', {book: occurrence.book.name, reference: occurrence.reference});
    const bsoReference = Localizable.t('bso-reference', {book: occurrence.name, source: occurrence.name, number: occurrence.number});

    const route = readerURL({bookID: book.id, anchor: `source-${occurrence.name}-${occurrence.number}`, title: book.name, description: bsoReference, occurrenceIndex, occurrences});

    return (
      <TouchableOpacity key={occurrence.id} style={styles.listItemContainer} onPress={() => this._navigate(route)}>
        <Text style={StyleSheet.styles.cell.occurrence}>{number}</Text>
        <View style={styles.listItem}>
          <Text style={styles.body}>{occurrence.text}</Text>
          <Text style={StyleSheet.styles.cell.subtitle}>{bcvReference}</Text>
          <Text style={[StyleSheet.styles.cell.subtitle, {color: Colors.sources[role.key].tint}]}>{Localizable.t('so-reference', {source: occurrence.name, number: occurrence.number})}</Text>
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

    occurrences = occurrences.map(occurrence => ({...occurrence, role: occurrence.role, reference: occurrence.reference, text: contents[occurrence.id]}));

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(occurrences),
      occurrences
    });
  };

  _navigate = (route: Object) => {
    this.props.navigate(route, {replace: true});
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
