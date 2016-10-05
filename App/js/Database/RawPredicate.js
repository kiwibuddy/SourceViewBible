/* @flow */
'use strict';

import Predicate from './Predicate';

export default class RawPredicate extends Predicate {

  constructor(query: string, args: any) {
    super({query, args});
  }

  static predicateWith(query: string, args: any) {
    return new RawPredicate(query, args);
  }
}
