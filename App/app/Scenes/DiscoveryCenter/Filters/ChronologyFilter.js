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

import { Chronology } from '../../../Database';

type Props = {
  navigate: Function,
  onDone: Function,
};

type State = {
  dataSource: any
};

export default class Books extends Component {
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
    const filter = {
      id: 'filter-' + Date.now(),
      type: 'chronology',
      chronology
    }
    return (
      <TouchableOpacity key={book.id} style={StyleSheet.styles.listItem} onPress={() => this.props.onDone(filter)}>
        <Text style={StyleSheet.styles.cell.title}>{chronology.key}</Text>
      </TouchableOpacity>
    );
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
