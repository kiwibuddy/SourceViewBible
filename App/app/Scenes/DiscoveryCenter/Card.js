/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import {
  Chart,
  BarChart,
  ChartBlankslate,
} from './Charts';

import FilterItems from './Filters/FilterItems';

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
  filters: any,
  loading: boolean,
  occurrences: any,
};

export default class Card extends Component {
  static Header = Header;

  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      chartType: null,
      filters: [],
      loading: false,
      occurrences: [],
    };
  }

  render() {
    if (this.props.children) return this._renderCard();

    const headerView = this._renderHeader();
    const chartView = this._renderChart();
    const filterView = this._renderFilterItems();
    const readButton = this._renderReadButton();

    return (
      <View style={styles.card}>
        {headerView}
        {chartView}
        {filterView}
        {readButton}
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
        <View style={StyleSheet.styles.discoveryCenter.leftContainer}>
          <DeleteButton onPress={this.props.onPressDelete}/>
        </View>
        <View style={[StyleSheet.styles.discoveryCenter.rightContainer, {justifyContent: 'flex-end'}]}>
          <DuplicateButton />
          <ShareButton style={{paddingLeft: 10}} />
        </View>
      </Header>
    )
  };

  _renderChart = () => {
    switch (this.state.chartType) {
      case Chart.Type.BAR:
        return <BarChart />;

      case Chart.Type.PIE:
        return null;

      case Chart.Type.CLOUD:
        return null;

      default:
        return <ChartBlankslate
          onPressChartType={(chartType) => {
            this._animateLayout();
            this.setState({chartType});
          }}
        />;
    }
  };

  _renderFilterItems = () => {
    const { filters } = this.state;
    return (
      <FilterItems
        filters={filters}
        onPressDeleteFilter={(filter) => this._deleteFilter(filter)}
        onPressFilterType={this._onPressFilterType}
      />
    );
  };

  _renderReadButton = () => {
    const { occurrences, filters } = this.state;
    const occurrenceCount = occurrences.length;
    const filterCount = filters.length;
    if (filterCount== 0 && occurrenceCount == 0) return null;

    return (
      <TouchableOpacity style={styles.readButton}>
        <Text style={styles.readButtonTitle}>{Localizable.t('explore-occurrences.count', {count: occurrenceCount, localizedCount: Localizable.toNumber(occurrenceCount, {precision: 0})})}</Text>
      </TouchableOpacity>
    );
  }

  _onPressFilterType = (filterType: string) => {
    const filter = {id: 'filter-' + Date.now()};
    this._addFilter(filter);
  };

  _addFilter = (filter: Object) => {
    const filters = [
      ...this.state.filters,
      filter
    ];

    this._animateLayout();
    this.setState({filters});
  };

  _deleteFilter = (filter: Object) => {
    const { filters } = this.state;
    filters.splice(filters.indexOf(filter), 1);

    this._animateLayout();
    this.setState({filters});
  };

  _animateLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
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
  readButton: {
    borderColor: Colors.tint,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    overflow:'hidden',
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
    justifyContent: 'center',
  },
  readButtonTitle: {
    color: Colors.tint,
    fontSize: 18,
    marginVertical: 20,
    marginHorizontal: 40,
  },
});
