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
  TextInput,
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

export default class BookmarkScene extends Component {
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
        <View style={styles.referenceContainer}>
          <Text numberOfLines={2} style={styles.body}>6 Then God said, “Let there be a space between the waters, to separate the waters of the heavens from the</Text>
          <Text style={[StyleSheet.styles.cell.subtitle, {paddingRight: 8,}]}>Genesis 1:6</Text>
        </View>
        <TextInput
          autoCapitalize="words"
          autoCorrect={false}
          autoFocus={true}
          clearButtonMode="always"
          onChangeText={(text) => {}}
          placeholder="Optional note..."
          style={styles.textInput}
        />
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
  referenceContainer: {
    marginHorizontal: 15,
    marginVertical: 15,
    borderLeftColor: '#FAE8E5',
    borderLeftWidth: 4,
    paddingLeft: 8,
  },
  body: {
    fontFamily: 'Georgia',
    paddingBottom: 5,
    color: '#59626A',
    fontSize: 15,
    lineHeight: 24,
  },
  textInput: {
    fontSize: 17,
    paddingLeft: 8,
    marginHorizontal: 8,
    marginVertical: 8,
    height: 26,
    padding: 0, // Android workaround
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
        separator: {
          height: 0,
          backgroundColor: Colors.separator,
        },
        cellContainer: {
          flex: 1,
          marginRight: 15,
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 55,
        },
      },
  }),
});
