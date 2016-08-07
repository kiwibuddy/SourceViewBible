/* @flow */
'use strict';

import Predicate from './Predicate';

export default class CompoundPredicate extends Predicate {
  type: string;
  subpredicates: Array<Predicate>;

  constructor(type: string, subpredicates: Array<Predicate>) {
    super();

    this.type = type;
    this.subpredicates = subpredicates;
  }

  static andPredicateWithSubpredicates(subpredicates: Array<Predicate>) {
    return new CompoundPredicate('and', subpredicates);
  }

  static orPredicateWithSubpredicates(subpredicates: Array<Predicate>) {
    return new CompoundPredicate('or', subpredicates);
  }

  get predicateFormat(): string {
    return '(' + this.subpredicates.map(predicate => predicate.predicateFormat).join(` ${this.type.toUpperCase()} `) + ')';
  }
}
