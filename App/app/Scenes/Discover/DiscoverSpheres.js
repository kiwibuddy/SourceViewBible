/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, {
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  RecyclerViewBackedScrollView,
  Dimensions
} from 'react-native';
import { ListView } from '../../Components/Common/DatabaseListView';

const { width: WIDTH } = Dimensions.get('window');

import {
  Colors,
  Constants,
  StyleSheet,
} from '../../Common';

const {
  SourceType,
  SphereType
} = Constants;

// $FlowFixMe: Can't find os module extension
import LinearGradient from 'react-native-linear-gradient';
import { SourcesBarChart, SpheresBarChart } from '../../Components/Charts';
import PageControl from '../../Components/Common/PageControl';
import { ReadingTime } from '../../Common/NumberHelper';
import Localizable from '../../Common/Localizable';
import Icon from '../../Components/Common/Icon';

const MAXIMUM_SPHERE_COUNT = 9;

import { spheresURL, sphereURL } from '../../Navigation';

import { Bible, Book, Sphere } from '../../Database';

type Props = {
  navigate: Function,
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
    let spheres = Sphere.all().slice(0, MAXIMUM_SPHERE_COUNT);
    const delta = MAXIMUM_SPHERE_COUNT - spheres.length;
    if (delta > 0) {
      for (let i = 0; i < delta; i++) {
        spheres.push({key: null});
      }
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(spheres)
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
         <TouchableOpacity onPress={() => this.props.navigate(spheresURL({title: Localizable.t('spheres.text')}))}>
           <View style={styles.sectionHeaderContainer}>
             <Text style={StyleSheet.styles.sectionHeaderTitle}>SPHERES</Text>
             <View style={styles.sectionHeaderDetail}>
               <Text style={[StyleSheet.styles.sectionHeaderTitle, {color: Colors.tint, fontWeight: 'normal'}]}>View All</Text>
               <Image source={require('../../Images/common/disclosure.png')}  style={styles.disclosure} />
             </View>
             </View>
         </TouchableOpacity>
          <View style={{paddingVertical: 5, flexDirection: 'column'}}>
            <ListView
              dataSource={this.state.dataSource}
              enableEmptySections={true}
              horizontal={true}
              initialListSize={3}
              onMomentumScrollEnd={this._onScrollEnd}
              pageSize={3}
              pagingEnabled={true}
              renderRow={this._renderSphere}
              showsHorizontalScrollIndicator={false}
              style={{marginHorizontal: 4}}
            />
            <PageControl
              numberOfPages={3}
              currentPage={this.state.currentPage}
            />
          </View>
        </View>
      </View>
    );
  }

  _renderSphere = (sphere: Object) => {
    if (!sphere.id) {
      return this._renderBlank();
    }

    const spherePercent = (sphere.wordCount / Bible.wordCount) * 100;
    const iconName = `${sphere.id}-filled`;
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={ () => this.props.navigate(sphereURL({sphereID: sphere.id, title: Localizable.t('spheres.text'), description: Localizable.t('sphere-overview', {name: sphere.name})})) }>
        <View style={styles.item}>
          <LinearGradient
            colors={Colors.spheres[sphere.id].gradient.tiny}
            start={[0.0, 0.25]} end={[0.5, 1.0]}
            style={styles.gradient}
          />
          <Icon
            name={iconName}
            size={40}
            style={[styles.icon, {color: Colors.spheres[sphere.id].tint}]}
          />
          <Text style={styles.title}>{sphere.name}</Text>
          <Text style={styles.subtitle}>{Localizable.toPercentage(spherePercent, {precision: 0})}</Text>
          <View style={styles.keyline} />
          <View style={styles.statisticsContainer}>
            <View style={styles.statisticContainer} >
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.statisticTitle}>{sphere.sourceCount}</Text>
                <Text style={styles.statisticSubtitle}>Sources</Text>
                <SourcesBarChart
                  style={{flex: 0, marginLeft: 4}}
                  barStyle={{width: 2, height: 12, marginHorizontal: 1}}
                  horizontal={false}
                  data={[{narrator: sphere.countOfSourceType(SourceType.NARRATOR)}, {god: sphere.countOfSourceType(SourceType.GOD)}, {lead: sphere.countOfSourceType(SourceType.LEAD)}, {support: sphere.countOfSourceType(SourceType.SUPPORT)}]}
                />
              </View>
            </View>
            <View style={styles.statisticContainer} >
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.statisticWordsTitle}>{Localizable.toNumber(sphere.wordCount, {precision: 0})}</Text>
                <Text style={styles.statisticSubtitle}>Words</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderBlank = () => {
    return (
      <View style={[styles.itemContainer]} />
    );
  }

  _onScrollEnd = (e: Object) => {
    // making our events coming from android compatible to updateIndex logic
    if (!e.nativeEvent.contentOffset) {
      e.nativeEvent.contentOffset = {x: e.nativeEvent.position * WIDTH}
    }

    const currentPage = Math.floor((e.nativeEvent.contentOffset.x - WIDTH / 2) / WIDTH) + 1;

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
  itemContainer: {
    width: ((WIDTH - 8) / 3),
  },
  item: {
    marginHorizontal: 4,
    marginBottom: 8,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    backgroundColor: '#fff',
    height: 138,
    shadowColor: 'black',
    shadowOpacity: 0.05,
    shadowRadius: 0.4,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  ...Platform.select({
      android: {
        item: {
          marginHorizontal: 4,
          marginBottom: 8,
          borderColor: 'rgba(0, 0, 0, 0.15)',
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: 4,
          backgroundColor: '#fff',
          height: 142,
          elevation: .5,
        },
      },
  }),
  gradient: {
    flex: 0,
    height: 3,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden'
  },
  icon: {
    alignSelf: 'center',
    marginTop: 7,
    color: Colors.tint
  },
  title: {
    flex: 0,
    fontSize: (WIDTH <= 320 ? 11 : 13),
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
    marginHorizontal: (WIDTH <= 320 ? 2 : 5),
  },
  statisticContainer: {
    marginTop: 7,
  },
  statisticTitle: {
    fontSize: 11,
    color: Colors.tint,
    marginRight: 3,
    margin: (WIDTH <= 320 ? 0 : null),
    height: (WIDTH <= 320 ? 0 : null),
  },
  statisticWordsTitle: {
    fontSize: 11,
    color: Colors.tint,
    marginRight: 3,
    marginLeft: (WIDTH <= 320 ? 2 : null),
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
