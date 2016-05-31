/* @flow */
'use strict';

import React, { Component } from 'react';

import ReactNative, {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  NavigationExperimental,
  Image
} from 'react-native';

const { Header: NavigationHeader } = NavigationExperimental;

import { connect } from 'react-redux';

import {
  Colors,
  StyleSheet,
  Localizable,
  Platform
} from '../../../Common';

import TabNavigator from 'react-native-tab-navigator';

import BookOverview from './BookOverview';
import BookChapters from './BookChapters';
import BookSources from './BookSources';
import BookSpheres from './BookSpheres';
import BookWords from './BookWords';

export default class Book extends Component {
  state: {
    selectedTab: string
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      selectedTab: 'summary'
    };
  }

  render() {
    return (
      <TabNavigator tabBarStyle={styles.tabBarStyle} tabBarShadowStyle={styles.tabBarShadowStyle}>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'summary'}
          title={Localizable.t('tabs.overview')}
          titleStyle={styles.tabTitleStyle}
          selectedTitleStyle={styles.selectedTabTitleStyle}
          renderIcon={() => <Image source={require('../../../Images/tabs/summary.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../../Images/tabs/summary-s.png')} style={styles.selectedTabIcon} />}
          onPress={() => this.setState({ selectedTab: 'summary' })}
        >
          <BookOverview
            book={this.props.book}
            onPressChapters={() => this.setState({ selectedTab: 'chapters' })}
            onPressSources={() => this.setState({ selectedTab: 'sources' })}
            onPressSpheres={() => this.setState({ selectedTab: 'spheres' })}
            onPressWords={() => this.setState({ selectedTab: 'words' })}
            onPressScripture={() => this.props.onPressScripture(this.props.book)}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'chapters'}
          title={Localizable.t('tabs.chapters')}
          titleStyle={styles.tabTitleStyle}
          selectedTitleStyle={styles.selectedTabTitleStyle}
          renderIcon={() => <Image source={require('../../../Images/tabs/chapters.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../../Images/tabs/chapters-s.png')} style={styles.selectedTabIcon} />}
          onPress={() => this.setState({ selectedTab: 'chapters' })}
        >
          <BookChapters
            book={this.props.book}
            onPressScripture={this.props.onPressScripture}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'sources'}
          title={Localizable.t('tabs.sources')}
          titleStyle={styles.tabTitleStyle}
          selectedTitleStyle={styles.selectedTabTitleStyle}
          renderIcon={() => <Image source={require('../../../Images/tabs/sources.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../../Images/tabs/sources-s.png')} style={styles.selectedTabIcon} />}
          onPress={() => this.setState({ selectedTab: 'sources' })}
        >
          <BookSources book={this.props.book} />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'spheres'}
          title={Localizable.t('tabs.spheres')}
          titleStyle={styles.tabTitleStyle}
          selectedTitleStyle={styles.selectedTabTitleStyle}
          renderIcon={() => <Image source={require('../../../Images/tabs/spheres.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../../Images/tabs/spheres-s.png')} style={styles.selectedTabIcon} />}
          onPress={() => this.setState({ selectedTab: 'spheres' })}
        >
          <BookSpheres />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'words'}
          title={Localizable.t('tabs.words')}
          titleStyle={styles.tabTitleStyle}
          selectedTitleStyle={styles.selectedTabTitleStyle}
          renderIcon={() => <Image source={require('../../../Images/tabs/words.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../../Images/tabs/words-s.png')} style={styles.selectedTabIcon} />}
          onPress={() => this.setState({ selectedTab: 'words' })}
        >
          <BookWords />
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}

const styles = StyleSheet.create({
  tabTitleStyle: {
    color: '#929292',
  },
  selectedTabTitleStyle: {
    color: Colors.tintColor
  },
  tabIcon: {
    tintColor: '#929292'
  },
  selectedTabIcon: {
    tintColor: Colors.tintColor
  },
  ...Platform.select({
    ios: {

    },
    android: {
      tabBarStyle: {
        height: 56,
        backgroundColor: 'white',
      },
      tabBarShadowStyle: {

      }
    }
  })
});
