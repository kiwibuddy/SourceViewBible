/* @flow */
'use strict';

import { Actant, Book, rowsWithSQL } from '../../Database';

export default class Query {
  source: Actant;
  book: ?Book;

  constructor(source: Actant, book: ?Book) {
    this.source = source;
    this.book = book;
  }

  async bookCount() {
    const sql = `SELECT COUNT(DISTINCT bso.book_id) AS count FROM bso INNER JOIN bso_actants ON bso.id = bso_actants.bso_id WHERE bso_actants.actant_id = ?`;
    const rows = await rowsWithSQL(sql, this.source.id);
    return rows[0]['count'];
  }

  async spokeTo() {
    const where = (this.book ? `AND (bso.first >= ${this.book.firstMonad}) AND (bso.last <= ${this.book.lastMonad})` : '');
    const sql = `
      SELECT listener.id AS id, COUNT(bso.id) AS count
      FROM bso INNER JOIN bso_actants AS listeners ON (bso.id = listeners.bso_id AND listeners.type_id = 2)
        INNER JOIN actants AS listener ON listener.id = listeners.actant_id
        INNER JOIN bso_actants AS speakers ON (bso.id = speakers.bso_id AND speakers.type_id = 1)
        INNER JOIN actants AS speaker ON speaker.id = speakers.actant_id
      WHERE ((speaker.id = ?) ${where})
      GROUP BY listener.id ORDER BY count DESC`;

    const rows = await rowsWithSQL(sql, this.source.id);
    console.log(rows);
    return rows.map(row => {
      return {actant: Actant.findByID(row['id']), count: row['count']};
    });
  }

  async listenedTo() {
    const where = (this.book ? `AND (bso.first >= ${this.book.firstMonad}) AND (bso.last <= ${this.book.lastMonad})` : '');
    const sql = `
      SELECT speaker.id AS id, COUNT(bso.id) AS count
      FROM bso INNER JOIN bso_actants AS speakers ON (bso.id = speakers.bso_id AND speakers.type_id = 1)
        INNER JOIN actants AS speaker ON speaker.id = speakers.actant_id
        INNER JOIN bso_actants AS listeners ON (bso.id = listeners.bso_id AND listeners.type_id = 2)
        INNER JOIN actants AS listener ON listener.id = listeners.actant_id
      WHERE ((listener.id = 304) ${where})
      GROUP BY speaker.id ORDER BY count DESC`;

    const rows = await rowsWithSQL(sql, this.source.id);
    console.log(rows);
    return rows.map(row => {
      return {actant: Actant.findByID(row['id']), count: row['count']};
    });
  }
}
