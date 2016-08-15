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

export function fromWithPredicate(predicate: Predicate, options: ?Object) {
  let tables = predicate.tables;
  if (options && options.tables) tables = [...new Set(tables.concat(options.tables))];

  const fromTables = [];
  for (let actantType of ['source', 'recipient']) {
    if (tables.find(table => table === actantType || table.startsWith(`${actantType}_`) || (actantType === 'source' && table === 'spheres')) !== undefined) {
      fromTables.push(`INNER JOIN ${actantType}_actants ON sources.id = ${actantType}_actants.source_id`);

      if (tables.indexOf(actantType) != -1) {
        fromTables.push(`INNER JOIN actants AS ${actantType} ON ${actantType}.id = ${actantType}_actants.actant_id`);
      }

      if (tables.indexOf(`${actantType}_natures`) != -1) {
        fromTables.push(`INNER JOIN natures AS ${actantType}_natures ON ${actantType}_actants.actant_id = ${actantType}_natures.actant_id`);
      }

      if (tables.indexOf(`${actantType}_professions`) != -1) {
        fromTables.push(`INNER JOIN professions AS ${actantType}_professions ON ${actantType}_actants.actant_id = ${actantType}_professions.actant_id`);
      }

      if (actantType === 'source' && tables.indexOf('spheres') != -1) {
        fromTables.push('INNER JOIN spheres ON source_actants.actant_id = spheres.source_actant_id');
      }
    }
  }

  if (tables.indexOf('chronologies') != -1) {
    fromTables.push(`INNER JOIN source_actants ON sources.id = source_actants.source_id`);
    fromTables.push(`INNER JOIN recipient_actants ON sources.id = recipient_actants.source_id`);
    fromTables.push('INNER JOIN chronologies ON (source_actants.actant_id = chronologies.actant_id OR recipient_actants.actant_id = chronologies.actant_id)');
  }

  const fromSQL = `FROM sources ${[...new Set(fromTables)].join(' ')}`;
  return fromSQL;
}

export async function valuesByWordCount(value: string, predicate: Predicate) {
  const fromSQL = fromWithPredicate(predicate, {tables: ['source_actants']});
  const whereSQL = (predicate.predicateFormat.length > 0 ? `WHERE ${predicate.predicateFormat}` : '');
  const sql = `SELECT ${value} AS id, SUM(source_actants.word_count) AS count ${fromSQL} ${whereSQL} GROUP BY ${value} ORDER BY count DESC`;
  const rows = await rowsWithSQL(sql);
  return rows;
}
