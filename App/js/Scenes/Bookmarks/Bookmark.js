/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Slider,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import { NavigationHeader, NavigationBarButton } from '../../Components/Navigation';
import { BACK } from '../../Navigation';

type Props = {
  navigate: Function,
};

type State = {

};

export default class Bookmark extends Component {
  props: Props;
  state: State;

  render() {
    const doneImage = (Platform.OS === 'android' ? require('../../Components/Navigation/Images/checkmark-icon.png') : null);

    return (
      <View style={styles.container}>
        <NavigationHeader
          navigate={this.props.navigate}
          title={Localizable.t('bookmark')}
          renderLeftComponent={(props: Object) => <NavigationBarButton
            title={Localizable.t('cancel')}
            onPress={() => this.props.navigate(BACK)}
          />}
          renderRightComponent={(props: Object) => <NavigationBarButton
            imageSource={doneImage}
            title={Localizable.t('done')}
            onPress={this._onDone}
            titleStyle={StyleSheet.styles.navigationBar.doneButtonTitle}
          />}
        />
        <View>
        </View>
      </View>
    );
  }


  _onDone = () => {
    this.props.navigate(BACK);
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF4' : '#FFF',
  },
  ...Platform.select({
      ios: {
      },
      android: {
      },
  }),
});
