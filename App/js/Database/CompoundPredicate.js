/* @flow */
'use strict';

import Predicate from './Predicate';
import WordPredicate from './WordPredicate';

export default class CompoundPredicate extends Predicate {
  type: string;
  subpredicates: Array<any>;

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
    const subpredicates = this.subpredicates.filter(predicate => !(predicate instanceof WordPredicate));
    if (subpredicates.length == 0) return '';
    return '(' + subpredicates.map(predicate => predicate.predicateFormat).join(' ' + this.type.toUpperCase() + ' ') + ')';
  }

  get empty(): boolean {
    return this.subpredicates.length == 0;
  }
}
