/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  Image,
  Platform,
  View
} from 'react-native';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import { NavigationHeader, NavigationBarButton } from '../../Components/Navigation';
import { BACK, readerURL } from '../../Navigation';

import {
  Chart,
  BarChart,
  PieChart,
  CloudChart,
  ChartBlankslate,
} from './Charts';

import RNViewShot from 'react-native-view-shot';

type Props = {
  card: Object,
  data: Object,
  navigate: Function
}

export default class DiscoveryCenterShare extends Component {
  props: Props;

  componentDidMount() {
    // Show share sheet

    // const viewRef = this.refs.share;
    // RNViewShot.takeSnapshot(viewRef, {
    //   format: 'png',
    //   quality: 1.0
    // })
    // .then(
    //   uri => console.log('Image saved to', uri),
    //   error => console.error('Oops, snapshot failed', error)
    // );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationHeader
          navigate={this.props.navigate}
          title={Localizable.t('share')}
          renderLeftComponent={(props: Object) => <NavigationBarButton
            title={Localizable.t('cancel')}
            onPress={() => this.props.navigate(BACK)}
          />}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF4' : '#FFF',
  },
});
