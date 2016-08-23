/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  AsyncStorage,
  Platform,
  RecyclerViewBackedScrollView,
  Text,
  TextInput,
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

import { Actant } from '../../../Database';

type Props = {
  card: Object,
  filter: Object,
  navigate: Function,
  onDone: Function,
  type: string,
};

type State = {
  dataSource: any,
  search: ?string,
};

export default class Actants extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      dataSource: dataSource,
      search: null,
    };
  }

  render() {
    const actants = (this.props.type === 'recipient' ? Actant.recipients(this.state.search).sorted('name') : Actant.sources(this.state.search).sorted('name'));
    const dataSource = this.state.dataSource.cloneWithRows(actants)
    return (
      <View style={styles.container}>
        <TextInput
          autoCapitalize="words"
          autoCorrect={false}
          autoFocus={true}
          clearButtonMode="always"
          onChangeText={(text) => this.setState({search: text})}
          placeholder={Localizable.t('name')}
          style={styles.textInput}
          value={this.state.search || ''}
        />
        <ListView
          dataSource={dataSource}
          enableEmptySections={true}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          keyboardShouldPersistTaps={true}
          keyboardDismissMode="on-drag"
        />
      </View>
    );
  }

  _renderRow = (actant: Object, sectionID: any, rowID: any) => {
    return (
      <TouchableOpacity key={actant.id} style={StyleSheet.styles.listItem} onPress={() => this._onPressActant(actant)}>
        <Text style={StyleSheet.styles.cell.title}>{actant.name}</Text>
      </TouchableOpacity>
    );
  };

  _onPressActant = (actant: Object) => {
    const filter = {
      id: 'filter-' + Date.now(),
      type: 'actant',
      actantType: this.props.type,
      ...this.props.filter,
      actantID: actant.id
    };

    this.props.onDone(cardWithFilter(this.props.card, filter));
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
  textInput: {
    fontSize: 14,
    backgroundColor: '#ececec',
    borderColor: '#ececec',
    borderRadius: 3,
    borderWidth: 1,
    paddingLeft: 8,
    marginHorizontal: 8,
    marginVertical: 8,
    height: 26,
  },
});
