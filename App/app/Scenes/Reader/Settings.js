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

const BASE_FONT_SIZE = 17;
const FONT_STEP_SIZE = 2;

type Props = {
  navigate: Function,
  onDone: Function,
};

type State = {
  fontSize: number,
};

export default class Settings extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      fontSize: 17,
    }
  }

  render() {
    const { fontSize } = this.state;

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
              <Text style={[styles.fontSample, {fontSize}]}>Aa</Text>
              <Slider
                onValueChange={this._onFontSizeChanged}
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

  _onFontSizeChanged = (step: number) => {
    const increment = (step/1) * 4;
    const fontSize = BASE_FONT_SIZE + (FONT_STEP_SIZE * increment);
    this.setState({fontSize});
  };
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
  fontSample: {
    paddingHorizontal: 8,
  }
});
