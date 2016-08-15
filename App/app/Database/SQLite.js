import SQLite from 'react-native-sqlite-storage';

import Predicate from './Predicate';
import ComparisonPredicate from './ComparisonPredicate';
import CompoundPredicate from './CompoundPredicate';
import WordPredicate from './WordPredicate';

const database = SQLite.openDatabase({name : "SourceView", readOnly: true, createFromLocation : "~Datasets/en/NLT/SourceView.sqlite3"});
export default database;

export async function rowsWithSQL(sql: string, params?: any) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(sql, params, (tx, results) => {
          let rows = results.rows.raw();
          resolve(rows);
      });
    });
  });
}
