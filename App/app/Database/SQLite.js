import SQLite from 'react-native-sqlite-storage';

import Predicate from './Predicate';
import ComparisonPredicate from './ComparisonPredicate';
import CompoundPredicate from './CompoundPredicate';
import WordPredicate from './WordPredicate';

// let tables = predicate.tables.filter(table => table !== 'statements');
// if (options && options.tables) {
//   tables = [...new Set(tables.concat(options.tables))];
// }
// const fromSQL = tables.map(table => `INNER JOIN ${table} ON statements.id = ${table}.statement_id`).join(' ');

export function fromWithPredicate(predicate: Predicate) {
  const tables = predicate.tables;
  const sourcesTables = [];




}

module.exports = SQLite.openDatabase({name : "SourceView", readOnly: true, createFromLocation : "~Datasets/en/NLT/SourceView.sqlite3"});
