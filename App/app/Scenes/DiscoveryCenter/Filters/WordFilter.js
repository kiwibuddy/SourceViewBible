/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../../Common';

import { booksFilterURL } from '../../../Navigation';
import { cardWithFilter } from './FilterUtils';
import { Book } from '../../../Database';

function filterWord(filter: Object, word: string) {
  return ({
    id: 'filter-' + Date.now(),
    type: 'word',
    ...filter,
    word
  });
}

type Props = {
  card: Object,
  filter: Object,
  navigate: Function,
  onDone: Function,
};

type State = {
  word: string,
};

class WordFilter extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      word: props.filter && props.filter.word
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          autoCapitalize="words"
          autoCorrect={false}
          autoFocus={true}
          clearButtonMode="always"
          onChangeText={(text) => this.setState({word: text})}
          onSubmitEditing={(text) => this.props.onDone(cardWithFilter(this.props.card, filterWord(this.props.filter, this.state.word)))}
          placeholder="Word"
          style={styles.textInput}
          value={this.state.word}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    fontSize: 14,
    backgroundColor: '#ececec',
    borderColor: '#ececec',
    borderRadius: 3,
    borderWidth: 1,
    paddingLeft: 8,
    marginHorizontal: 8,
    marginVertical: 8,
    height: 26,
  },
});

export default WordFilter;
