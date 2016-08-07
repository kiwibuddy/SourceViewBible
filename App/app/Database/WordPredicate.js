/* @flow */
'use strict';

import ComparisonPredicate from './Predicate';

export default class WordPredicate extends ComparisonPredicate {
  word: string;

  constructor(word: string) {
    super('word', '=', word);
    this.word = word;
  }

  static predicateWithWord(word: string) {
    return new WordPredicate(word);
  }
}
