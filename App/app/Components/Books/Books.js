/* @flow */
'use strict';

import React, { Component } from 'react';

import ReactNative, {
  View,
  Text,
  Image,
  ListView,
  TouchableOpacity,
  RecyclerViewBackedScrollView,
  NavigationExperimental,
  PropTypes,
  Dimensions
} from 'react-native';

const { Header: NavigationHeader } = NavigationExperimental;
import { connect } from 'react-redux';
import { navigatePush, navigateReset } from '../../Actions';

const { width } = Dimensions.get('window');

import {
  Colors,
  StyleSheet,
  Localizable,
  Platform
} from '../../Common';

// $FlowBug: - Flow can't find os module extension
import SegmentedControl from '../Common/SegmentedControl';

// $FlowBug: Can't find os module extension
import LinearGradient from 'react-native-linear-gradient';

import { SourcesBarChart, SpheresBarChart } from '../Charts';

import { ReadingTime } from '../../Common/NumberHelper';

const Bible = require('../../Locale/en/NLT/SourceView.json');

const SEGMENTS = [Localizable.t('textual'), Localizable.t('alphabetical'), Localizable.t('principality')];

const OLD_TESTAMENT_BOOKS = Bible.filter((book) => {
  return book.testament === 0;
});

const NEW_TESTAMENT_BOOKS = Bible.filter((book) => {
  return book.testament === 1;
});

class Books extends Component {
  state: {
    dataSource: any,
    selectedSegmentIndex: number
  };

  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      dataSource: dataSource,
      selectedSegmentIndex: 0
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections({old: OLD_TESTAMENT_BOOKS, new: NEW_TESTAMENT_BOOKS})
    });
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
          contentContainerStyle={styles.list}
          dataSource={this.state.dataSource}
          initialListSize={18}
          pageSize={3}
          renderRow={this._renderItem}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        />
      </View>
    );
  }

  _renderSectionHeader(sectionData, sectionID) {
    const title = sectionID === 0 ? Localizable.t('old-testament') : Localizable.t('new-testament');
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderTitle}>{title.toLocaleUpperCase()}</Text>
      </View>
    );
  }

  _renderItem = (book, sectionID, rowID, highlightRow) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={ () => this.props.onButtonPress(book) }>
        <LinearGradient
          colors={Colors.spheres[book.principalSphere].gradient.tiny}
          start={[0.0, 0.25]} end={[0.5, 1.0]}
          style={styles.gradient}
        />
        <Text style={styles.bookTitle}>{book.name}</Text>
        <Text style={styles.bookReadTime}>{ReadingTime(book.wordCount)}</Text>
        <View style={styles.keyline} />
        <View style={styles.statisticsContainer}>
          <View style={styles.statisticContainer} >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.statisticTitle}>{book.sourceCount}</Text>
              <Text style={styles.statisticSubtitle}>Sources</Text>
              <SourcesBarChart
                style={{flex: 0, marginLeft: 4}}
                barStyle={{width: 2, height: 12, marginHorizontal: 1}}
                horizontal={false}
                data={[{narrator: book.sourceTypeCounts.narrator}, {god: book.sourceTypeCounts.god}, {lead: book.sourceTypeCounts.lead}, {support: book.sourceTypeCounts.support}]}
              />
            </View>
          </View>
          <View style={styles.statisticContainer} >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.statisticTitle}>0</Text>
              <Text style={styles.statisticSubtitle}>Spheres</Text>
              <SpheresBarChart
                style={{flex: 0, marginLeft: 4}}
                barStyle={{width: 2, height: 12, marginHorizontal: 1}}
                horizontal={false}
                data={[{family: 1}, {economics: 1}, {government: 1}, {religion: 1}, {education: 1}, {communication: 1}, {celebration: 1}]}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  list: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    ...StyleSheet.styles.sectionHeaderTitle,
    color: '#59626a',
  },
  itemContainer: {
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginVertical: 5,
    width: (width / 3) - 4,
    height: 95,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 0.4,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  gradient: {
    flex: 0,
    height: 3,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden'
  },
  bookTitle: {
    flex: 0,
    fontSize: (width <= 320 ? 11 : 13),
    color: '#59626a',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 5,
  },
  bookReadTime: {
    flex: 0,
    fontSize: 11,
    color: '#9b9b9b',
    textAlign: 'center',
    marginTop: 1,
    marginBottom: 7,
  },
  statisticsContainer: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 8,
    borderBottomColor: Colors.separator,
  },
  statisticContainer: {
    marginTop: 7,
  },
  statisticTitle: {
    fontSize: 11,
    color: Colors.tintColor,
    marginRight: 3,
  },
  statisticSubtitle: {
    flex: 1,
    color: Colors.subtitle,
    fontSize: 11,
  },
  sourcesContainer: {
    flexDirection: 'row',
    margin: 4,
  },
  sourceImage: {
    width: 10,
    height: 10,
    margin: 4,
  },
  readTitle: {
    color: Colors.subtitle,
    fontSize: 12,
    alignSelf: 'center',
    paddingBottom: 8,
  },
  keyline: {
    flex:0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 2,
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
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
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
