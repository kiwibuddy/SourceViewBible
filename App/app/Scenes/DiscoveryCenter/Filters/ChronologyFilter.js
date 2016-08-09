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
import { ListView } from '../../../Components/Common/DatabaseListView';

import {
  Colors,
  Constants,
  StyleSheet,
  Localizable
} from '../../../Common';

import { cardWithFilter } from './FilterUtils';

import { Chronology } from '../../../Database';

type Props = {
  navigate: Function,
  onDone: Function,
};

type State = {
  dataSource: any
};

export default class Chronologys extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      dataSource: dataSource,
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(Chronology.all())
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>
    );
  }

  _renderRow = (chronology: Object, sectionID: any, rowID: any) => {
    return (
      <TouchableOpacity key={chronology.id} style={StyleSheet.styles.listItem} onPress={() => this._filterChronology(chronology)}>
        <Text style={StyleSheet.styles.cell.title}>{chronology.name}</Text>
      </TouchableOpacity>
    );
  };

  _filterChronology = (chronology: Object) => {
    const filter = {
      id: 'filter-' + Date.now(),
      type: 'chronology',
      ...this.props.filter,
    };

    if (this.props.filter && this.props.filter.type === 'chronology-range') {
      const { chronologies } = this.props.filter;
      if (this.props.item === 'from') {
        filter.chronologies = {
          ...filter.chronologies,
          from: chronology,
        };
      } else {
        filter.chronologies = {
          ...filter.chronologies,
          to: chronology,
        };
      }
    } else {
      filter.chronology = chronology;
    }

    this.props.onDone(cardWithFilter(this.props.card, filter));
  };
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 8,
  },
});
