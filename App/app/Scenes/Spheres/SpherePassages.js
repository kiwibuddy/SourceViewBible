/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ListView,
  RecyclerViewBackedScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import { readerURL } from '../../Navigation';

import Emdros from '../../API/Emdros';
import { Sphere } from '../../Database';

import { Preference } from '../../Preferences';

type Props = {
  sphereID: string,
  navigate: Function,
};

type State = {
  dataSource: any,
  sphere: Object,
};

export default class SpherePassages extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const sphere = Sphere.findByID(props.sphereID);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      dataSource: dataSource,
      sphere
    };
  }

  componentDidMount() {
    this._getPassages();
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderPassage}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        renderSectionHeader={this._renderSectionHeader}
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={StyleSheet.styles.separator} />}
      />
    );
  }

  _renderSectionHeader = (passages: any, section: string) => {
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderTitle}>{section}</Text>
      </View>
    );
  };

  _renderPassage = (passage: Object) => {
    return (
      <TouchableOpacity style={styles.listItemContainer} onPress={() => this._onPressPassage(passage)}>
        <Text style={[StyleSheet.styles.cell.occurrence, {marginTop: -5, width: 20}]}>{passage.number}</Text>
        <View style={styles.listItem}>
          <Text style={styles.bodybold}>{passage.title}</Text>
          <Text style={styles.body}>{passage.scripture}</Text>
          <View style={styles.referenceContainer}>
            <Text style={[StyleSheet.styles.cell.subtitle, {paddingRight: 8,}]}>{passage.reference}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _onPressPassage = (passage: Object) => {
    const { sphere } = this.state;

    const monad = passage.monads[0];
    const book = monad.book;
    const chapter = monad.chapter;
    const verse = monad.verse;
    const bcvReference = Localizable.t('book-chapter-verse', {book: book.name, chapter, verse});

    if (!sphere.isFoundational) {
      Preference.setObjectForKey([sphere.id], Preference.Keys.Reader.spheres);
    }

    const route = readerURL({bookID: book.id, anchor: `verse-${chapter}-${verse}`, title: book.name, description: bcvReference});
    this.props.navigate(route);
  };

  async _getPassages() {
    const { sphere } = this.state;

    const rows = {};
    const sections = [];
    for(let passage of sphere.passages) {
      let section = rows[passage.section];
      if (!section) {
        section = [];
        sections.push(passage.section);
      }

      const contents = [];
      for(let monad of passage.monads) {
        const content = await Emdros.scripture({monadSet: monad.monadSet, stylesheet: 'occurrence'});
        contents.push(content);
      }
      const scripture = contents.join(' ');
      rows[passage.section] = [...section, {...passage, scripture}];
    }

    const dataSource = this.state.dataSource.cloneWithRowsAndSections(rows, sections);
    this.setState({
      dataSource,
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeaderContainer: {
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c7cc',
  },
  sectionHeaderTitle: {
    color: '#59626a',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listItemContainer: {
    paddingLeft: 5,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 13,
    flexDirection: 'row',
  },
  listItem: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 5,
  },
  body: {
    fontFamily: 'Georgia',
    paddingBottom: 15,
    color: '#59626A',
    fontSize: 15,
    lineHeight: 24,
  },
  bodybold: {
    color: '#59626a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  referenceContainer: {
    flexDirection: 'row',
  },
  separator: {
    ...StyleSheet.styles.separator,
  },
});
