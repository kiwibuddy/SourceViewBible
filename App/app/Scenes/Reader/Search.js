/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  ListView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import { NavigationBar, NavigationBarButton } from '../../Components/Navigation';
import { BACK, readerURL } from '../../Navigation';

import { Bible } from '../../Database';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (h1, h2) => h1 !== h2,
});

type State = {
  search: string,
};

export default class ReaderSearch extends Component {
  state: State;

  constructor(props: Object) {
    super(props);

    this.state = {
      search: props.search
    };
  }

  render() {
    const dataSource = this._search(this.state.search);

    return (
      <View style={styles.container}>
        <NavigationBar>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            onChangeText={text => {
              this.setState({search: text});
            }}
            placeholder={Localizable.t('search-references')}
            style={styles.searchTextInput}
            value={this.state.search}
          />
          <TouchableOpacity
            onPress={() => this.props.navigate(BACK)}
            style={{position: 'absolute', right: 0}}
          >
            <Text style={StyleSheet.styles.navigationBar.doneButtonTitle}>{Localizable.t('cancel')}</Text>
          </TouchableOpacity>
        </NavigationBar>
        <ListView
          enableEmptySections={true}
          dataSource={dataSource}
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

  _renderRow = (reference: Object) => {
    const { book } = reference;
    const route = readerURL({bookID: book.id, chapterNumber: 1, anchor: 'chapter-1', title: book.name});

    return (
      <TouchableOpacity onPress={() => this._navigate(route)}>
        <View style={styles.row}>
          <Text style={StyleSheet.styles.cell.title}>{book.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  _search = (text: string) => {
    console.log('SEARCH! ' + text);

    const references = Bible.searchReferences(text);
    const sections = Object.keys(references);

    return ds.cloneWithRowsAndSections(references, sections);
  };

  _navigate = (route: Object) => {
    this.props.navigate(BACK, () => {
      this.props.navigate(route);
    });
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
  searchTextInput: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: '#cccccc',
    borderRadius: 3,
    borderWidth: 1,
    paddingLeft: 8,
    height: 26,
  },
});
