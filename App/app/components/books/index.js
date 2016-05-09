/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, { View, Text, ListView, TouchableOpacity, RecyclerViewBackedScrollView, NavigationExperimental } from 'react-native';
const { Header: NavigationHeader } = NavigationExperimental;
import { connect } from 'react-redux';
import { navigatePush, navigateReset } from '../../actions';

import Platform from '../../common/platform';
import StyleSheet from '../../common/stylesheet';
import Colors from '../../common/colors';
import Localizable from '../../common/localizable';

import SegmentedControl from '../common/segmented-control';
import StackedBarChart from '../charts/stacked-bar-chart';

const Bible = require('../../assets/en/books');

class Books extends Component {
  state: {
    dataSource: any
  };

  constructor() {
      super();

      const oldTestamentBooks = Bible.filter((book) => {
        return book.testament === 'old';
      });

      const newTestamentBooks = Bible.filter((book) => {
        return book.testament === 'new';
      });

      const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
      this.state = {
        dataSource: dataSource.cloneWithRowsAndSections({old: oldTestamentBooks, new: newTestamentBooks})
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <SegmentedControl
          style={styles.segmentedControl}
          tintColor={Colors.tintColor}
          values={[Localizable.t('textual'), Localizable.t('alphabetical'), Localizable.t('principality')]}
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
    const title = sectionID === 'old' ? Localizable.t('old-testament').toUpperCase() : Localizable.t('new-testament').toUpperCase();
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    );
  }

  _renderRow(book, sectionID, rowID, highlightRow) {
    return (
      <TouchableOpacity onPress={ () => this.props.onButtonPress(book)}>
        <View style={styles.cellContainer}>
          <View style={styles.topContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.cellTitle}>{book.name}</Text>
            </View>
            <View style={styles.rightContainer}>
              <StackedBarChart
                style={styles.stackedBarChart}
                horizontal={true}
                data={[{black: 200, red: 300, green: 100, blue: 40}]}
              />
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.cellSubTitle}>2hr</Text>
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.cellSubTitle}>68 sources</Text>
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
  segmentedControl: {
    marginTop: NavigationHeader.HEIGHT + 8,
    marginHorizontal: 8,
    marginBottom: 10,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#CCCCCC',
    marginLeft: 8,
  },
  stackedBarChart: {
    height: 2,
    marginVertical: 8,
  },
  sectionHeader: {
    marginLeft: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c7cc',
    paddingBottom: 6,
    backgroundColor: 'white',
  },
  sectionTitle: {
    color: '#59626a',
    marginTop: 8,
    fontSize: 13,
  },
  cellContainer: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 4,
  },
  topContainer: {
    flexDirection: 'row',
  },
  bottomContainer: {
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    flex: 2,
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
      },
      android: {
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
