/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native'

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import { NavigationHeader, NavigationBarButton } from '../../Components/Navigation';
import { BACK } from '../../Navigation';
import HelpFooter from '../../Components/Common/HelpFooter';

type Props = {
  title: string,
  navigate: Function,
};

const Help = (props: Props) => {
  return (
    <View style={styles.container}>
      <NavigationHeader
        navigate={props.navigate}
        title={props.title}
        renderLeftComponent={(props: Object) => (<NavigationBarButton
          title={Localizable.t('close')}
          onPress={() => props.navigate(BACK)}
        />)}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.helpContainer}>
          <Text style={styles.contentBody}>Society is shaped by seven spheres of influence. With the SphereView in-app purchase unlocked, you'll be able to make personal observations about how scripture can be used to shape a Biblical Christian worldview. Your purchase of the SphereView dataset helps us continue our work to provide innovative Biblical discovery tools and is greatly appreciated.</Text>
          <View style={styles.separator} />
          <Text style={styles.contentH2}>Sphere Overview Screens</Text>
          <Text style={styles.contentBody}>Tap on any sphere to get an overview of how that sphere is represented in Scripture. See which books the sphere appears, how many sources have words highlighted in that sphere, and how many words in total across all sources. Each sphere includes 52 key passages that reflect the essence of the sphere. And as you scroll down on the sphere overview screen, you can learn more about how we approached noting spheres and receive some guidance about how to read through the Bible with spheres highlighted. You will also see the top books and sources for the sphere by word count.</Text>
          <Text style={styles.contentH2}>What can I do with Spheres?</Text>
          <Text style={styles.contentBody}>You can read Scripture with SphereView highlights, explore key passages, and meditate on how a source's words relate to societal spheres. It's an exciting new way to discover more about what God has to say.</Text>
        </View>
        <HelpFooter navigate={props.navigate} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  helpContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  contentHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#323B43',
    marginBottom: 5,
  },
  contentH2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#323B43',
    marginTop: 5,
    marginBottom: 5,
  },
  contentBody: {
    fontSize: 17,
    lineHeight: 24,
    color: '#59626A',
    marginBottom: 10,
  },
  separator: {
    ...StyleSheet.styles.separator,
      marginRight: -15,
      marginVertical: 10,
  },
});

export default Help;
