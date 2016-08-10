/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  ActivityIndicator,
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
  PieChart,
  CloudChart,
  ChartBlankslate,
} from './Charts';

import FilterItems from './Filters/FilterItems';
import { predicateWithCard } from './Filters/FilterUtils';
import { valuesForCard } from './Charts/ChartUtils';

import { DeleteButton, DuplicateButton, ShareButton } from './Buttons';

import Popover from './Popover';

import { Chronology, Statement } from '../../Database';

export const Header = (props: Object) => {
  return (
    <View {...props} style={[styles.header, props.style]}>
      {props.children}
    </View>
  );
};

type Props = {
  card: Object,
  children?: any,
  onPressDelete?: Function,
  onPressDuplicate?: Function,
  onPressOccurrences?: Function,
  onShowPopover?: Function,
};

type State = {
  card: Object,
  data: Object,
  loading: boolean,
};

export default class Card extends Component {
  static Header = Header;

  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    const { card } = props;

    this.state = {
      card,
      data: null,
      loading: false,
    };
  }

  render() {
    if (this.props.children) return this._renderCard();

    const headerView = this._renderHeader();
    const chartView = this._renderChart();
    const filterView = this._renderFilterItems();
    const readButton = this._renderReadButton();
    const loadingView = this._renderLoading();

    return (
      <View style={styles.card}>
        {headerView}
        {chartView}
        {loadingView}
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
          <DeleteButton onPress={this.props.onPressDelete} />
        </View>
        <View style={[StyleSheet.styles.discoveryCenter.rightContainer, {justifyContent: 'flex-end'}]}>
          <DuplicateButton onPress={this._onPressDuplicate} />
          <ShareButton style={{paddingLeft: 10}} />
        </View>
      </Header>
    )
  };

  _renderChart = () => {
    const { card } = this.state;

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
      <ChartView
        card={card}
        data={this.state.data}
        loading={this.state.loading}
        onPressAxis={this._onPressChartAxis}
        onPressChartType={this._onPressChartType}
      />
    );
  };

  _renderLoading = () => {
    if (this.state.loading) {
      return (
        <ActivityIndicator color="white" size="large" style={styles.activityIndicator} />
      );
    }

    return null;
  }

  _renderFilterItems = () => {
    const { card } = this.state;    return (
      <FilterItems
        filters={card.filters}
        onPressDeleteFilter={(filter) => this._deleteFilter(filter)}
        onPressEditFilter={this._onPressEditFilter}
        onPressFilterType={this._onPressFilterType}
      />
    );
  };

  _renderReadButton = () => {
    const { card } = this.state;
    const statementCount = card.statements.length;
    const filterCount = card.filters.length;
    if (statementCount == 0) return null;

    return (
      <TouchableOpacity style={styles.readButton} onPress={this._onPressOccurrences}>
        <Text style={styles.readButtonTitle}>{Localizable.t('explore-occurrences.count', {count: statementCount, localizedCount: Localizable.toNumber(statementCount, {precision: 0})})}</Text>
      </TouchableOpacity>
    );
  }

  _onPressDuplicate = () => {
    if (this.props.onPressDuplicate) {
      this.props.onPressDuplicate(this.state.card);
    }
  }

  _onPressChartType = (chartType: string) => {
    this._animateLayout();

    const card = {
      ...this.state.card,
      chartType
    }
    this.setState({card});
  };

  _onPressFilterType = (route: Object) => {
    if (this.props.onShowPopover) {
      const { card } = this.state;
      this.props.onShowPopover({card, route}, (card) => {
        this._animateLayout();
        this.setState({card}, this._query);
      });
    }
  };

  _onPressChartAxis = (route: Object) => {
    if (this.props.onShowPopover) {
      const { card } = this.state;
      this.props.onShowPopover({card, route}, (card) => {
        this._animateLayout();
        this.setState({card}, this._query);
      });
    }
  }

  _onPressOccurrences = () => {
    if (this.props.onPressOccurrences) {
      this.props.onPressOccurrences(this.state.card);
    }
  };

  _onPressEditFilter = (route: Object) => {
    if (this.props.onShowPopover) {
      const { card } = this.state;
      this.props.onShowPopover({card, route}, (card) => {
        this._animateLayout();
        this.setState({card}, this._query);
      });
    }
  };

  _addFilter = (filter: Object) => {
    const { card } = this.state;
    const filters = [
      ...card.filters,
      filter
    ];

    this._animateLayout();
    this.setState({
      card: {
        ...card,
        filters
      }
    });
  };

  _deleteFilter = (filter: Object) => {
    const { card } = this.state;
    const filters = card.filters;
    filters.splice(filters.indexOf(filter), 1);

    this._animateLayout();
    this.setState({
      card: {
        ...card,
        filters
      }
    }, this._query);
  };

  async _query() {
    if (!this.state.card) return;

    const predicate = predicateWithCard(this.state.card);
    const statements = await Statement.identifiersMatchingPredicate(predicate);

    const card = {
      ...this.state.card,
      statements
    };

    this.setState({card, data: null, loading: true}, () => {
      valuesForCard(card).then(values => {
        this._animateLayout();
        
        this.setState({
          data: values,
          loading: false
        });
      });
    });
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
  activityIndicator: {
    position: 'absolute',
    top: 180,
    left: 0,
    right: 0,
  },
});
