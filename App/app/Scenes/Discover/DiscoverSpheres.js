/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, {
  View,
  Text,
  Image,
  ListView,
  ScrollView,
  TouchableOpacity,
  RecyclerViewBackedScrollView,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

import {
  Colors,
  StyleSheet,
} from '../../Common';

// $FlowFixMe: Can't find os module extension
import LinearGradient from 'react-native-linear-gradient';
import { SourcesBarChart, SpheresBarChart } from '../../Components/Charts';
import PageControl from '../../Components/Common/PageControl';
import { ReadingTime } from '../../Common/NumberHelper';
import Localizable from '../../Common/Localizable';

const Bible = require('../../Locale/en/NLT/SourceView.json');
const MAXIMUM_SPHERE_COUNT = 9;

type Props = {
  onPressSphere: Function,
  onPressSpheres: Function,
};

type State = {
  dataSource: any,
  currentPage: number
}

export default class DiscoverSpheres extends Component {
  state: State;

  constructor(props: Object) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    this.state = {
      dataSource: dataSource,
      currentPage: 0
    };
  }

  componentDidMount() {
    const spheres = Bible.spheres.slice(0, MAXIMUM_SPHERE_COUNT);

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(spheres)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onPressSpheres}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={StyleSheet.styles.sectionHeaderTitle}>SPHERES</Text>
            <View style={styles.sectionHeaderDetail}>
              <Image source={require('../../Images/common/disclosure.png')}  style={styles.disclosure} />
            </View>
            </View>
        </TouchableOpacity>

        <View style={[styles.sectionContainer, {flexDirection: 'column'}]}>
          <ListView
            style={{marginHorizontal: 4}}
            contentContainerStyle={styles.list}
            dataSource={this.state.dataSource}
            initialListSize={3}
            pageSize={3}
            enableEmptySections={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            renderRow={this._renderSphere}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            onMomentumScrollEnd={this._onScrollEnd}
          />
          <PageControl
            numberOfPages={3}
            currentPage={this.state.currentPage}
          />
        </View>
      </View>
    );
  }

  _renderSphere = (sphere: Object) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={ () => this.props.onPressSphere(sphere) }>
        <View style={styles.item}>
          <LinearGradient
            colors={Colors.spheres[sphere.key].gradient.tiny}
            start={[0.0, 0.25]} end={[0.5, 1.0]}
            style={styles.gradient}
          />
          <Image source={require('../../Images/discover/icon-books.png')}  style={[styles.icon, {tintColor: Colors.spheres[sphere.key].tint}]} />
          <Text style={styles.title}>{sphere.name}</Text>
          <Text style={styles.subtitle}>0%</Text>
          <View style={styles.keyline} />
          <View style={styles.statisticsContainer}>
            <View style={styles.statisticContainer} >
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.statisticTitle}>0</Text>
                <Text style={styles.statisticSubtitle}>Sources</Text>
                <SourcesBarChart
                  style={{flex: 0, marginLeft: 4}}
                  barStyle={{width: 2, height: 12, marginHorizontal: 1}}
                  horizontal={false}
                  data={[{narrator: 1}, {god: 1}, {lead: 1}, {support: 1}]}
                />
              </View>
            </View>
            <View style={styles.statisticContainer} >
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.statisticTitle}>0</Text>
                <Text style={styles.statisticSubtitle}>Books</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _onScrollEnd = (e: Object) => {
    // making our events coming from android compatible to updateIndex logic
    if (!e.nativeEvent.contentOffset) {
      e.nativeEvent.contentOffset = {x: e.nativeEvent.position * width}
    }

    const currentPage = Math.floor((e.nativeEvent.contentOffset.x - width / 2) / width) + 1;

    this.setState({
      currentPage: currentPage
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeaderContainer: {
    ...StyleSheet.styles.sectionHeaderContainer,
    borderBottomWidth: 0,
    marginLeft: 8,
  },
  sectionContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  sectionHeaderDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  disclosure: {
    width: 15,
    height: 15,
    marginTop: 8,
    marginLeft: 5,
    marginRight: -10,
  },
  list: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginHorizontal: 4,
  },
  itemContainer: {
    width: ((width - 8) / 3),
  },
  item: {
    marginHorizontal: 4,
    marginBottom: 8,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    backgroundColor: '#fff',
    height: 138,
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
  icon: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    marginTop: 7,
    tintColor: Colors.tintColor
  },
  title: {
    flex: 0,
    fontSize: (width <= 320 ? 11 : 13),
    color: '#59626a',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 1,
  },
  subtitle: {
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
    marginHorizontal: (width <= 320 ? 2 : 5),
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
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 8,
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
});
