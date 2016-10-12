/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import {
  Analytics,
  Colors,
  Constants,
  Localizable,
  StyleSheet,
} from '../../Common';
const { Links } = Constants;

import { NavigationHeader, NavigationBarButton } from '../../Components/Navigation';
import { BACK, sphereHelpURL } from '../../Navigation';

import { Preference } from '../../Preferences';
const { width: WIDTH } = Dimensions.get('window');


function openURL(url: string) {
  Linking.openURL(url).catch(error => {

  });
  Analytics.logCustom('Link', {url});
}

type Props = {
  title: string,
  navigate: Function,
  redirect: Function,
};

type State = {
  loading: boolean,
  product: ?Object,
}

export default class InAppPurchase extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      product: null,
    }
  }

  render() {
    const expired = this._renderExpired();
    const content = (expired ? expired : this._renderContent());

    return (
      <View style={styles.container}>
        <NavigationHeader
          navigate={this.props.navigate}
          title={this.props.title}
          renderLeftComponent={(props: Object) => (<NavigationBarButton
            title={Localizable.t('back')}
            onPress={() => props.navigate(BACK)}
          />)}
        />
        <ScrollView style={styles.scrollView}>
          {content}
        </ScrollView>
      </View>
    );
  }

  _renderContent = () => {
    const buy = (this.state.loading ? this._renderLoading() : this._renderBuy());

    return (
      <View style={styles.contentContainer}>
        <Image source={require('./Images/sphere-iap-header.png')} />
        <Text style={styles.contentHeader}>Explore Spheres</Text>
        <Text style={styles.contentBody}>Society is shaped by seven spheres of influence. With the Spheres in-app purchase unlocked, you'll be able to make personal observations about how scripture can be used to shape a Christian worldview. You can read Sphere-highlighted Scripture, explore key passages, and meditate on how a Source's words relate to societal spheres.</Text>
        {buy}
      </View>
    );
  };

  _renderLoading = () => {
    return <ActivityIndicator color="gray" size="small" />
  }

  _renderBuy = () => {
    return (
      <View style={styles.buyControls}>
        <TouchableOpacity onPress={this._onPressBuy} style={[styles.buyButton, {width: 300}]}>
          <Text style={styles.buyButtonTitle}>Purchase spheres for $3.99</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.learnButton}>Restore purchases</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _renderExpired = () => {
    if (!this.props.expired) return null;

    return (
      <View style={styles.contentContainer}>
        <Image source={require('./Images/sphere-iap-header.png')} />
        <Text style={styles.contentHeader}>Your free trial of Spheres has expired.</Text>
        <Text style={styles.contentBody}>We hope you have had a chance to explore Spheres and make some insightful personal observations about how scripture shapes your worldview. To continue using Spheres, you'll need to make an in-app purchase after you have installed the latest version of SourceView. Your support helps us continue our work to provide innovative biblical discovery and is greatly appreciated.</Text>
        <TouchableOpacity onPress={() => openURL(Links.AppStore)} style={[styles.buyButton, {width: 200}]}>
          <Text style={styles.buyButtonTitle}>Get the Update</Text>
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
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
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
    fontSize: (WIDTH <= 320 ? 21 : 26),
    lineHeight: (WIDTH <= 320 ? 26 : 28),
    fontWeight: 'bold',
    color: '#59626A',
    marginBottom: 5,
    marginHorizontal: 20,
    textAlign: 'center',
    marginTop: (WIDTH <= 320 ? 20 : 30),
  },
  contentBody: {
    fontSize: (WIDTH <= 320 ? 13 : 16),
    lineHeight: (WIDTH <= 320 ? 18 : 24),
    color: '#59626A',
    textAlign: 'center',
    marginBottom: (WIDTH <= 320 ? 20 : 25),
    marginHorizontal: Platform.OS === 'ios' ? 20 : 10,
  },
});
