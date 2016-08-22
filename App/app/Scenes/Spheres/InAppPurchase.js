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
      <TouchableOpacity onPress={this._onPressBuy}>
        <Text>Buy Me</Text>
      </TouchableOpacity>
    );
  };

  _renderExpired = () => {
    if (!this.props.expired) return null;

    return (
      <View style={{flex: 1}}>
        <Text>Expired</Text>
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
    backgroundColor: '#EFEFF4',
  },
  scrollView: {
    flex: 1,
    marginTop: NavigationBar.HEIGHT,
  },
});
