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

export default class OccurrenceToolbar extends Component {
  render() {
    const { book, occurrenceIndex, occurrences, occurrencesRoute } = this.props;

    const current = occurrenceIndex + 1;
    const total = occurrences.length;

    let currentRoute = null;
    const occurrence = occurrences[occurrenceIndex];
    if (occurrence) {
      const book = occurrence.book;
      const bsoReference = Localizable.t('bso-reference', {book: book.name, source: occurrence.name, number: occurrence.number});
      currentRoute = readerURL({bookID: book.id, anchor: `occurrence-${occurrence.firstMonad}`, title: book.name, description: bsoReference});
    }

    let previousRoute = null;
    if (occurrenceIndex > 0) {
      const previousOccurrenceIndex = occurrenceIndex - 1;
      const previousOccurrence = occurrences[previousOccurrenceIndex];
      const book = previousOccurrence.book;
      const bsoReference = Localizable.t('bso-reference', {book: book.name, source: previousOccurrence.name, number: previousOccurrence.number});
      previousRoute = readerURL({bookID: book.id, anchor: `occurrence-${previousOccurrence.firstMonad}`, title: book.name, description: bsoReference, occurrenceIndex: previousOccurrenceIndex, occurrences, occurrencesRoute});
    }

    let nextRoute = null;
    if (occurrenceIndex < total - 1) {
      const nextOccurrenceIndex = occurrenceIndex + 1;
      const nextOccurrence = occurrences[nextOccurrenceIndex];
      const book = nextOccurrence.book;
      const bsoReference = Localizable.t('bso-reference', {book: book.name, source: nextOccurrence.name, number: nextOccurrence.number});
      nextRoute = readerURL({bookID: book.id, anchor: `occurrence-${nextOccurrence.firstMonad}`, title: book.name, description: bsoReference, occurrenceIndex: nextOccurrenceIndex, occurrences, occurrencesRoute});
    }

    return (
      <Toolbar style={{zIndex: 100}}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <ToolbarButton
            disabled={previousRoute == null}
            imageSource={require('../../Images/common/previous.png')}
            onPress={() => previousRoute && this._navigate(previousRoute)}
            style={{width: 30, height: 30}}
          />
          <ToolbarButton
            disabled={nextRoute == null}
            imageSource={require('../../Images/common/next.png')}
            onPress={() => nextRoute && this._navigate(nextRoute)}
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
          onPress={() => currentRoute && this._navigate(currentRoute)}
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
