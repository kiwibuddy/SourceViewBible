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
import { BACK, sphereHelpURL } from '../../Navigation';

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
        <Text style={styles.contentHeader}>Use spheres free for a limited time</Text>
        <Text style={styles.contentBody}>Spheres provide the data for people to meditate on and draw their conclusions with God as they seek to understand what God says about each sphere of society.</Text>
        <View style={styles.buyControls}>
          <TouchableOpacity onPress={this._onPressBuy} style={[styles.buyButton, {width: 200}]}>
            <Text style={styles.buyButtonTitle}>Start using Spheres</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigate(sphereHelpURL({title: Localizable.t('help'), modal: true}))}>
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
        <Text style={styles.contentHeader}>A new version of SourceView is Available</Text>
        <Text style={styles.contentBody}>The limited time free use of Spheres has expired. In order to continue using the Spheres data set you will need to update to the latest version of SourceView Bible</Text>
        <TouchableOpacity onPress={this._onPressBuy} style={[styles.buyButton, {width: 200}]}>
          <Text style={styles.buyButtonTitle}>Download</Text>
        </TouchableOpacity>
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
