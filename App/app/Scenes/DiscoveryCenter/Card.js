/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  View
} from 'react-native';

import {
  StyleSheet,
} from '../../Common';

import ChartBlankslate from './ChartBlankslate';
import FilterBlankslate from './FilterBlankslate';
import { DeleteButton, DuplicateButton, ShareButton } from './Buttons';

export const Header = (props: Object) => {
  return (
    <View {...props} style={[styles.header, props.style]}>
      {props.children}
    </View>
  );
};

type Props = {
  children?: any,
  onPressDelete?: Function,
};

type State = {
  chartType: any,
  filter: any,
};

export default class Card extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      chartType: null,
      filter: null,
    };
  }

  render() {
    if (this.props.children) return this._renderCard();

    const headerView = this._renderHeader();
    const chartView = this._renderChart();
    const filterView = this._renderFilter();

    return (
      <View style={styles.card}>
        {headerView}
        {chartView}
        {filterView}
      </View>
    );
  }

  _renderCard = () => {
    const props = this.props;
    return (
      <View style={styles.card}>
        {props.children}
      </View>
    );
  };

  _renderHeader = () => {
    return (
      <Header>
        <View style={styles.leftContainer}>
          <DeleteButton onPress={this.props.onPressDelete}/>
        </View>
        <View style={[styles.rightContainer, {justifyContent: 'flex-end'}]}>
          <DuplicateButton />
          <ShareButton style={{paddingLeft: 10}} />
        </View>
      </Header>
    )
  };

  _renderChart = () => {
    if (this.state.chartType == null) {
      return (
        <ChartBlankslate />
      );
    }

    return null;
  };

  _renderFilter = () => {
    if (this.state.filter == null) {
      return (
        <FilterBlankslate />
      );
    }

    return null;
  }

  static Header = Header;
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 4,
    marginVertical: 5,
    borderRadius: 2,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 0.8,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(255, 255, 255, 0.35)',
    paddingHorizontal: 10,
    height: 44,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 44,
  },
});
