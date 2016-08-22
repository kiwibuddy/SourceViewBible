/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  Image,
  Linking,
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
          <Text style={styles.contentHeader}>Endless Discovery</Text>
          <Text style={styles.contentBody}>The SourceView Bible app exists to help you observe and discover the character of God by exploring His Word. May it draw you close to Him and affirm your role in God's continuing dramatic narrative.</Text>
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
        <View style={styles.sectionHeaderContainer}>
          <Text style={StyleSheet.styles.sectionHeaderTitle}>CONNECT WITH SOURCEVIEW</Text>
        </View>
        <TouchableOpacity style={styles.listItemContainer}>
          <Icon
            name="about-fb"
            size={25}
            style={[styles.listItemIcon, {color: '#59626A'}]}
          />
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Facebook</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer}>
          <Icon
            name="about-twitter"
            size={25}
            style={[styles.listItemIcon, {color: '#59626A'}]}
            />
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Twitter</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer} onPress={() => Linking.openURL('http://sourceviewbible.com')}>
          <Icon
            name="about-web"
            size={25}
            style={[styles.listItemIcon, {color: '#59626A'}]}
          />
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>SourceView Website</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.sectionHeaderContainer}>
          <Text style={StyleSheet.styles.sectionHeaderTitle}>ABOUT SOURCEVIEW</Text>
        </View>
        <TouchableOpacity style={styles.listItemContainer}>
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Acknowledgments</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer}>
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Why the SourceView™ Bible?</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer}>
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>A Note to Readers</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer}>
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>New Living Translation</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer}>
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Terms of Service</Text>
          </View>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
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
  sectionHeaderContainer: {
    ...StyleSheet.styles.sectionHeaderContainer,
    marginLeft: 15,
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
});

export default About;
