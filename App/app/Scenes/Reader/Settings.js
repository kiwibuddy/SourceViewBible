/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  Image,
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

import Icon from '../../Components/Common/Icon';

import { NavigationHeader, NavigationBarButton } from '../../Components/Navigation';
import { BACK, readerURL } from '../../Navigation';

import { Preference } from '../../Preferences';
import { ReaderBaseFontSize, ReaderFontStepSize, ReaderWebFontConversion } from '../../Common/Constants';

type Props = {
  navigate: Function,
};

type State = {
  fontStepSize: number,
  spheres: Array<string>,
  showNumbers: boolean,
};

export default class Settings extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    let showNumbers = Preference.booleanForKey(Preference.Keys.Reader.showNumbers);
    if (showNumbers == null) showNumbers = true;

    this.state = {
      fontStepSize: Preference.numberForKey(Preference.Keys.Reader.fontStepSize) || 0,
      spheres: Preference.objectForKey(Preference.Keys.Reader.spheres) || [],
      showNumbers
    }
  }

  render() {
    const { fontStepSize } = this.state;
    const fontSize = ReaderBaseFontSize + (ReaderFontStepSize * fontStepSize);

    return (
      <View style={styles.container}>
        <NavigationHeader
          title={Localizable.t('settings')}
          renderLeftComponent={(props: Object) => <NavigationBarButton
            title={Localizable.t('cancel')}
            onPress={() => this.props.navigate(BACK)}
          />}
          renderRightComponent={(props: Object) => <NavigationBarButton
            title={Localizable.t('done')}
            onPress={this._onDone}
            titleStyle={StyleSheet.styles.navigationBar.doneButtonTitle}
          />}
        />
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <View style={[styles.cellContainer, {paddingVertical: 2, paddingLeft: 15}]}>
              <View style={styles.cellLeftContainer}>
                <Text style={[StyleSheet.styles.cell.title, {flex: 1}]}>{Localizable.t('text-size')}</Text>
              </View>
              <View style={[styles.cellRightContainer, {flex: 1, width: 150}]}>
                <Text style={[styles.fontSample, {fontSize}]}>Aa</Text>
                <Slider
                onValueChange={this._onFontSizeChanged}
                step={0.25}
                style={styles.slider}
                value={this.state.fontStepSize / 4}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={[styles.cellContainer, {paddingVertical: 8, paddingLeft: 15}]}>
              <View style={styles.cellLeftContainer}>
                <Text style={[StyleSheet.styles.cell.title, {flex: 3}]}>{Localizable.t('chapter-and-verse-numbers')}</Text>
              </View>
              <View style={styles.cellRightContainer}>
                <Switch
                onValueChange={(value) => this.setState({showNumbers: value})}
                style={styles.switch}
                value={this.state.showNumbers}
                />
              </View>
            </View>
          </View>

          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderTitle}>{Localizable.t('spheres.text').toLocaleUpperCase()}</Text>
          </View>
          <View style={[styles.section, {marginTop: 8}]}>
            {this._renderSphereRow('family')}
            <View style={StyleSheet.styles.separator} />

            {this._renderSphereRow('economics')}
            <View style={StyleSheet.styles.separator} />

            {this._renderSphereRow('government')}
            <View style={StyleSheet.styles.separator} />

            {this._renderSphereRow('religion')}
            <View style={StyleSheet.styles.separator} />

            {this._renderSphereRow('education')}
            <View style={StyleSheet.styles.separator} />

            {this._renderSphereRow('communication')}
            <View style={StyleSheet.styles.separator} />

            {this._renderSphereRow('celebration')}
          </View>
        </ScrollView>
      </View>
    );
  }

  _renderSphereRow = (sphere: string) => {
    const { spheres } = this.state;

    const selected = spheres.indexOf(sphere) != -1;
    const iconName = `${sphere}-filled`;
    const statusStyle = (selected ? styles.statusSelected : {});
    const statusLabelStyle = (selected ? {color: 'white'} : {});
    const status = (selected ? Localizable.t('added') : Localizable.t('add'));
    return (
      <TouchableWithoutFeedback onPress={() => this._onPressSphere(sphere)}>
        <View style={[styles.cellContainer, {paddingVertical: 8, paddingLeft: 15}]}>
          <View style={styles.cellLeftContainer}>
            <Icon
              name={iconName}
              size={30}
              style={{color: Colors.spheres[sphere].tint, paddingRight: 8}}
            />
            <Text style={[StyleSheet.styles.cell.title]}>{Localizable.t(sphere)}</Text>
          </View>
          <View style={[styles.cellRightContainer, statusStyle]}>
            <Text style={[styles.statusLabel, statusLabelStyle]}>{status}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  _onFontSizeChanged = (step: number) => {
    const fontStepSize = (step/1) * 4;
    const fontSize = ReaderBaseFontSize + (ReaderFontStepSize * fontStepSize);
    this.setState({fontStepSize});
  };

  _onPressSphere = (sphere: string) => {
    const { spheres } = this.state;

    const sphereIndex = spheres.indexOf(sphere);
    if (sphereIndex == -1) {
      this.setState({
        spheres: [...spheres, sphere]
      });
    } else {
      spheres.splice(sphereIndex, 1);
      this.setState({
        spheres
      });
    }
  };

  _onDone = () => {
    Preference.setNumberForKey(this.state.fontStepSize, Preference.Keys.Reader.fontStepSize);
    Preference.setObjectForKey(this.state.spheres, Preference.Keys.Reader.spheres);
    Preference.setBooleanForKey(this.state.showNumbers, Preference.Keys.Reader.showNumbers);
    this.props.navigate(BACK);
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: StyleSheet.styles.separator.backgroundColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: StyleSheet.styles.separator.backgroundColor,
  },
  sectionHeaderContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  sectionHeaderTitle: {
    color: '#59626A',
    marginTop: 8,
    fontSize: 13,
  },
  slider: {
    flex: 2,
  },
  switch: {
    flex: 1,
  },
  fontSample: {
    paddingHorizontal: 8,
    fontFamily: 'Georgia',
    color: '#323B43',
  },
  statusLabel: {
    fontSize: 17,
    color: Colors.tint,
  },
  statusSelected: {
    backgroundColor: Colors.tint,
    borderRadius: 4,
    padding: 4,
    overflow: 'hidden',
  },
  cellContainer: {
    flex: 1,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center'
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
});
