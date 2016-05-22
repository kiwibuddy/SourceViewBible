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
} from '../../Common';

import TabNavigator from 'react-native-tab-navigator';

import BookSummary from './BookSummary';
import BookChapters from './BookChapters';
import BookSources from './BookSources';
import BookSpheres from './BookSpheres';
import BookWords from './BookWords';

class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'summary'
    };
  }

  render() {
    return (
      <TabNavigator>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'summary'}
          title={Localizable.t('tabs.summary')}
          titleStyle={styles.tabTitleStyle}
          selectedTitleStyle={styles.selectedTabTitleStyle}
          renderIcon={() => <Image source={require('../../Images/tabs/summary.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../Images/tabs/summary-s.png')} style={styles.selectedTabIcon} />}
          onPress={() => this.setState({ selectedTab: 'summary' })}
        >
          <BookSummary book={this.props.book} />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'chapters'}
          title={Localizable.t('tabs.chapters')}
          titleStyle={styles.tabTitleStyle}
          selectedTitleStyle={styles.selectedTabTitleStyle}
          renderIcon={() => <Image source={require('../../Images/tabs/chapters.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../Images/tabs/chapters-s.png')} style={styles.selectedTabIcon} />}
          onPress={() => this.setState({ selectedTab: 'chapters' })}
        >
          <BookChapters />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'sources'}
          title={Localizable.t('tabs.sources')}
          titleStyle={styles.tabTitleStyle}
          selectedTitleStyle={styles.selectedTabTitleStyle}
          renderIcon={() => <Image source={require('../../Images/tabs/sources.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../Images/tabs/sources-s.png')} style={styles.selectedTabIcon} />}
          onPress={() => this.setState({ selectedTab: 'sources' })}
        >
          <BookSources />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'spheres'}
          title={Localizable.t('tabs.spheres')}
          titleStyle={styles.tabTitleStyle}
          selectedTitleStyle={styles.selectedTabTitleStyle}
          renderIcon={() => <Image source={require('../../Images/tabs/spheres.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../Images/tabs/spheres-s.png')} style={styles.selectedTabIcon} />}
          onPress={() => this.setState({ selectedTab: 'spheres' })}
        >
          <BookSpheres />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'words'}
          title={Localizable.t('tabs.words')}
          titleStyle={styles.tabTitleStyle}
          selectedTitleStyle={styles.selectedTabTitleStyle}
          renderIcon={() => <Image source={require('../../Images/tabs/words.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../Images/tabs/words-s.png')} style={styles.selectedTabIcon} />}
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
)(Book);
