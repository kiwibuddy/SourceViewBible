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
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  title: string,
  navigate: Function,
};

const Onboarding = (props: Props) => {
  return (
    <View style={styles.container}>
      <NavigationBar title={props.title}>
        <NavigationBarButton
          title={Localizable.t('close')}
          onPress={() => props.navigate(BACK)}
          style={{position: 'absolute', left: 0}}
        />
      </NavigationBar>
      <LinearGradient
        colors={['#E1E9EE', '#FFFFFF']}
        start={[0.5, 0.25]} end={[0.5, 1.0]}
        style={styles.onboardingContainer}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.onboardingContainer1}>
            <View style={styles.onboardingContent}>
              <Image source={require('./Images/onboarding-1.png')} />
              <Text style={styles.contentHeader}>Welcome to the SourceView Bible</Text>
              <Text style={styles.contentBody}>Introducing a fresh way to discover God's Word</Text>
            </View>
          </View>
          <View style={styles.onboardingContainer2}>
            <View style={styles.onboardingContent}>
              <Image source={require('./Images/onboarding-2.png')} />
              <Text style={styles.contentHeader}>What's inside</Text>
              <Text style={styles.contentBody}>Discovery begins when we look deeper into God's story: what's written, who said it, and how it can impact society.</Text>
            </View>
          </View>
          <View style={styles.onboardingContainer3}>
            <View style={styles.onboardingContent}>
              <Image source={require('./Images/onboarding-3.png')} />
              <Text style={styles.contentHeader}>What you'll see</Text>
              <Text style={styles.contentBody}>A new Scripture layout and dynamic visualisations enabling you to encounter the Bible like never before.</Text>
            </View>
          </View>
          <View style={styles.onboardingContainer4}>
            <View style={styles.onboardingContent}>
              <Image source={require('./Images/onboarding-4.png')} />
              <Text style={styles.contentHeader}>Words matter</Text>
              <Text style={styles.contentBody}>Every word is enriched by layers of information, enabling you to explore and gain new insights.</Text>
            </View>
          </View>
          <View style={styles.onboardingContainer5}>
            <View style={styles.onboardingContent}>
              <Image source={require('./Images/onboarding-5.png')} />
              <Text style={styles.contentHeader}>Share discoveries</Text>
              <Text style={styles.contentBody}>Create insightful visualizations of Scripture and share them
with friends.</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.onboardingControls}>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextButtonTitle}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.skipButton}>Skip Intro</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  onboardingContainer: {
    flex: 1,
    marginTop: NavigationBar.HEIGHT,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  onboardingContent: {
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 10,
  },
  contentHeader: {
    fontSize: 27,
    lineHeight: 33,
    fontWeight: 'bold',
    color: '#59626A',
    marginBottom: 5,
    textAlign: 'center',
  },
  contentBody: {
    fontSize: 21,
    lineHeight: 25,
    color: '#59626A',
    textAlign: 'center',
  },
  onboardingControls: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: Colors.tint,
    borderColor: Colors.tint,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    overflow:'hidden',
    alignSelf: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  nextButtonTitle: {
    color: 'white',
    fontSize: 17,
    marginHorizontal: 80,
  },
  skipButton: {
    color: Colors.tint,
    fontSize: 17,
    backgroundColor: 'transparent'
  },
});

export default Onboarding;
