/* @flow */
'use strict';

export default class Predicate {
  query: string;
  args: Array<any>;

  constructor(props: any) {
    if (props) {
      const { query, args } = props;
      this.query = query;
      this.args = args;
    }
  }

  get predicateFormat(): string {
    let predicateFormat = this.query;

    let index = 0;
    for (let arg of this.args) {
      let value = typeof arg == 'string' || arg instanceof String ? "'" + arg + "'" : arg;
      if (Array.isArray(value)) {
        value = '(' + value.join(',') + ')';
      }
      predicateFormat = predicateFormat.replace('$' + index, value);
      index++;
    }
    return '(' + predicateFormat + ')';
  }

  get empty(): boolean {
    return !this.query;
  }
}
