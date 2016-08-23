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

type Props = {
  title: string,
  navigate: Function,
};

const Acknowledgments = (props: Props) => {
  return (
    <View style={styles.container}>
      <NavigationBar title={props.title}>
        <NavigationBarButton
          title={Localizable.t('back')}
          onPress={() => props.navigate(BACK)}
          style={{position: 'absolute', left: 0}}
        />
      </NavigationBar>
      <ScrollView style={styles.scrollView}>
      <View style={styles.aboutContainer}>
        <Text style={styles.contentBody}>This Bible would not have made it to print without the generous support of Greg Newman, Bob Norsworthy, and Wendy Viscuglia of the Newman Family Foundation, or the expert counsel of Roger Freet, who guided us through the publishing process.</Text>
        <Text style={styles.contentBody}>Materials used in the SourceView™ Bible include portions of the introductions, including titles and sub-titles, to each book of the Bible from YWAM’s Christian Growth Study Bible. The book introductions in the Christian Growth Study Bible were originally adapted by David Joel Hamilton (one of the YWAM CGSB Senior Content Editors) from original material made available from Zondervan by Dirk Buursma, Senior Editor-at-Large. The book titles and sub-titles were developed by David Joel Hamilton, Edgar C. Sherman, and Scott Tompkins. All these materials had the valuable editorial input of Dirk Buursma (Zondervan), C. Lynn Green (YWAM General Editor), Betty Barnett (YWAM Managing Editor), Maureen Menard, and Edgar C. Sherman (the other two YWAM Senior Content Editors), along with Sandra Tompkins and Scott Tompkins (YWAM Senior Editors).</Text>
        <Text style={styles.contentBody}>The book introductions, titles, and subtitles in the SourceView™ Bible have once again been adapted and expanded by David Joel Hamilton in conjunction with the indispensible editorial contributions of Lisa Orvis, Sandra Tompkins, and Scott Tompkins.</Text>
        <Text style={styles.contentBody}>The original SourceView™ Bible was produced by David Joel Hamilton using the first edition of the NLT. The current version using the NLTse (second edition) was made possible thanks to the skillful editorial contributions of Kay Benavraham, Laurel Cleary, Beau Durr, Andrew Greenplate, Christine Hamilton, Andrew Kooman, Crystal Laws, Lisa Orvis, Richlyn Poor, Carol Scott, and Linda Weller. Lisa Orvis served as the Managing Editor of this process.</Text>
        <Text style={styles.contentBody}>The SourceView™ Bible logo was created by Timothy S Hamilton. It represents the dynamic narrative found in the biblical text. The largest dialogue balloon comes from heaven and is in red, representing the voice of God. The other two balloons—blue and green—represent other speakers; green is the larger as it represents the words of the lead character(s) of any given book; blue is the smaller for it depicts the words of the supporting cast. The title is in black, the color of the Narrator who ties it all together.</Text>
        <Text style={styles.contentBody}>Grateful acknowledgments are expressed to one and all. Without the gracious and diligent efforts of those mentioned above this innovative format of the Bible would not have been possible.</Text>
        <Text style={styles.contentBody}>We have all made various contributions to this project in hopes that you, the reader, will find in this new layout of the Word of God a freshness that draws you into God’s story with a renewed hunger to hear his message and apply his truth into your life and community. We trust you will be encouraged and challenged by the revelation of the biblical drama. We pray that through your acts of obedience in response to God’s story, his kingdom will be extended and his name will be glorified.</Text>
        <Text style={styles.contentBody}>It is ultimately to God that we express our greatest and most heart-felt thanks. If it were not for his gracious and inspired message through faithful men and women of old, there would be no fresh bread for us today. May God take joy in this effort to discover an innovative way to communicate his eternal Word in an effective and fruitful manner to this generation.</Text>
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
    marginTop: NavigationBar.HEIGHT,
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

export default Acknowledgments;
