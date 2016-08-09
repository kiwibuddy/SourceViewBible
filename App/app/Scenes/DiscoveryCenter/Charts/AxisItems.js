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

type Props = {
  navigate: Function,
  onDone: Function,
};

type State = {
  dataSource: any,
  search: string,
};

export default class AxisItems extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      dataSource: dataSource,
      search: null,
    };
  }

  render() {
    const { rows, sections} = this._getRowsAndSections();
    const dataSource = this.state.dataSource.cloneWithRowsAndSections(rows, sections);
    return (
      <View style={styles.container}>
        <TextInput
          autoCapitalize="words"
          autoCorrect={false}
          autoFocus={true}
          clearButtonMode="always"
          onChangeText={(text) => this.setState({search: text})}
          placeholder="Search Data Points"
          style={styles.textInput}
          value={this.state.search}
        />
        <ListView
          dataSource={dataSource}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSectionHeader={this._renderSectionHeader}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          keyboardShouldPersistTaps={true}
          keyboardDismissMode="on-drag"
        />
      </View>
    );
  }

  _renderSectionHeader = (sectionData: Object, sectionID: any) => {
    const title = Localizable.t(sectionID);
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderTitle}>{title}</Text>
      </View>
    );
  };

  _renderRow = (item: Object, sectionID: any, rowID: any) => {
    return (
      <TouchableOpacity key={sectionID + '-' + item.id} style={StyleSheet.styles.listItem} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.title}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  _getRowsAndSections = () => {
    const { search } = this.state;

    const actantSectionNames = [
      Localizable.t('source'),
      Localizable.t('recipient'),
    ];
    const searchSections = actantSectionNames.filter(name => name.startsWith(search));

    let matchedActantRow = false;
    const actantRows = [];

    let matchedRow = (Localizable.t('name').startsWith(search));
    if (!search || searchSections.length > 0 || matchedRow) {
      actantRows.push({id: 'name', name: Localizable.t('name')});
      if (matchedRow) matchedActantRow = true;
    };

    matchedRow = (Localizable.t('gender').startsWith(search));
    if (!search || searchSections.length > 0 || matchedRow) {
      actantRows.push({id: 'gender', name: Localizable.t('gender')});
      if (matchedRow) matchedActantRow = true;
    };

    matchedRow = (Localizable.t('nature').startsWith(search));
    if (!search || searchSections.length > 0 || matchedRow) {
      actantRows.push({id: 'nature', name: Localizable.t('nature')});
      if (matchedRow) matchedActantRow = true;
    };

    matchedRow = (Localizable.t('profession').startsWith(search));
    if (!search || searchSections.length > 0 || matchedRow) {
      actantRows.push({id: 'profession', name: Localizable.t('profession')});
      if (matchedRow) matchedActantRow = true;
    };

    matchedRow = (Localizable.t('role').startsWith(search));
    if (!search || searchSections.length > 0 || matchedRow) {
      actantRows.push({id: 'role', name: Localizable.t('role')});
      if (matchedRow) matchedActantRow = true;
    };

    const rows = {};
    const sections = [];
    if (!search || matchedActantRow || searchSections.find(name => name === Localizable.t('source'))) {
      rows['source'] = actantRows;
      sections.push('source');
    };
    if (!search || matchedActantRow || searchSections.find(name => name === Localizable.t('recipient'))) {
      rows['recipient'] = actantRows;
      sections.push('recipient');
    };

    return {rows, sections};
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
  sectionHeaderContainer: {
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c7cc',
  },
  sectionHeaderTitle: {
    color: '#59626a',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 15,
  },
});
