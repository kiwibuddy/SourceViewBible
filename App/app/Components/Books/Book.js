/* @flow */
'use strict';

import React, { Component } from 'react';

import ReactNative, {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  NavigationExperimental,
  Image,
  Platform
} from 'react-native';

const { Header: NavigationHeader } = NavigationExperimental;

import { connect } from 'react-redux';

import { Colors, StyleSheet, Localizable } from '../../Common';

import TabNavigator from 'react-native-tab-navigator';

import BookSummary from './BookSummary';

class Book extends Component {
  render() {
    return (
      <TabNavigator>
        <TabNavigator.Item
          selected={true}
          title={Localizable.t('tabs.summary')}
          titleStyle={styles.tabTitle}
          selectedTitleStyle={styles.selectedTabTitle}
          renderIcon={() => <Image source={require('../../Images/tabs/summary.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../Images/tabs/summary-s.png')} style={styles.selectedTabIcon} />}
        >
          <BookSummary>
          </BookSummary>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={false}
          title={Localizable.t('tabs.chapters')}
          titleStyle={styles.tabTitle}
          selectedTitleStyle={styles.selectedTabTitle}
          renderIcon={() => <Image source={require('../../Images/tabs/chapters.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../Images/tabs/chapters-s.png')} style={styles.selectedTabIcon} />}
        >
          <View>
          </View>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={false}
          title={Localizable.t('tabs.sources')}
          titleStyle={styles.tabTitle}
          selectedTitleStyle={styles.selectedTabTitle}
          renderIcon={() => <Image source={require('../../Images/tabs/sources.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../Images/tabs/sources-s.png')} style={styles.selectedTabIcon} />}
        >
          <View>
          </View>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={false}
          title={Localizable.t('tabs.spheres')}
          titleStyle={styles.tabTitle}
          selectedTitleStyle={styles.selectedTabTitle}
          renderIcon={() => <Image source={require('../../Images/tabs/spheres.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../Images/tabs/spheres-s.png')} style={styles.selectedTabIcon} />}
        >
          <View>
          </View>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={false}
          title={Localizable.t('tabs.words')}
          titleStyle={styles.tabTitle}
          selectedTitleStyle={styles.selectedTabTitle}
          renderIcon={() => <Image source={require('../../Images/tabs/words.png')} style={styles.tabIcon} />}
          renderSelectedIcon={() => <Image source={require('../../Images/tabs/words-s.png')} style={styles.selectedTabIcon} />}
        >
          <View>
          </View>
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}

const styles = StyleSheet.create({
  tabTitle: {
    color: '#929292',
  },
  selectedTabTitle: {
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
