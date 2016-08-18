/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import { NavigationBar, NavigationBarButton } from '../../Components/Navigation';
import { BACK, readerURL } from '../../Navigation';

type Props = {
  navigate: Function,
  onDone: Function,
};

export default class Settings extends Component {
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar title={Localizable.t('settings')}>
          <NavigationBarButton
            title={Localizable.t('cancel')}
            onPress={() => this.props.navigate(BACK)}
            style={{position: 'absolute', left: 0}}
          />
          <NavigationBarButton
            title={Localizable.t('done')}
            onPress={() => this.props.navigate(BACK)}
            style={{position: 'absolute', right: 0}}
            titleStyle={[StyleSheet.styles.navigationBar.doneButtonTitle, {marginRight: 8}]}
          />
        </NavigationBar>
        <ScrollView style={styles.scrollView}>

        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    marginTop: NavigationBar.HEIGHT,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
  },
});
