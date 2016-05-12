/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, { View, Text, ListView, TouchableOpacity, RecyclerViewBackedScrollView, NavigationExperimental, PropTypes } from 'react-native';
const { Header: NavigationHeader } = NavigationExperimental;
import { connect } from 'react-redux';
import { navigatePush, navigateReset } from '../../Actions';

import Platform from '../../Common/Platform';
import StyleSheet from '../../Common/StyleSheet';
import Colors from '../../Common/Colors';
import Localizable from '../../Common/Localizable';

import SegmentedControl from '../Common/SegmentedControl';
import StackedBarChart from '../Charts/StackedBarChart';

const Bible = require('../../Locale/en/books');
const SEGMENTS = [Localizable.t('textual'), Localizable.t('alphabetical'), Localizable.t('principality')];

class Books extends Component {
  state: {
    dataSource: any,
    selectedSegmentIndex: number
  };

  constructor(props) {
      super(props);

      const oldTestamentBooks = Bible.filter((book) => {
        return book.testament === 'old';
      });

      const newTestamentBooks = Bible.filter((book) => {
        return book.testament === 'new';
      });

      const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
      this.state = {
        dataSource: dataSource.cloneWithRowsAndSections({old: oldTestamentBooks, new: newTestamentBooks}),
        selectedSegmentIndex: 0
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <SegmentedControl
          style={styles.segmentedControl}
          tintColor={Colors.tintColor}
          values={SEGMENTS}
          selectedIndex={this.state.selectedSegmentIndex}
          onValueChange={(value) => console.log('selectedIndex: ' + SEGMENTS.indexOf(value))}
        />

        <ListView
          dataSource={this.state.dataSource}
          renderSectionHeader={this._renderSectionHeader}
          renderRow={this._renderRow.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>
    );
  }

  _renderSectionHeader(sectionData, sectionID) {
    const title = sectionID === 'old' ? Localizable.t('old-testament') : Localizable.t('new-testament');
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderTitle}>{title.toLocaleUpperCase()}</Text>
      </View>
    );
  }

  _renderRow(book, sectionID, rowID, highlightRow) {
    return (
      <TouchableOpacity onPress={ () => this.props.onButtonPress(book) }>
        <View style={styles.cellContainer}>
          <View style={styles.horizontalContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.cellTitle}>{book.name}</Text>
            </View>
            <View style={styles.rightContainer}>
              <StackedBarChart
                style={styles.stackedBarChart}
                horizontal={true}
                data={[{black: 0, red: 0, green: 0, blue: 0}]}
              />
            </View>
          </View>
          <View style={styles.horizontalContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.cellSubTitle}>0 min</Text>
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.cellSubTitle}>{Localizable.t('sources.count', {count: 0})}</Text>
              </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#CCCCCC',
    marginLeft: 15,
  },
  stackedBarChart: {
    height: 4,
    flex: 0,
    marginTop: 7,
  },
  sectionHeaderContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c7cc',
    paddingBottom: 6,
    marginLeft: 15,
    backgroundColor: 'white',
  },
  sectionHeaderTitle: {
    color: '#59626a',
    marginTop: 8,
    fontSize: 13,
  },
  cellContainer: {
    flex: 1,
    marginHorizontal: 15,
    paddingVertical: 4,
  },
  horizontalContainer: {
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1.2,
  },
  rightContainer: {
    flex: 1.8,
  },
  cellTitle: {
    color: '#59626a',
    fontSize: 17,
  },
  cellSubTitle: {
    color: '#B7C0C8',
    fontSize: 13,
  },
  ...Platform.select({
      ios: {
        segmentedControl: {
          marginTop: NavigationHeader.HEIGHT + 8,
          marginHorizontal: 8,
          marginBottom: 10,
        },
      },
      android: {
        segmentedControl: {
          marginTop: NavigationHeader.HEIGHT,
          shadowColor: 'red',
          elevation: 2,
        },
      },
  })
});

const mapStateToProps = (state) => {
  return {

  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onButtonPress: (book) => {
      dispatch(navigatePush({
        key: 'book',
        title: book.name,
        book
      }));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Books);
