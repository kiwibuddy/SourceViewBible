/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, { View, Text, ListView, RecyclerViewBackedScrollView, NavigationExperimental, StyleSheet } from 'react-native';
const Color = require('../common/colors');
import SegmentedControl from '../common/segmented-control';

const { Header: NavigationHeader } = NavigationExperimental;

import { connect } from 'react-redux';

class Books extends Component {
  state: {
    dataSource: any
  };

  constructor() {
      super();

      const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
      this.state = {
        dataSource: dataSource.cloneWithRowsAndSections({old: ['Genesis', 'Exodus', 'Leviticus'], new: ['Matthew', 'Mark', 'Luke']})
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <SegmentedControl
          style={styles.segmentedControl}
          tintColor={Color.tintColor}
          values={['Textual', 'Alphabetical', 'Principality']}
        />

        <ListView
          dataSource={this.state.dataSource}
          renderSectionHeader={this._renderSectionHeader}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>
    );
  }

  _renderSectionHeader(sectionData, sectionID) {
    const title = sectionID === 'old' ? 'Old Testament' : 'New Testament';
    return (
      <Text>{title}</Text>
    );
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <View>
        <Text>{rowData}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  segmentedControl: {
    marginTop: NavigationHeader.HEIGHT+8,
    marginHorizontal: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  }
});

const mapStateToProps = (state) => {
  return {

  };
}

const mapDispatchToProps = (dispatch) => {
  return {

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Books);
