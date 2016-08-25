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
          <Text style={styles.contentHeader}>Source Overview</Text>
          <Text style={styles.contentBody}>Discover more about the characters found in the Bible. Each source contributes in a unique way to what God wants to say to us through them. You can observe their spoken words, who they spoke to, and even who spoke to them. What’s more, you can find the book(s) where the source speaks and go directly to scripture to start reading through the occurrences.</Text>
          <Text style={styles.contentBody}>Tap on any information on the Source Overview screen to explore more.</Text>
          <View style={styles.separator} />
          <Text style={styles.contentH2}>WORD CLOUD</Text>
          <Text style={styles.contentBody}>Observe the theme and content of a source’s words. A source’s word cloud contains the top 15 quoted words. Word size is determined by frequency. Tap inside the word cloud or on the calculated word count beneath it to explore more words by this source.</Text>
          <Text style={styles.contentH2}>BOOKS</Text>
          <Text style={styles.contentBody}>Make new observations and discoveries by reading through the words of a specific source. SourceView displays the number of books where the source is quoted. When you tap on that number, you will see each quoted occurrence. From there, you can tap on the text to go directly to that location in the Bible.</Text>
          <Text style={styles.contentH2}>SPHERES</Text>
          <Text style={styles.contentBody}>Tap on the sphere percentage to see how the seven societal spheres show up in a source’s words. Spheres information is not included and requires an in-app purchase. Your purchase helps SourceView continue its work and is much appreciated. Tap on the percentage to learn more about Spheres.</Text>
          <Text style={styles.contentH2}>SOURCE PROFILE</Text>
          <Text style={styles.contentBody}>See what additional information is available about a source. This information can be used to filter the list of sources on the View All Sources screen.</Text>
          <Text style={styles.contentH2}>OCCURRENCES</Text>
          <Text style={styles.contentBody}>An occurrence equals the number of times a source speaks in scripture. A single occurrence—a source’s contiguous quoted words—can span across multiple verses or be a portion within a verse. Occurrences help you observe complete thoughts and can be used as another way to reference a passage of Scripture. For example, John 3:16 is a single verse, but John Jesus 18 is the 18th time Jesus spoke in the book of John, and His complete quote covers verses 10-21. By looking at the occurrence, not just a verse, you can make observations about the complete thought.</Text>
          <Text style={styles.contentH2}>RELATED SOURCES</Text>
          <Text style={styles.contentBody}>When a source speaks, there’s always an intended recipient. SourceView has mapped out who the recipients are for every quoted occurrence in Scripture. This allows you to craft your own studies and observations around the original recipients of quoted text.</Text>
        </View>
        <HelpFooter navigate={props.navigate} />
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
