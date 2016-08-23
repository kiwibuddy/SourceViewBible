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

import { NavigationBar, NavigationBarButton } from '../../Components/Navigation';
import { BACK } from '../../Navigation';
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
          <Text style={styles.contentHeader}>Book Overview</Text>
          <Text style={styles.contentBody}>Make new discoveries about the books of the Bible. Everything you see on an overview screen is informative and tappable. Beneath all of the interactive elements, you’ll find an introduction to this book, which includes recommendations about what to look for and how the SourceView format draws out new insights.</Text>
          <View style={styles.separator} />
          <Text style={styles.contentH2}>WORD CLOUD</Text>
          <Text style={styles.contentBody}>Word clouds help you get a sense of the book’s theme. Immediately you will notice several different-sized words. These are the top 15 words used in this book. The bigger the word, the more frequent it is used. Tap inside the word cloud if you want to explore more words in this book.</Text>
          <Text style={styles.contentH2}>READING</Text>
          <Text style={styles.contentBody}>You can quickly dive into reading in a couple of ways. If you know the chapter you want, tap on the chapter count area. It will take you to a screen where you can select the chapter and start reading. To start reading from the beginning, simply tap on the red button.</Text>
          <Text style={styles.contentH2}>SOURCES</Text>
          <Text style={styles.contentBody}>To see a listing of all of the sources quoted in this book, tap on the source count or the “more” icon next to the list of top sources. You can also tap on one of the top sources to go to the corresponding Source Overview screen.</Text>
          <Text style={styles.contentH2}>SPHERES</Text>
          <Text style={styles.contentBody}>Tap on the sphere percentage to see how the seven societal spheres show up in this book. Spheres information is not included and requires an in-app purchase. Your purchase helps SourceView continue its work and is much appreciated. Tap on the percentage to learn more about Spheres.</Text>
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
  separator: {
    ...StyleSheet.styles.separator,
      marginRight: -15,
      marginVertical: 10,
  },
});

export default Help;
