/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  ListView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import { NavigationBar, NavigationBarButton } from '../../Components/Navigation';
import { BACK } from '../../Navigation';

import Database from '../../Database';

type State = {
  search?: string,
  dataSource: any
};

export default class ReaderSearch extends Component {
  state: State;

  constructor(props: Object) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      dataSource,
      search: props.search
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar>
          <TouchableOpacity
            onPress={() => this.props.navigate(BACK)}
            style={{position: 'absolute', right: 0}}
          >
            <Text style={StyleSheet.styles.navigationBar.doneButtonTitle}>{Localizable.t('cancel')}</Text>
          </TouchableOpacity>
        </NavigationBar>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSectionHeader={this._renderSectionHeader}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={StyleSheet.styles.separator} />}
          style={styles.listView}
        />
      </View>
    );
  }

  _renderSectionHeader = (sectionData: Object, sectionID: any) => {
    const title = sectionID;
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderTitle}>{title}</Text>
      </View>
    );
  };

  _renderRow = (data: Object) => {
    return (
      <TouchableOpacity
        onPress={() => {}}
        style={styles.row}
      >
        <Text style={StyleSheet.styles.cell.title}>{data.title}</Text>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listView: {
    flex: 1,
    marginTop: NavigationBar.HEIGHT,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    marginLeft: 15,
  },
});
