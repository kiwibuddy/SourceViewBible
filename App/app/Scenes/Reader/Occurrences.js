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

import { BACK, occurrencesURL, readerURL } from '../../Navigation';

import Emdros from '../../API/Emdros';
import { BookSourceOccurrence, Role } from '../../Database';
import Query from '../DiscoveryCenter/Query';

type Props = {
  occurrences: Object,
  navigate: Function,
  onPressBack: ?Function,
  backTitle: ?string,
};

type State = {
  dataSource: any,
  occurrences: any
};

export default class DiscoveryCenterOccurrences extends Component {
  props: Props;
  state: State;
  shouldFetch: boolean = true;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource,
      occurrences: this.props.occurrences,
    };
  }

  componentDidMount() {
    this._getOccurrences();
  }

  componentWillUnmount() {
    this.shouldFetch = false;
  }

  render() {
    const backTitle = this.props.backTitle ? this.props.backTitle : Localizable.t('back');
    return (
      <View style={styles.container}>
        <NavigationBar title={Localizable.t('passages')}>
          <TouchableOpacity
            onPress={this.props._onPressBack}
            style={{position: 'absolute', left: 16}}
          >
            <Text style={StyleSheet.styles.navigationBar.doneButtonTitle}>{backTitle}</Text>
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
    const { occurrences, onPressBack } = this.props;
    const occurrenceIndex = parseInt(rowID);
    const number = occurrenceIndex + 1;
    const book = occurrence.book;
    const role = occurrence.role;

    const bcvReference = Localizable.t('bcv-reference', {book: book.name, reference: occurrence.reference});
    const bsoReference = Localizable.t('bso-reference', {book: book.name, source: occurrence.name, number: occurrence.number});
    const occurrencesRoute = occurrencesURL({title: Localizable.t('passages'), occurrences, onPressBack, modal: true});

    const route = readerURL({bookID: book.id, anchor: `source-${occurrence.name}-${occurrence.number}`, title: book.name, description: bsoReference, occurrenceIndex, occurrences, occurrencesRoute});

    return (
      <TouchableOpacity key={occurrence.id} style={styles.listItemContainer} onPress={() => this._navigate(route)}>
        <Text style={StyleSheet.styles.cell.occurrence}>{number}</Text>
        <View style={styles.listItem}>
          <Text numberOfLines={2} style={styles.body}>{occurrence.text}</Text>
          <View style={styles.referenceContainer}>
            <Text style={[StyleSheet.styles.cell.subtitle, {paddingRight: 8,}]}>{bcvReference}</Text>
            <Text style={[StyleSheet.styles.cell.subtitle, {color: Colors.sources[role.key].tint}]}>{Localizable.t('so-reference', {source: occurrence.name, number: occurrence.number})}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  async _getOccurrences() {
    let { occurrences } = this.state;
    const contents = {};

    for (let occurrence of occurrences) {
      const content = await Emdros.scripture({monadSet: occurrence.monadSet, stylesheet: 'occurrence'});
      contents[occurrence.id] = content;
    }

    occurrences = occurrences.map(occurrence => ({...occurrence, role: occurrence.role, reference: occurrence.reference, text: contents[occurrence.id]}));

    if (this.shouldFetch) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(occurrences),
        occurrences
      });
    }
  };

  _navigate = (route: Object) => {
    this.props.navigate(route, {replace: true});
  };

  _onPressBack = () => {
    if (this.props.onPressBack) {
      this.props.onPressBack();
    } else {
      this.props.navigate(BACK);
    }
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
  },
  listItemContainer: {
    paddingLeft: 5,
    paddingRight: 15,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  listItem: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 5,
  },
  body: {
    paddingBottom: 5,
    color: '#59626A',
    fontSize: 15,
  },
  referenceContainer: {
    flexDirection: 'row',
  }
});
