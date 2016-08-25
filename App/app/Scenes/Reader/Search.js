/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  ListView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from 'react-native';

import {
  Analytics,
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import { NavigationHeader, NavigationBarButton } from '../../Components/Navigation';
import { BACK, readerURL } from '../../Navigation';

import { Bible } from '../../Database';

const { width: WIDTH } = Dimensions.get('window');

type State = {
  dataSource: any,
  search: string,
  reference: any
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
    const content = (this.state.reference ? this._renderList() : this._renderBlankslate());

    return (
      <View style={styles.container}>
        <NavigationHeader
          renderTitleComponent={(props: Object) => (
            <TextInput
              autoCapitalize="words"
              autoCorrect={false}
              autoFocus={true}
              clearButtonMode="always"
              onChangeText={this._search}
              onSubmitEditing={this._onSubmitSearch}
              placeholder={Localizable.t('search-references')}
              style={[styles.searchTextInput, {top: null, bottom: null, left: 0, right: 0, marginVertical: 8, marginRight: 32}]}
              value={this.state.search}
            />
          )}
          renderRightComponent={(props: Object) => (
            <NavigationBarButton
              title={Localizable.t('cancel')}
              titleStyle={StyleSheet.styles.navigationBar.doneButtonTitle}
              onPress={() => this.props.navigate(BACK)}
            />
          )}
        />
        {content}
      </View>
    );
  }

  _renderBlankslate = () => {
    return (
      <View style={styles.gettingstartedContainer}>
        <Image style={styles.gettingstartedIcon} source={require('./Images/reference-icon.png')} />
        <Text style={styles.gettingstartedHeader}>References</Text>
        <Text style={styles.gettingstartedBody}>There are a variety of ways to go to a specific reference:</Text>
        <Text style={styles.gettingstartedExample}>Gen or Genesis</Text>
        <Text style={styles.gettingstartedExample}>Gen Ab or Genesis Abraham</Text>
        <Text style={styles.gettingstartedExample}>John 3:16 or J 3:16</Text>
        <Text style={styles.gettingstartedExample}>John Jesus 18</Text>
      </View>
    );
  };

  _renderList = () => {
    return (
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

    let reference = null;
    if (sections.length > 0) {
      reference = references[sections[0]][0];
    }

    const dataSource = this.state.dataSource.cloneWithRowsAndSections(references, sections);
    this.setState({
      dataSource,
      reference,
      search: text
    });

    Analytics.logSearch(text, {type: 'Reference'});
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
    const { book, source, occurrenceNumber, chapterNumber, verseNumber } = reference;
    const route = {bookID: book.id, anchor: null, title: book.name, description: book.name};

    if (source) {
      if (occurrenceNumber) {
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
    padding: 0, // Android workaround
  },
  gettingstartedContainer: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  gettingstartedHeader: {
    fontSize: 28,
    fontWeight: '700',
    color: '#59626A',
    textAlign: 'center',
    marginTop: 10,
  },
  gettingstartedBody: {
    fontSize: 17,
    color: '#59626A',
    lineHeight: 21,
    textAlign: 'center',
    marginVertical: 5,
    marginHorizontal: 20,
  },
  gettingstartedExample: {
    fontSize: 17,
    color: '#9B9B9B',
    textAlign: 'center',
    marginTop: 5,
  },
  gettingstartedIcon: {
    width: (WIDTH <= 320 ? 60 : 120),
    height: (WIDTH <= 320 ? 60 : 120),
  }
});
