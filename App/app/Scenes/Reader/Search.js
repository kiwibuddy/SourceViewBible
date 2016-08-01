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

type State = {
  dataSource: any,
  search: string,
  reference?: Object
};

export default class ReaderSearch extends Component {
  state: State;

  constructor(props: Object) {
    super(props);

    const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (h1, h2) => h1 !== h2});
    this.state = {
      dataSource,
      search: props.search
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar>
          <TextInput
            autoCapitalize="words"
            autoCorrect={false}
            autoFocus={true}
            clearButtonMode="always"
            onChangeText={this._search}
            onSubmitEditing={this._onSubmitSearch}
            placeholder={Localizable.t('search-references')}
            style={styles.searchTextInput}
            value={this.state.search}
          />
          <TouchableOpacity
            onPress={() => this.props.navigate(BACK)}
            style={{marginLeft: 8}}
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

  _renderRow = (reference: Object, sectionID: any) => {
    const route = this._routeFromReference(reference);

    return (
      <TouchableOpacity onPress={() => this._navigate(readerURL(route))}>
        <View style={styles.row}>
          <Text style={StyleSheet.styles.cell.title}>{route.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  _search = (text: string) => {
    const references = Bible.searchReferences(text);
    const sections = Object.keys(references);

    let reference;
    if (sections.length > 0) {
      reference = references[sections[0]][0];
    }

    const dataSource = this.state.dataSource.cloneWithRowsAndSections(references, sections);
    this.setState({
      dataSource,
      reference,
      search: text
    });
  };

  _onSubmitSearch = () => {
    const { reference } = this.state;
    if (reference) {
      const route = this._routeFromReference(reference);
      this._navigate(readerURL(route));
    }
  }

  _navigate = (url: Object) => {
    this.props.navigate(BACK, () => {
      this.props.navigate(url);
    });
  };

  _routeFromReference = (reference: Object) => {
    const { book, source, occurrence, occurrenceNumber, chapterNumber, verseNumber } = reference;
    const route = {bookID: book.id, anchor: null, title: book.name, description: book.name};

    if (source) {
      if (occurrence) {
        route["description"] = `${book.name} ${source.name} ${occurrenceNumber}`;
        route["anchor"] = `source-${source.name}-${occurrenceNumber}`;
      } else {
        route["description"] = `${book.name} ${source.name}`;
        route["anchor"] = `source-${source.name}-1`;
      }
    } else if (verseNumber > 0) {
      route["anchor"] = `verse-${chapterNumber}-${verseNumber}`;
      route["description"] = `${book.name} ${chapterNumber}:${verseNumber}`;
    } else {
      route["anchor"] = `chapter-${chapterNumber || 1}`;

      if (chapterNumber > 0) {
        route["description"] = `${book.name} ${chapterNumber}`;
      }
    }

    return route;
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
    fontSize: 14,
    backgroundColor: '#ececec',
    borderColor: '#ececec',
    borderRadius: 3,
    borderWidth: 1,
    paddingLeft: 8,
    height: 26,
  },
});
