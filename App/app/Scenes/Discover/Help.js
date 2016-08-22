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
        <Text>Discover Help!</Text>
        <View style={styles.footer}>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.listItemContainer}>
            <Icon
              name="about-contact"
              size={25}
              style={[styles.listItemIcon, {color: '#59626A'}]}
            />
            <View style={styles.listItem}>
              <Text style={StyleSheet.styles.cell.title}>Contact Us</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.listItemContainer}>
            <Icon
              name="about-info"
              size={25}
              style={[styles.listItemIcon, {color: '#59626A'}]}
            />
            <View style={styles.listItem}>
              <Text style={StyleSheet.styles.cell.title}>About SourceView</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.donateContainer}>
            <Text style={[styles.contentHeader, {marginBottom: 0}]}>Help us</Text>
            <Text style={[styles.contentHeader, {marginTop: 0}]}>end Biblical poverty</Text>
            <Text style={styles.contentBody}>With your help we can ensure that more people around the world with smart phones can have access to the Bible.</Text>
            <Text style={styles.button}>Donate Today</Text>
          </TouchableOpacity>
        </View>
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
  footer: {
    paddingVertical: 20,
  },
  contentHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#59626a',
    marginTop: 15,
    marginBottom: 5,
  },
  contentBody: {
    fontSize: 17,
    lineHeight: 24,
    color: '#9B9B9B',
    textAlign: 'center',
  },
  listItemContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  listItemIcon: {
    alignSelf: 'center',
    paddingRight: 10,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
  },
  contentHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#59626a',
    marginBottom: 5,
  },
  contentBody: {
    fontSize: 17,
    lineHeight: 24,
    color: '#9B9B9B',
  },
  button: {
    fontSize: 17,
    color: Colors.tint,
    paddingVertical: 5,
  },
  donateContainer: {
    padding: 15,
  }
});

export default Help;
