/* @flow */
'use strict';

import Predicate from './Predicate';

export default class ComparisonPredicate extends Predicate {
  leftExpression: string;
  rightExpression: any;
  operatorType: string;

  constructor(leftExpression: string, operatorType: string, rightExpression: any) {
    const query = `${leftExpression} ${operatorType} $0`;
    const args = [rightExpression];
    super({ query, args });

    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
    this.operatorType = operatorType;
  }

  static predicateWith(leftExpression: string, operatorType: string, rightExpression: any) {
    return new ComparisonPredicate(leftExpression, operatorType, rightExpression);
  }
}
