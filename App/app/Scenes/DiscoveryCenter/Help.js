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
          <Text style={styles.contentHeader}>Discovery Center</Text>
          <Text style={styles.contentBody}>The Discovery Center is where you can go to dream up new ways to visualize what’s in the Bible. The visualizations you come up with are kept on cards. You can keep, duplicate, share, save, and delete the cards you create.</Text>
          <View style={[styles.imageContainer, {marginBottom: 20}]}>
            <Image source={require('./Images/help-discoverycenter.png')}/>
          </View>
          <Text style={styles.contentH2}>Add Filters</Text>
          <Text style={styles.contentBody}>Once your primary selections are in, you can use filters to narrow the range of what’s on your cards. Filters can be selected from books, words, sources, or spheres.</Text>
          <Text style={styles.contentH2}>What can you do with Cards?</Text>
          <Text style={styles.contentBody}><Text style={[{fontWeight: 'bold'}]}>Duplicate</Text> — clone a card to make it a starting point for new discoveries </Text>
          <Text style={styles.contentBody}><Text style={[{fontWeight: 'bold'}]}>Share</Text> — hare your discoveries with friends, family, and the world by making it your next social post</Text>
          <Text style={styles.contentBody}><Text style={[{fontWeight: 'bold'}]}>Save</Text> — tap the share option to save an image of the card to your mobile device</Text>
          <Text style={styles.contentBody}><Text style={[{fontWeight: 'bold'}]}>Delete</Text> — remove the card from your device</Text>
          <View style={styles.separator} />
          <Text style={styles.contentBody}><Text style={[{fontWeight: 'bold'}]}>Note:</Text> We do not manage personal accounts at this time, so there is no automatic way to share the cards you create across all of your devices. The cards you create on this phone are stored on this device only. You would have to recreate them to put them on additional devices.</Text>
        </View>
        <HelpFooter navigate={props.navigate} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
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
    color: '#59626a',
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
  }
});

export default Help;
