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

  static predicateWithFormat(query: string, ...args: any) {
    const props = {
      query,
      args: Array.prototype.slice.call(args)
    };
    return new Predicate(props);
  }

  get predicateFormat(): string {
    let predicateFormat = this.query;

    let index = 0;
    for (let arg of this.args) {
      const value = (typeof arg == 'string' || arg instanceof String) ? `'${arg}'` : arg;
      predicateFormat = predicateFormat.replace('$' + index, value);
      index++;
    }
    return '(' + predicateFormat + ')';
  }
}
