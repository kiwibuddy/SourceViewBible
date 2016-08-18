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
  View,
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
          <View style={styles.section}>
            <View style={StyleSheet.styles.listItem}>
              <Text style={[StyleSheet.styles.cell.title, {flex: 1}]}>{Localizable.t('text-size')}</Text>
              <Slider
                step={0.25}
                style={styles.slider}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={StyleSheet.styles.listItem}>
              <Text style={[StyleSheet.styles.cell.title, {flex: 3}]}>{Localizable.t('chapter-and-verse-numbers')}</Text>
              <Switch
                style={styles.switch}
                value={true}
              />
            </View>
          </View>

          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderTitle}>{Localizable.t('spheres.text').toLocaleUpperCase()}</Text>
          </View>
          <View style={[styles.section, {marginTop: 8}]}>
            <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>

            </TouchableOpacity>
            <View style={StyleSheet.styles.separator} />

            <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>

            </TouchableOpacity>
            <View style={StyleSheet.styles.separator} />

            <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>

            </TouchableOpacity>
            <View style={StyleSheet.styles.separator} />

            <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>

            </TouchableOpacity>
            <View style={StyleSheet.styles.separator} />

            <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>

            </TouchableOpacity>
            <View style={StyleSheet.styles.separator} />

            <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>

            </TouchableOpacity>
            <View style={StyleSheet.styles.separator} />

            <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>

            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8D8D8',
  },
  scrollView: {
    flex: 1,
    marginTop: NavigationBar.HEIGHT,
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
    color: '#59626a',
    marginTop: 8,
    fontSize: 13,
    fontWeight: 'bold',
  },
  slider: {
    flex: 2,
  },
  switch: {
    flex: 1,
  },
});
