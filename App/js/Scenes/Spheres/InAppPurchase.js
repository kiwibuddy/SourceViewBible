/* @flow */
'use strict';

import React, { Component } from 'react';

import { ActivityIndicator, Image, ScrollView, Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native';

import { Colors, Localizable, StyleSheet } from '../../Common';

import { NavigationHeader, NavigationBarButton } from '../../Components/Navigation';
import { BACK } from '../../Navigation';

import { Preference } from '../../Preferences';
const { width: WIDTH } = Dimensions.get('window');
import DeviceInfo from 'react-native-device-info';

import Store from '../../API/Store';

const SPHERES_PRODUCT_IDENTIFIER = 'com.sourceviewbible.products.spheres';

type Props = {
  title: string,
  navigate: Function,
  redirect: Function,
};

type State = {
  loading: boolean,
  product: ?Object,
};

export default class InAppPurchase extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      product: null,
    };
  }

  componentDidMount() {
    this._fetchPurchase();
  }

  render() {
    const buy = this.state.loading ? this._renderLoading() : this._renderBuy();

    return (
      <View style={styles.container}>
        <NavigationHeader
          navigate={this.props.navigate}
          title={this.props.title}
          renderLeftComponent={(props: Object) => <NavigationBarButton title={Localizable.t('back')} onPress={() => props.navigate(BACK)} />}
        />
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            <Image source={require('./Images/sphere-iap-header.png')} />
            <Text style={styles.contentHeader}>Explore Spheres</Text>
            <Text style={styles.contentBody}>
              Society is shaped by seven spheres of influence. With the Spheres in-app purchase unlocked, you'll be able to make personal observations about how
              scripture can be used to shape a Christian worldview. You can read Sphere-highlighted Scripture, explore key passages, and meditate on how a
              Source's words relate to societal spheres.
            </Text>
            {buy}
          </View>
        </ScrollView>
      </View>
    );
  }

  _renderLoading = () => {
    return <ActivityIndicator color="gray" size="small" />;
  };

  _renderBuy = () => {
    const { product } = this.state;
    if (!product) return null;

    return (
      <View style={styles.buyControls}>
        <TouchableOpacity onPress={this._onPressBuy} style={[styles.buyButton, { width: 300 }]}>
          <Text style={styles.buyButtonTitle}>{Localizable.t('purchase-spheres-for', { localizedPrice: product.localizedPrice })}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._onPressRestore}>
          <Text style={styles.learnButton}>Restore purchases</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _onPressBuy = () => {
    if (DeviceInfo.getModel() === 'Simulator') {
      Preference.setBooleanForKey(true, Preference.Keys.Spheres.Purchased);
      this._navigateRedirect();
    } else {
      Store.purchase(SPHERES_PRODUCT_IDENTIFIER).then(purchased => {
        if (purchased) {
          Preference.setBooleanForKey(true, Preference.Keys.Spheres.Purchased);
          this._navigateRedirect();
        }
      });
    }
  };

  _onPressRestore = () => {
    if (DeviceInfo.getModel() === 'Simulator') {
      Preference.setBooleanForKey(true, Preference.Keys.Spheres.Purchased);
      this._navigateRedirect();
    } else {
      Store.restorePurchases().then(purchases => {
        if (purchases.length > 0) {
          purchases.forEach(purchase => {
            if (purchase.productID === SPHERES_PRODUCT_IDENTIFIER) {
              Preference.setBooleanForKey(true, Preference.Keys.Spheres.Purchased);
              this._navigateRedirect();
            }
          });
        }
      });
    }
  };

  _navigateRedirect = () => {
    const { redirect } = this.props;
    const replace = typeof redirect.replace !== 'undefined' ? redirect.replace : true;
    this.props.navigate(redirect, { replace });
  };

  _fetchPurchase = () => {
    Store.products([SPHERES_PRODUCT_IDENTIFIER]).then(products => {
      this.setState({ loading: false, product: products[0] });
    });
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
    overflow: 'hidden',
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
    backgroundColor: 'transparent',
  },
  contentHeader: {
    fontSize: WIDTH <= 320 ? 21 : 26,
    lineHeight: WIDTH <= 320 ? 26 : 28,
    fontWeight: 'bold',
    color: '#59626A',
    marginBottom: 5,
    marginHorizontal: 20,
    textAlign: 'center',
    marginTop: WIDTH <= 320 ? 20 : 30,
  },
  contentBody: {
    fontSize: WIDTH <= 320 ? 13 : 16,
    lineHeight: WIDTH <= 320 ? 18 : 24,
    color: '#59626A',
    textAlign: 'center',
    marginBottom: WIDTH <= 320 ? 20 : 25,
    marginHorizontal: Platform.OS === 'ios' ? 20 : 10,
  },
});
