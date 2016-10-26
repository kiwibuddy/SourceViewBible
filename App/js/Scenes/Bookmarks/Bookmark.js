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
        <View style={[styles.cellContainer, {paddingVertical: 8, paddingLeft: 15}]}>
          <View style={styles.cellLeftContainer}>
            <Text style={[StyleSheet.styles.cell.title, {flex: 3}]}>Highlight text</Text>
          </View>
          <View style={[styles.cellRightContainer, {width: 50}]}>
            <Switch
            style={styles.switch}
            />
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    );
  }

  _onDone = () => {
    this.props.navigate(BACK);
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Platform.OS === 'ios' ? '#FFF' : '#FFF',
  },
  cellLeftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cellRightContainer: {
    flex: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  ...Platform.select({
      ios: {
        separator: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: Colors.separator,
          marginLeft: 15,
        },
        cellContainer: {
          flex: 1,
          marginRight: 15,
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 44,
        },
      },
      android: {
      },
  }),
});
