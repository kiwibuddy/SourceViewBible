/* @flow */
'use strict';

import React from 'react';

import { Image, Linking, Platform, ScrollView, Text, View, TouchableOpacity } from 'react-native';

import { Analytics, Constants, Localizable, StyleSheet } from '../../Common';
const { Links } = Constants;

import { NavigationHeader, NavigationBarButton } from '../../Components/Navigation';
import { BACK, aboutAcknowledgmentsURL, aboutCopyrightURL, aboutNoteURL, aboutNLTURL, aboutWhyURL } from '../../Navigation';
import Icon from '../../Components/Common/Icon';

type Props = {
  title: string,
  navigate: Function,
};

function openURL(url: string) {
  Linking.openURL(url).catch(() => {});
  Analytics.logCustom('Link', { url });
}

const About = (props: Props) => {
  const ratingLink = Platform.OS === 'ios' ? Links.AppStoreRating : Links.GooglePlayRating;
  return (
    <View style={styles.container}>
      <NavigationHeader
        navigate={props.navigate}
        title={props.title}
        renderLeftComponent={(props: Object) => <NavigationBarButton title={Localizable.t('close')} onPress={() => props.navigate(BACK)} />}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image source={require('./Images/about-icon.png')} />
          <Text style={styles.contentHeader}>Endless Discovery</Text>
          <Text style={styles.contentBody}>
            The SourceView Bible app exists to help you observe and discover the character of God by exploring His Word. May it draw you close to Him and affirm
            your role in God's continuing dramatic narrative.
          </Text>
        </View>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer} onPress={() => openURL(ratingLink)}>
          <Icon name={`about-rate-${Platform.OS}`} size={25} style={[styles.listItemIcon, { color: '#59626A' }]} />
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>{Localizable.t(`leave-rating-${Platform.OS}`)}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer} onPress={() => openURL(Links.Donate)}>
          <Icon name="about-donate" size={25} style={[styles.listItemIcon, { color: '#59626A' }]} />
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Donate</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer} onPress={() => openURL(Links.Contact)}>
          <Icon name="about-contact" size={25} style={[styles.listItemIcon, { color: '#59626A' }]} />
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Contact Us</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer} onPress={() => openURL(Links.Help)}>
          <Icon name="about-help" size={25} style={[styles.listItemIcon, { color: '#59626A' }]} />
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Help Center</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.sectionHeaderContainer}>
          <Text style={StyleSheet.styles.sectionHeaderTitle}>CONNECT WITH SOURCEVIEW</Text>
        </View>
        <TouchableOpacity style={styles.listItemContainer} onPress={() => openURL(Links.Facebook)}>
          <Icon name="about-fb" size={25} style={[styles.listItemIcon, { color: '#59626A' }]} />
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Facebook</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer} onPress={() => openURL(Links.Twitter)}>
          <Icon name="about-twitter" size={25} style={[styles.listItemIcon, { color: '#59626A' }]} />
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Twitter</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer} onPress={() => openURL(Links.Website)}>
          <Icon name="about-web" size={25} style={[styles.listItemIcon, { color: '#59626A' }]} />
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>SourceView Website</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.sectionHeaderContainer}>
          <Text style={StyleSheet.styles.sectionHeaderTitle}>ABOUT SOURCEVIEW</Text>
        </View>
        <TouchableOpacity
          style={styles.listItemContainer}
          onPress={() => props.navigate(aboutAcknowledgmentsURL({ title: Localizable.t('about-acknowledgments'), modal: true }))}
        >
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>{Localizable.t('about-acknowledgments')}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer} onPress={() => props.navigate(aboutWhyURL({ title: Localizable.t('about-why'), modal: true }))}>
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>{Localizable.t('about-why')}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer} onPress={() => props.navigate(aboutNoteURL({ title: Localizable.t('about-note'), modal: true }))}>
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>{Localizable.t('about-note')}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.listItemContainer} onPress={() => props.navigate(aboutNLTURL({ title: Localizable.t('about-nlt'), modal: true }))}>
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>{Localizable.t('about-nlt')}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          style={styles.listItemContainer}
          onPress={() => props.navigate(aboutCopyrightURL({ title: Localizable.t('about-copyright'), modal: true }))}
        >
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>{Localizable.t('about-copyright')}</Text>
          </View>
        </TouchableOpacity>
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
