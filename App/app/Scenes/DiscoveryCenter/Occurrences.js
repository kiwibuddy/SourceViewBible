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
import { ListView } from '../../Components/Common/DatabaseListView';

import {
  Colors,
  Constants,
  StyleSheet,
  Localizable
} from '../../Common';

import { NavigationBar, Toolbar, ToolbarButton } from '../../Components/Navigation';

import { BACK } from '../../Navigation';

import Emdros from '../../API/Emdros';
import { BookSourceOccurrence } from '../../Database';
import Query from './Query';

type Props = {
  card: Object,
  navigate: Function,
};

type State = {
  dataSource: any
};

export default class DiscoveryCenterOccurrences extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      dataSource: dataSource
    };
  }

  componentDidMount() {
    const { card } = this.props;
    const query = new Query(card);
    query.occurrences().then(occurrences => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(occurrences)
      });

      for (let occurrence of occurrences) {
        Emdros.scripture({monadSet: occurrence.monadSet}).then((content) => {
          console.log('content', content);
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar title={Localizable.t('occurrences')}>
          <TouchableOpacity
            onPress={() => this.props.navigate(BACK)}
            style={{position: 'absolute', left: 16}}
          >
            <Text style={StyleSheet.styles.navigationBar.doneButtonTitle}>{Localizable.t('back')}</Text>
          </TouchableOpacity>
        </NavigationBar>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          style={styles.content}
        />
      </View>
    );
  }

  _renderRow = (occurrence: Object, sectionID: any, rowID: any) => {
    const number = parseInt(rowID) + 1;

    return (
      <TouchableOpacity key={occurrence.id} style={styles.listItemContainer} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.occurence}>{number}</Text>
        <View style={styles.listItem}>
          <Text style={styles.body}>Lorem ipsum dolor sit amet, eleifend varius. Risus vitae mauris cras lectus ipsum ante, semper id, tincidunt nunc magnis vehicula magnis in, magna massa, lectus donec vestibulum interdum.</Text>
          <Text style={StyleSheet.styles.cell.subtitle}>{occurrence.reference}</Text>
        </View>
      </TouchableOpacity>
    );
  };
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: NavigationBar.HEIGHT,
    marginBottom: Toolbar.HEIGHT,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 8,
  },
  listItemContainer: {
    paddingLeft: 8,
    paddingRight: 15,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  listItem: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 3,
  },
  body: {
    paddingBottom: 5,
  },
});
