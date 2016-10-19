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

// $FlowFixMe: - Flow can't find os module extension
import ActivityView from 'react-native-activity-view';
import RNViewShot from 'react-native-view-shot';

type Props = {
  card: Object,
  data: Object,
  navigate: Function
}

export default class DiscoveryCenterShare extends Component {
  props: Props;

  componentDidMount() {
    setTimeout(this._share.bind(this), 100);
  }

  render() {
    const { card, data } = this.props;

    let ChartView = null;
    switch (card.chartType) {
      case Chart.Type.BAR:
        ChartView = BarChart;
        break;

      case Chart.Type.PIE:
        ChartView = PieChart;
        break;

      case Chart.Type.CLOUD:
        ChartView = CloudChart;
        break;

      default:
        ChartView = ChartBlankslate;
        break;
    }

    return (
      <View style={styles.container}>
        <NavigationHeader
          navigate={this.props.navigate}
          title={Localizable.t('share')}
        />
        <View ref="share" style={{height: 295}}>
          <ChartView
            card={card}
            data={data}
            loading={false}
            headerHidden={true}
            footerHidden={true}
          />
        </View>
      </View>
    );
  }

  _share() {
    // Show share sheet

    const viewRef = this.refs.share;
    RNViewShot.takeSnapshot(viewRef, {
      format: 'png',
      quality: 1.0
    })
    .then(uri => {
        console.log('woot!', uri);
        ActivityView.show({file: uri}, (error, result) => {
          this.props.navigate(BACK);
        });
      },
      error => console.error('Oops, snapshot failed', error)
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF4' : '#FFF',
  },
});
