/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import { NavigationBar, NavigationBarButton } from '../../Components/Navigation';
import { BACK } from '../../Navigation';
import Icon from '../../Components/Common/Icon';

import HelpFooter from '../../Components/Common/HelpFooter';

type Props = {
  title: string,
  navigate: Function,
};

const Help = (props: Props) => {
  return (
    <View style={styles.container}>
      <NavigationBar title={props.title}>
        <NavigationBarButton
          title={Localizable.t('close')}
          onPress={() => props.navigate(BACK)}
          style={{position: 'absolute', left: 0}}
        />
      </NavigationBar>
      <ScrollView style={styles.scrollView}>
        <View style={styles.helpContainer}>
          <Text style={styles.contentHeader}>Discover</Text>
          <Text style={styles.contentBody}>The Discover screen is where your exploration begins. You can dive into the books of the Bible, learn more about the sources quoted in Scripture, or observe how biblical text influences the seven spheres of society.</Text>
          <Text style={styles.contentBody}>For each category, you can either tap “View All” to browse the complete list of items or tap on a tile for a closer look at a specific book, source, or sphere. You can swipe left and right to browse through some featured tiles in the category. And if you scroll to the bottom, you can learn more about SourceView.</Text>
          <Text style={styles.contentH2}>Book Tiles (visual, description w/ no punctuation) - e.g. Genesis</Text>
          <Text style={styles.contentBody}>The Discover screen is where your exploration begins. You can dive into the books of the Bible, learn more about the sources quoted in Scripture, or observe how biblical text influences the seven spheres of society.</Text>
        </View>
        <HelpFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginTop: NavigationBar.HEIGHT,
  },
  helpContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  contentHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#59626a',
    marginBottom: 5,
  },
  contentH2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#59626a',
    marginTop: 5,
    marginBottom: 5,
  },
  contentBody: {
    fontSize: 17,
    lineHeight: 24,
    color: '#9B9B9B',
    marginBottom: 10,
  },
});

export default Help;
