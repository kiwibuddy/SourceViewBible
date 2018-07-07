/* @flow */
'use strict';

import React, { Component } from 'react';

import { Image, RecyclerViewBackedScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ListView } from '../../../Components/Common/DatabaseListView';

import { Colors, StyleSheet } from '../../../Common';

import { cardWithFilter, cardWithoutFilter } from './FilterUtils';

import { Profession } from '../../../Database';

type Props = {
  card: Object,
  filter: Object,
  type: string,
  navigate: Function,
  onDone: Function,
};

type State = {
  dataSource: any,
};

export default class Professions extends Component {
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
      dataSource: this.state.dataSource.cloneWithRows(Profession.all()),
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

  _renderRow = (profession: Object) => {
    const { card, filter } = this.props;
    const checkmark =
      card.type === 'sources' && filter && filter.professionID === profession.id ? (
        <Image style={{ tintColor: Colors.tint }} source={require('../../../Images/common/checkmark.png')} />
      ) : null;

    return (
      <TouchableOpacity key={profession.id} style={StyleSheet.styles.listItem} onPress={() => this._filterProfession(profession)}>
        <Text style={StyleSheet.styles.cell.title}>{profession.name}</Text>
        {checkmark}
      </TouchableOpacity>
    );
  };

  _filterProfession = (profession: Object) => {
    const { card } = this.props;

    if (card.type === 'sources' && this.props.filter && this.props.filter.professionID === profession.id) {
      this.props.onDone(cardWithoutFilter(card, this.props.filter));
      return;
    }

    const filter = {
      id: 'filter-' + Date.now(),
      type: 'profession',
      actantType: this.props.type,
      ...this.props.filter,
      professionID: profession.id,
    };
    this.props.onDone(cardWithFilter(card, filter));
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 8,
  },
});
