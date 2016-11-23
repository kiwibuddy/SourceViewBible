/* @flow */
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';

import {
  Localizable,
  StyleSheet
} from '../../Common';

import { BACK, readerURL } from '../../Navigation';
import { Toolbar, ToolbarButton } from '../../Components/Navigation';

type Props = {
  book: Object,
  navigate: Function,
  occurrenceIndex: number,
  occurrences: any,
  occurrencesRoute: Object,
  onNavigate: Function,
  onPressDone: Function,
};

type State = {
  occurrenceIndex: number,
}

export default class OccurrenceToolbar extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      occurrenceIndex: props.occurrenceIndex
    };
  }

  render() {
    const { occurrences, occurrencesRoute, onNavigate } = this.props;
    const { occurrenceIndex } = this.state;

    const current = occurrenceIndex + 1;
    const total = occurrences.length;

    const occurrence = occurrences[occurrenceIndex];
    let currentRoute = null;
    if (occurrence) {
      const book = occurrence.book;
      const bsoReference = Localizable.t('bso-reference', {book: book.name, source: occurrence.name, number: occurrence.number});
      currentRoute = readerURL({bookID: book.id, anchor: `occurrence-${occurrence.firstMonad}`, title: book.name, description: bsoReference});
    }

    let previousOccurrence = null;
    let previousRoute = null;
    if (occurrenceIndex > 0) {
      const previousOccurrenceIndex = occurrenceIndex - 1;
      previousOccurrence = occurrences[previousOccurrenceIndex];
      const book = previousOccurrence.book;
      const bsoReference = Localizable.t('bso-reference', {book: book.name, source: previousOccurrence.name, number: previousOccurrence.number});
      previousRoute = readerURL({bookID: book.id, anchor: `occurrence-${previousOccurrence.firstMonad}`, title: book.name, description: bsoReference, occurrenceIndex: previousOccurrenceIndex, occurrences, occurrencesRoute});
    }

    let nextOccurrence = null;
    let nextRoute = null;
    if (occurrenceIndex < total - 1) {
      const nextOccurrenceIndex = occurrenceIndex + 1;
      nextOccurrence = occurrences[nextOccurrenceIndex];
      const book = nextOccurrence.book;
      const bsoReference = Localizable.t('bso-reference', {book: book.name, source: nextOccurrence.name, number: nextOccurrence.number});
      nextRoute = readerURL({bookID: book.id, anchor: `occurrence-${nextOccurrence.firstMonad}`, title: book.name, description: bsoReference, occurrenceIndex: nextOccurrenceIndex, occurrences, occurrencesRoute});
    }

    return (
      <Toolbar>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <ToolbarButton
            disabled={previousOccurrence == null}
            imageSource={require('../../Images/common/previous.png')}
            onPress={() => {
              if (previousOccurrence) {
                if (this.props.book.id === previousOccurrence.book.id) {
                  onNavigate(previousOccurrence);
                } else if (previousRoute) {
                  this._navigate(previousRoute);
                }

                this.setState({occurrenceIndex: occurrenceIndex - 1});
              }
            }}
            style={{width: 30, height: 30}}
          />
          <ToolbarButton
            disabled={nextOccurrence == null}
            imageSource={require('../../Images/common/next.png')}
            onPress={() => {
              if (nextOccurrence) {
                if (this.props.book.id === nextOccurrence.book.id) {
                  onNavigate(nextOccurrence);
                } else if (nextRoute) {
                  this._navigate(nextRoute);
                }

                this.setState({occurrenceIndex: occurrenceIndex + 1});
              }
            }}
            style={{width: 30, height: 30}}
          />
        </View>
        <ToolbarButton
          title={Localizable.t('range-of', {current, total})}
          onPress={() => this._onPressOccurrences(currentRoute)}
          style={{marginLeft: -10}}
        />
        <ToolbarButton
          title={Localizable.t('done')}
          titleStyle={StyleSheet.styles.navigationBar.doneButtonTitle}
          onPress={this.props.onPressDone}
          style={{paddingHorizontal: 0, marginHorizontal: 0, marginRight: -20}}
        />
      </Toolbar>
    );
  }

  _navigate = (route: Object) => {
    const options = (route !== BACK ? {replace: true} : null);
    this.props.navigate(route, options);
  };

  _onPressOccurrences = (currentRoute) => {
    const { occurrenceIndex, occurrences, occurrencesRoute } = this.props;

    occurrencesRoute.onPressBack = () => {
      this._navigate({...currentRoute, occurrenceIndex, occurrences, occurrencesRoute});
    }
    this._navigate(occurrencesRoute);
  }
}
