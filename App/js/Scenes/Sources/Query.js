/* @flow */
'use strict';

import { Actant, Book, BookSourceOccurrence, rowsWithSQL } from '../../Database';

export default class Query {
  source: Actant;
  book: ?Book;

  constructor(source: Actant, book: ?Book) {
    this.source = source;
    this.book = book;
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
      WHERE ((listener.id = ?) ${where})
      GROUP BY speaker.id ORDER BY count DESC`;

    const rows = await rowsWithSQL(sql, this.source.id);
    return rows.map(row => {
      return {actant: Actant.findByID(row['id']), count: row['count']};
    });
  }

  async occurrences(listenerID: ?number) {
    const params = [this.source.id];
    let from = '';
    let where = (this.book ? ` AND (bso.first >= ${this.book.firstMonad}) AND (bso.last <= ${this.book.lastMonad})` : '');
    if (listenerID != null && listenerID > 0) {
      from += ' INNER JOIN bso_actants AS listeners ON (bso.id = listeners.bso_id AND listeners.type_id = 2)';
      where += ' AND (listeners.actant_id = ?)';
      params.push(listenerID);
    }

    const sql = `
    SELECT DISTINCT bso.id AS id
    FROM bso INNER JOIN bso_actants AS speakers ON (bso.id = speakers.bso_id AND speakers.type_id = 1)${from}
    WHERE ((speakers.actant_id = ?)${where})
    ORDER BY bso.id`;

    const rows = await rowsWithSQL(sql, params);
    return rows.map(row => BookSourceOccurrence.findByID(row['id']));
  }

  async books() {
    const sql = `
    SELECT DISTINCT bso.book_id AS id, COUNT(DISTINCT bso.id) AS count
    FROM bso INNER JOIN bso_actants AS speakers ON (bso.id = speakers.bso_id AND speakers.type_id = 1)
    WHERE ((speakers.actant_id = ?))
    GROUP BY bso.book_id
    ORDER BY bso.book_id`;

    const rows = await rowsWithSQL(sql, this.source.id);
    return rows.map(row => {
      return {book: Book.findByID(row['id']), count: row['count']};
    });
  }

}
