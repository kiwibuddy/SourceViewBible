/* @flow */
'use strict';

import { Platform } from 'react-native';

import SQLite from 'react-native-sqlite-storage';

const createFromLocation = Platform.OS === 'android' ? '~/sourceview/Datasets/en/NLT/SourceView.sqlite3' : '~/Datasets/en/NLT/SourceView.sqlite3';

const database = SQLite.openDatabase({ name: 'en-NLT-SourceView.sqlite3', readOnly: true, createFromLocation });
export default database;

export async function rowsWithSQL(sql: string, params?: any) {
  let parameters = null;
  if (params) {
    if (!Array.isArray(params)) {
      parameters = [params];
    } else {
      parameters = params;
    }
  }

  return new Promise(resolve => {
    database.transaction(tx => {
      tx.executeSql(sql, parameters, (tx, results) => {
        let rows = results.rows.raw();
        resolve(rows);
      });
    });
  });
}
