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

import RNViewShot from 'react-native-view-shot';

import FilterItems from './Filters/FilterItems';

import { DeleteButton, DuplicateButton, ShareButton } from './Buttons';

import Popover from '../../Components/Common/Popover';

import Query from './Query';

import { BookSourceOccurrence, Chronology } from '../../Database';
import { Discovery } from '../../Preferences';

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
  onPressShare?: Function,
  onShowPopover?: Function,
};

type State = {
  card: Object,
  data: any,
  wordCount: any,
  loading: boolean,
};

export default class Card extends Component {
  static Header = Header;

  props: Props;
  state: State;
  shouldFetch: boolean = true;

  constructor(props: Props) {
    super(props);
    const { card } = props;

    this.state = {
      card,
      data: null,
      wordCount: null,
      loading: false,
    };
  }

  componentDidMount() {
    const { card } = this.state;
    if (card.occurrenceCount > 0 || card.filters.length > 0) {
      this._query();
    }
  }

  componentWillUnmount() {
    this.shouldFetch = false;
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
        <View style={[StyleSheet.styles.discoveryCenter.leftContainer, {borderRightWidth: 0}]}>
          <DeleteButton onPress={this.props.onPressDelete} />
        </View>
        <View style={[StyleSheet.styles.discoveryCenter.rightContainer, {justifyContent: 'flex-end'}]}>
          <DuplicateButton onPress={this._onPressDuplicate} />
          <ShareButton onPress={this._onPressShare} />
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
        ref="chartview"
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
    const { card } = this.state;
    return (
      <FilterItems
        card={card}
        filters={card.filters}
        onPressDeleteFilter={(filter) => this._deleteFilter(filter)}
        onPressEditFilter={this._onPressEditFilter}
        onPressFilterType={this._onPressFilterType}
      />
    );
  };

  _renderReadButton = () => {
    const { card } = this.state;
    const occurrenceCount = card.occurrenceCount;
    const filterCount = card.filters.length;
    if (occurrenceCount == 0 || filterCount == 0) return null;

    const title = (occurrenceCount >= BookSourceOccurrence.MAXIMUM_NUMBER_OF_DISPLAYABLE_OCCURRENCES ? Localizable.t('explore-passages.text') : Localizable.t('explore-passages.count', {count: occurrenceCount, localizedCount: Localizable.toNumber(occurrenceCount, {precision: 0})}));

    const wordCount = this._renderWordCount();

    return (
      <View>
        <TouchableOpacity style={styles.readButton} onPress={this._onPressOccurrences}>
          <Text style={styles.readButtonTitle}>{title}</Text>
        </TouchableOpacity>
        {wordCount}
      </View>
    );
  };

  _renderWordCount = () => {
    const { card, wordCount } = this.state;

    const wordFilter = card.filters.find(filter => filter.type === 'word');
    if (wordFilter) {
      return (
        <View style={styles.countContainer}>
          <Text style={styles.countTitleBold}>{wordFilter.word}</Text><Text style={styles.countTitle}>occurs {wordCount || 0} times</Text>
        </View>
      );
    }

    return null;
  };

  _onPressDuplicate = () => {
    if (this.props.onPressDuplicate) {
      this.props.onPressDuplicate(this.state.card);
    }
  }

  _onPressShare = () => {
    const viewRef = this.refs.chartview.refs.chart;
    RNViewShot.takeSnapshot(viewRef, {
      format: "jpeg",
      quality: 0.8
    })
    .then(
      uri => console.log("Image saved to", uri),
      error => console.error("Oops, snapshot failed", error)
    );
  }

  _onPressChartType = (chartType: string) => {
    this._animateLayout();

    const card = {
      ...this.state.card,
      chartType
    }
    this.setState({card});
    Discovery.record(card);
  };

  _onPressFilterType = (route: Object) => {
    if (this.props.onShowPopover) {
      const { card } = this.state;
      this.props.onShowPopover({card, route}, (card) => {
        this._animateLayout();
        this.setState({card, loading: true}, this._query);
        Discovery.record(card);
      });
    }
  };

  _onPressChartAxis = (route: Object) => {
    if (this.props.onShowPopover) {
      const { card } = this.state;
      this.props.onShowPopover({card, route}, (card) => {
        this._animateLayout();
        this.setState({card, loading: true}, this._query);
        Discovery.record(card);
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
        this.setState({card, loading: true}, this._query);
        Discovery.record(card);
      });
    }
  };

  _addFilter = (filter: Object) => {
    const filters = [
      ...this.state.card.filters,
      filter
    ];

    const card = {
      ...this.state.card,
      filters
    };

    this._animateLayout();
    this.setState({card});
    Discovery.record(card);
  };

  _deleteFilter = (filter: Object) => {
    const filters = this.state.card.filters;
    filters.splice(filters.indexOf(filter), 1);

    const card = {
      ...this.state.card,
      filters
    };

    this._animateLayout();
    this.setState({card, loading: true}, this._query);
    Discovery.record(card);
  };

  async _query(): any {
    const query = new Query(this.state.card);
    const occurrenceCount = await query.count();
    const wordCount = await query.wordCount();

    const card = {
      ...this.state.card,
      occurrenceCount,
    };
    Discovery.record(card);

    if (this.shouldFetch) {
      this.setState({card, data: null, wordCount, loading: occurrenceCount > 0}, () => {
        if (occurrenceCount > 0) {
          query.data().then(data => {
            if (this.shouldFetch) {
              this._animateLayout();

              this.setState({
                data,
                loading: false
              });
            }
          });
        }
      });
    }
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
    elevation: 2,
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
    marginTop: 20,
    marginBottom: 40,
    justifyContent: 'center',
  },
  readButtonTitle: {
    color: Colors.tint,
    fontSize: 18,
    marginHorizontal: 30,
    marginTop: -2,
  },
  activityIndicator: {
    position: 'absolute',
    top: 180,
    left: 0,
    right: 0,
  },
  countContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -30,
    paddingBottom: 30,
  },
  countTitle: {
    color: '#9B9B9B',
  },
  countTitleBold: {
    fontWeight: 'bold',
    color: '#9B9B9B',
    marginRight: 5,
  },
});
