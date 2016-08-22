/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import { NavigationBar, NavigationBarButton } from '../../Components/Navigation';
import { BACK } from '../../Navigation';

import { Preference } from '../../Preferences';

type Props = {
  title: string,
  navigate: Function,
  redirect: Function,
};

export default class InAppPurchase extends Component {
  render() {
    const expired = this._renderExpired();
    const content = (expired ? expired : this._renderContent());

    return (
      <View style={styles.container}>
        <NavigationBar title={this.props.title}>
          <NavigationBarButton
            title={Localizable.t('back')}
            onPress={() => this.props.navigate(BACK)}
            style={{position: 'absolute', left: 0}}
          />
        </NavigationBar>
        <ScrollView style={styles.scrollView}>
          {content}
        </ScrollView>
      </View>
    );
  }

  _renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        <Image source={require('./Images/sphere-iap-header.png')} />
        <Text style={styles.contentHeader}>Uses spheres free for a limited time</Text>
        <Text style={styles.contentBody}>Spheres are a brand new way to see and experience the Bible. You will be able to explore the God's word through topics like Family, Government, Education, etc.</Text>
        <View style={styles.buyControls}>
          <TouchableOpacity onPress={this._onPressBuy} style={[styles.buyButton, {width: 200}]}>
            <Text style={styles.buyButtonTitle}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.learnButton}>Learn more</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _renderExpired = () => {
    if (!this.props.expired) return null;

    return (
      <View style={styles.contentContainer}>
        <Image source={require('./Images/sphere-iap-header.png')} />
        <Text style={styles.contentHeader}>Download new version of SourceView</Text>
        <Text style={styles.contentBody}>Spheres are a brand new way to see and experience the Bible. You will be able to explore the God's word through topics like Family, Government, Education, etc.</Text>
      </View>
    );
  }

  _onPressBuy = () => {
    Preference.setBooleanForKey(true, Preference.Keys.Spheres.Prompted);
    this.props.navigate(this.props.redirect, {replace: true});
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginTop: NavigationBar.HEIGHT,
  },
  contentContainer: {
    alignItems: 'center',
  },
  buyControls: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButton: {
    borderColor: Colors.tint,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    overflow:'hidden',
    alignSelf: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonTitle: {
    color: Colors.tint,
    fontSize: 17,
    marginHorizontal: 20,
  },
  learnButton: {
    color: Colors.tint,
    fontSize: 13,
    backgroundColor: 'transparent'
  },
  contentHeader: {
    fontSize: 27,
    lineHeight: 33,
    fontWeight: 'bold',
    color: '#59626A',
    marginBottom: 5,
    textAlign: 'center',
    marginTop: 40,
    marginHorizontal: 20,
  },
  contentBody: {
    fontSize: 21,
    lineHeight: 25,
    color: '#59626A',
    textAlign: 'center',
    marginBottom: 40,
    marginHorizontal: 20,
  },
});
