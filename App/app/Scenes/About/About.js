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

const About = (props: Props) => {
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
        <View style={styles.header}>
          <Image source={require('./Images/about-icon.png')}/>
          <Text style={styles.contentHeader}>Lorem ipsum dolor</Text>
          <Text style={styles.contentBody}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu imperdiet ipsum, at pellentesque arcu. Quisque eleifend enim id felis semper.</Text>
        </View>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer}>
          <Icon
            name="about-rate-ios"
            size={25}
            style={[styles.listItemIcon, {color: '#59626A'}]}
          />
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Leave a rating in App Store</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer}>
          <Icon
            name="about-rate-android"
            size={25}
            style={[styles.listItemIcon, {color: '#59626A'}]}
          />
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Leave a rating in Google Play</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer}>
          <Icon
            name="about-donate"
            size={25}
            style={[styles.listItemIcon, {color: '#59626A'}]}
          />
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Donate</Text>
          </View>
        </TouchableOpacity>
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
  header: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
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
  listItemHeader: {
    borderTopWidth: 2,
    borderTopColor: 'red',
    paddingLeft: 15,
    paddingVertical: 8,
    borderBottomColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: 'black',
    shadowOpacity: 0.05,
    shadowRadius: 0.4,
    shadowOffset: {
      height: 1,
      width: 0
    },
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
});

export default About;
