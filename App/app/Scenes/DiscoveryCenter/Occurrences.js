/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  AsyncStorage,
  ListView,
  Platform,
  RecyclerViewBackedScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// import { ListView } from '../../Components/Common/DatabaseListView';

import {
  Colors,
  Constants,
  StyleSheet,
  Localizable
} from '../../Common';

import { Statement } from '../../Database';

type Props = {
  navigate: Function,
  occurrences: Array<Object>
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
    const { occurrences } = this.props;
    if (occurrences) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(occurrences)
      });
    }
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

  _renderRow = (occurrence: Object, sectionID: any, rowID: any) => {
    return (
      <TouchableOpacity key={occurrence.id} style={styles.listItemContainer} onPress={() => {}}>
        <Text style={StyleSheet.styles.cell.occurence}>1</Text>
        <View style={styles.listItem}>
          <Text style={styles.body}>Lorem ipsum dolor sit amet, eleifend varius. Risus vitae mauris cras lectus ipsum ante, semper id, tincidunt nunc magnis vehicula magnis in, magna massa, lectus donec vestibulum interdum.</Text>
          <Text style={StyleSheet.styles.cell.subtitle}>Genesis 1:1</Text>
        </View>
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
