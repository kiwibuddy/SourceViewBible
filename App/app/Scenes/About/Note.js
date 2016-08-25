/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  Image,
  Platform,
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

type Props = {
  title: string,
  navigate: Function,
};

const Note = (props: Props) => {
  return (
    <View style={styles.container}>
      <NavigationHeader
        navigate={props.navigate}
        title={props.title}
        renderLeftComponent={(props: Object) => (<NavigationBarButton
          title={Localizable.t('back')}
          onPress={() => props.navigate(BACK)}
        />)}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.aboutContainer}>
        <Text style={styles.contentBody}>The Holy Bible, New Living Translation, was first published in 1996. It quickly became one of the most popular Bible translations in the English-speaking world. While the NLT’s influence was rapidly growing, the Bible Translation Committee determined that an additional investment in scholarly review and text refinement could make it even better. So shortly after its initial publication, the committee began an eight-year process with the purpose of increasing the level of the NLT’s precision without sacrificing its easy-to-understand quality. This second-generation text was completed in 2004 and is reflected in this edition of the New Living Translation. An additional update with minor changes was subequently introduced in 2007.</Text>
        <Text style={styles.contentBody}>The goal of any Bible translation is to convey the meaning and content of the ancient Hebrew, Aramaic, and Greek texts as accurately as possible to contemporary readers. The challenge for our translators was to create a text that would communicate as clearly and powerfully to today’s readers as the original texts did to readers and listeners in the ancient biblical world. The resulting translation is easy to read and understand, while also accurately communicating the meaning and content of the original biblical texts. The NLT is a general-purpose text especially good for study, devotional reading, and to be read aloud in worship services.</Text>
        <Text style={styles.contentBody}>We believe that the New Living Translation—which combines the latest biblical scholarship with a clear, dynamic writing style—will communicate God’s word powerfully to all who read it. We publish it with the prayer that God will use it to speak his timeless truth to the church and the world in a fresh, new way.</Text>
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
  },
  aboutContainer: {
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

export default Note;
