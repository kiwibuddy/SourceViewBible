/* @flow */
'use strict';

import React, { Component } from 'react';

import { Image, RecyclerViewBackedScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ListView } from '../../../Components/Common/DatabaseListView';

import { Colors, StyleSheet } from '../../../Common';

import { cardWithFilter, cardWithoutFilter } from './FilterUtils';

import { Chronology } from '../../../Database';

type Props = {
  card: Object,
  filter: Object,
  item: Object,
  navigate: Function,
  onDone: Function,
};

type State = {
  dataSource: any,
};

export default class Chronologys extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });
    this.state = {
      dataSource: dataSource,
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(Chronology.all()),
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

  _renderRow = (chronology: Object) => {
    const { card, filter } = this.props;
    const checkmark =
      card.type === 'sources' && filter && filter.chronologyID === chronology.id ? (
        <Image style={{ tintColor: Colors.tint }} source={require('../../../Images/common/checkmark.png')} />
      ) : null;
    return (
      <TouchableOpacity key={chronology.id} style={StyleSheet.styles.listItem} onPress={() => this._filterChronology(chronology)}>
        <Text style={StyleSheet.styles.cell.title}>{chronology.name}</Text>
        {checkmark}
      </TouchableOpacity>
    );
  };

  _filterChronology = (chronology: Object) => {
    const { card } = this.props;

    if (card.type === 'sources' && this.props.filter && this.props.filter.chronologyID === chronology.id) {
      this.props.onDone(cardWithoutFilter(card, this.props.filter));
      return;
    }

    const filter = {
      id: 'filter-' + Date.now(),
      type: 'chronology',
      ...this.props.filter,
    };

    if (this.props.filter && this.props.filter.type === 'chronology-range') {
      if (this.props.item === 'from') {
        filter.chronologies = {
          ...filter.chronologies,
          fromID: chronology.id,
        };
      } else {
        filter.chronologies = {
          ...filter.chronologies,
          toID: chronology.id,
        };
      }
    } else {
      filter.chronologyID = chronology.id;
    }

    this.props.onDone(cardWithFilter(card, filter));
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
