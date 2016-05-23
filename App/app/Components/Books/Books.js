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
  PropTypes
} from 'react-native';

const { Header: NavigationHeader } = NavigationExperimental;
import { connect } from 'react-redux';
import { navigatePush, navigateReset } from '../../Actions';

import {
  Colors,
  StyleSheet,
  Localizable,
  Platform
} from '../../Common';

// $FlowBug: - Flow can't find os module extension
import SegmentedControl from '../Common/SegmentedControl';

import { SourcesBarChart, SpheresBarChart, WordCloud } from '../Charts';

import Emdros from '../../API/Emdros';

const Bible = require('../../Locale/en/books');
const SEGMENTS = [Localizable.t('textual'), Localizable.t('alphabetical'), Localizable.t('principality')];

const OLD_TESTAMENT_BOOKS = Bible.filter((book) => {
  return book.testament === 'old';
});

const NEW_TESTAMENT_BOOKS = Bible.filter((book) => {
  return book.testament === 'new';
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
        dataSource: dataSource.cloneWithRowsAndSections({old: OLD_TESTAMENT_BOOKS, new: NEW_TESTAMENT_BOOKS}),
        selectedSegmentIndex: 0
      }
  }

  componentDidMount() {
    // const query = `
    // {
    //   "objectTypeName": "Book",
    //   "feature": "DJHRef",
    //   "buckets": {
    //     "objectTypeName": "Source",
    //     "feature": "source_color",
    //     "buckets": {
    //       "objectTypeName": "Token",
    //       "expression" : "is_word=true"
    //     }
    //   }
    // }
    // `;
    //
    // Emdros.query(query, {count: true}).then((result) => {
    //   console.log(result);
    // }).catch((error) => {
    //   console.log(error);
    // });
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
          initialListSize={15}
          renderRow={this._renderItem}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
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

  _renderItem = (book, sectionID, rowID, highlightRow) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={ () => this.props.onButtonPress(book) }>
        <WordCloud
          backgroundColors={['#a856cd',  '#3722a7']}
          style={styles.wordCloud}
        >
          <Text style={styles.bookTitle}>{book.name}</Text>
        </WordCloud>

        <View style={styles.statisticsContainer}>
          <View style={styles.statisticContainer} >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.statisticTitle}>0</Text>
              <SourcesBarChart
                style={{flex: 0, marginHorizontal: 4}}
                barStyle={{width: 2, height: 20, marginHorizontal: 1}}
                horizontal={false}
                data={[{narrator: 1}, {god: 1}, {lead: 1}, {support: 1}]}
              />
            </View>
            <Text style={styles.statisticSubtitle}>Sources</Text>
          </View>

          <View style={styles.keyline} />

          <View style={styles.statisticContainer} >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.statisticTitle}>0</Text>
              <SpheresBarChart
                style={{flex: 0, marginHorizontal: 4}}
                barStyle={{width: 2, height: 20, marginHorizontal: 1}}
                horizontal={false}
                data={[{family: 1}, {economics: 1}, {government: 1}, {religion: 1}, {education: 1}, {communication: 1}, {celebration: 1}]}
              />
            </View>
            <Text style={styles.statisticSubtitle}>Spheres</Text>
          </View>
        </View>

        <View style={styles.sourcesContainer}>
          <Image source={require('../../Images/avatars/narrator.png')} style={styles.sourceImage}/>

          <Image source={require('../../Images/avatars/divine.png')} style={[styles.sourceImage, {tintColor: Colors.sources.god}]}/>

          <Image source={require('../../Images/avatars/human-male.png')} style={[styles.sourceImage, {tintColor: Colors.sources.lead}]}/>

          <Image source={require('../../Images/avatars/human-male.png')} style={[styles.sourceImage, {tintColor: Colors.sources.support}]}/>

          <Image source={require('../../Images/avatars/human-group.png')} style={[styles.sourceImage, {tintColor: Colors.sources.support}]}/>
        </View>

        <Text style={styles.readTitle}>0 min read</Text>

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
    justifyContent: 'center',
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
    borderColor: '#dcdcdc',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    overflow:'hidden',
    backgroundColor: '#f9f9f9',
    margin: 10,
    width: 100,
    height: 110
  },
  wordCloud: {
    flex: 0,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  bookTitle: {
    flex: 1,
    fontSize: 12,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  statisticsContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    borderBottomColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statisticContainer: {
    flex: 1,
  },
  statisticTitle: {
    fontSize: 14,
    color: Colors.tintColor,
    alignSelf: 'center'
  },
  statisticSubtitle: {
    flex: 1,
    color: Colors.subtitle,
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 4,
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
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator
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
