/* @flow */
'use strict';

import React from 'react';

import { Image, ScrollView, Text, View } from 'react-native';

import { Localizable, StyleSheet } from '../../Common';

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
        renderLeftComponent={(props: Object) => <NavigationBarButton title={Localizable.t('close')} onPress={() => props.navigate(BACK)} />}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.helpContainer}>
          <Text style={styles.contentHeader}>Discover</Text>
          <Text style={styles.contentBody}>
            The Discover screen is where your exploration begins. You can dive into the books of the Bible, learn more about the sources quoted in Scripture, or
            observe how biblical text influences the seven spheres of society.
          </Text>
          <Text style={styles.contentBody}>
            For each category, you can either tap “View All” to browse the complete list of items or tap on a tile for a closer look at a specific book, source,
            or sphere. You can swipe left and right to browse through some featured tiles in the category. And if you scroll to the bottom, you can learn more
            about SourceView.
          </Text>
          <Text style={styles.contentH2}>Cards</Text>
          <View style={[styles.imageContainer, { marginBottom: 20 }]}>
            <Image source={require('./Images/help-discover-cards.png')} />
          </View>
          <Text style={styles.contentH2}>NAVIGATION</Text>
          <Text style={styles.contentBody}>
            At the bottom of the screen, there is a navigation bar, similar to what people might experience in a mobile browser. It is broken down into three
            main components:
          </Text>
          <Text style={styles.contentH2}>Back and Forward</Text>
          <Text style={styles.contentBody}>
            As you blaze a trail through SourceView, it is easy to go back to something you previously viewed. Simply step back through the screens with the
            “back” arrow. Then, you can tap your way forward to where you left off. For example, if you are listening to a sermon and being directed to open
            scripture after scripture, you can use the forward and back options to go back and forth to anything you previously viewed.{' '}
          </Text>
          <Text style={styles.contentH2}>Discovery Center</Text>
          <Text style={styles.contentBody}>
            The Discovery Center is where you can go to dream up new ways to visualize what’s in the Bible and share them with others. Curious about what [The
            Israelites said to God] or what [Jesus said to Peter], or what [God said to women]? Go to the Discovery Center to create and share your biblical
            discoveries.{' '}
          </Text>
          <Text style={styles.contentH2}>Bookmark Menu</Text>
          <Text style={styles.contentBody}>
            Bookmarks represent any place you need to go in SourceView. Bookmarks can be the trail of screens you viewed in your history, specific bookmarks you
            put in the reader, highlighted passages, references lookup, or any of the main screens in SourceView.
          </Text>
        </View>
        <HelpFooter navigate={props.navigate} />
      </ScrollView>
    </View>
  );
};

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
  imageContainer: {
    marginHorizontal: -15,
    marginVertical: 10,
    alignItems: 'center',
  },
});

export default Help;
