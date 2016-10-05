/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ActivityIndicator,
  AsyncStorage,
  BackAndroid,
  Platform,
  RecyclerViewBackedScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ListView } from '../../Components/Common/DatabaseListView';

import {
  Colors,
  Constants,
  StyleSheet,
  Localizable
} from '../../Common';

import { NavigationHeader, NavigationBarButton } from '../../Components/Navigation';

import { BACK, occurrencesURL, readerURL } from '../../Navigation';

import Emdros from '../../API/Emdros';
import { BookSourceOccurrence, Role } from '../../Database';
import Query from '../DiscoveryCenter/Query';

type Props = {
  occurrences: Object,
  navigate: Function,
  onPressBack: ?Function,
  backTitle: ?string,
};

type State = {
  dataSource: any,
  occurrences: any,
  loading: boolean
};

export default class Occurrences extends Component {
  props: Props;
  state: State;
  shouldFetch: boolean = true;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource,
      occurrences: this.props.occurrences,
      loading: true,
    };
  }

  componentDidMount() {
    this._getOccurrences();
    BackAndroid.addEventListener('hardwareBackPress', this._onHardwareBackPress);
  }

  componentWillUnmount() {
    this.shouldFetch = false;
    BackAndroid.removeEventListener('hardwareBackPress', this._onHardwareBackPress);
  }

  render() {
    const backTitle = this.props.backTitle ? this.props.backTitle : Localizable.t('close');
    const loadingView = this._renderLoading();

    return (
      <View style={styles.container}>
        <NavigationHeader
          navigate={this.props.navigate}
          title={Localizable.t('passages')}
          renderLeftComponent={(props: Object) => (<NavigationBarButton
            title={backTitle}
            titleStyle={StyleSheet.styles.navigationBar.doneButtonTitle}
            onPress={this._onPressBack}
          />)}
        />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          style={styles.content}
        />
        {loadingView}
      </View>
    );
  }

  _renderRow = (occurrence: Object, sectionID: any, rowID: any) => {
    const { occurrences, onPressBack } = this.props;
    const occurrenceIndex = parseInt(rowID);
    const number = occurrenceIndex + 1;
    const book = occurrence.book;
    const role = occurrence.role;

    const bcvReference = Localizable.t('bcv-reference', {book: book.name, reference: occurrence.reference});
    const bsoReference = Localizable.t('bso-reference', {book: book.name, source: occurrence.name, number: occurrence.number});
    const occurrencesRoute = occurrencesURL({title: Localizable.t('passages'), occurrences, onPressBack, modal: true});

    const route = readerURL({bookID: book.id, anchor: `source-${occurrence.name}-${occurrence.number}`, title: book.name, description: bsoReference, occurrenceIndex, occurrences, occurrencesRoute});

    return (
      <TouchableOpacity key={occurrence.id} style={styles.listItemContainer} onPress={() => this._navigate(route)}>
        <Text allowFontScaling={false} style={StyleSheet.styles.cell.occurrence}>{number}</Text>
        <View style={styles.listItem}>
          <Text numberOfLines={2} style={styles.body}>{occurrence.text}</Text>
          <View style={styles.referenceContainer}>
            <Text style={[StyleSheet.styles.cell.subtitle, {paddingRight: 8,}]}>{bcvReference}</Text>
            <Text style={[StyleSheet.styles.cell.subtitle, {color: Colors.sources[role.key].tint}]}>{Localizable.t('so-reference', {source: occurrence.name, number: occurrence.number})}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderLoading = () => {
    if (this.state.loading) {
      return (
        <ActivityIndicator color="gray" size="large" style={styles.activityIndicator} />
      );
    }

    return null;
  }

  async _getOccurrences() {
    let { occurrences } = this.state;
    const contents = {};

    for (let occurrence of occurrences) {
      const content = await Emdros.scripture({monadSet: occurrence.monadSet, stylesheet: 'occurrence'});
      contents[occurrence.id] = content;
    }

    occurrences = occurrences.map(occurrence => ({...occurrence, role: occurrence.role, reference: occurrence.reference, text: contents[occurrence.id]}));

    if (this.shouldFetch) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(occurrences),
        occurrences,
        loading: false
      });
    }
  };

  _navigate = (route: Object) => {
    this.props.navigate(route, {replace: true});
  };

  _onPressBack = () => {
    if (this.props.onPressBack) {
      this.props.onPressBack();
    } else {
      this.props.navigate(BACK);
    }
  };

  _onHardwareBackPress = () => {
    this._onPressBack();
    return true;
  };

 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  separator: {
    ...StyleSheet.styles.separator,
  },
  listItemContainer: {
    paddingLeft: 5,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 13,
    flexDirection: 'row',
  },
  listItem: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 5,
  },
  body: {
    fontFamily: 'Georgia',
    paddingBottom: 15,
    color: '#59626A',
    fontSize: 15,
    lineHeight: 24,
  },
  referenceContainer: {
    flexDirection: 'row',
  },
  activityIndicator: {
    position: 'absolute',
    top: 20,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
