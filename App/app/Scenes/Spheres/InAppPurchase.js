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
          <TouchableOpacity onPress={this._onPressBuy}>
            <Text>Buy Me</Text>
          </TouchableOpacity>
        </ScrollView>
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
