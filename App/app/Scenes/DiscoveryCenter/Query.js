/* @flow */
'use strict';

import { Chronology, SQLite, ComparisonPredicate, CompoundPredicate, Predicate, rowsWithSQL } from '../../Database';


class FromClause {
  prefix: string;
  joins: Array<string>;

  constructor(prefix: string) {
    this.prefix = prefix;
    this.joins = [];
  }

  join(join: string) {
    this.joins = [...this.joins, join].filter((elem, pos, arr) => arr.indexOf(elem) == pos);
  }

  toSQL() {
    return `${this.prefix} ${this.joins.join(' ')}`;
  }
}

class WhereClause {
  predicates: Array<Predicate>;

  constructor() {
    this.predicates = [];
  }

  where(predicate: any) {
    this.predicates = [...this.predicates, predicate].filter((elem, pos, arr) => arr.indexOf(elem) == pos);
  }

  toSQL() {
    if (this.predicates.length == 0) return '';
    const predicate = CompoundPredicate.andPredicateWithSubpredicates(this.predicates);
    return `WHERE ${predicate.predicateFormat}`;
  }
}

type Props = {
  filters: any,
  xAxis: any,
  yAxis: any,
  zAxis: any
};

export default class Query {
  filters: any;
  axis: Array<Object>;

  fromClause: FromClause;
  whereClause: WhereClause;

  constructor(props: Props) {
    this.filters = props.filters;

    const axis = [];
    if (props.xAxis) axis.push(props.xAxis);
    if (props.yAxis) axis.push(props.yAxis);
    if (props.zAxis) axis.push(props.zAxis);
    this.axis = axis;

    this._buildFromClause();
    this._buildWhereClause();
  }

  async count() {
    const sql = this._sql('SELECT COUNT(DISTINCT bso.id) AS count');
    console.log(sql);

    const rows = await rowsWithSQL(sql);
    console.log(rows);
    return rows[0]['count'];
  }

  _sql(select: string, options: ?Object) {
    const sql = [select, this.fromClause.toSQL()];

    const whereSQL = this.whereClause.toSQL();
    if (whereSQL.length > 0) sql.push(whereSQL);

    if (options && options.groupBy) sql.push(options.groupBy);
    if (options && options.orderBy) sql.push(options.orderBy);

    return sql.join(' ');
  }

  _buildFromClause() {
    const fromClause = new FromClause('FROM bso');

    const items = [...this.axis, ...this.filters];
    items.forEach(item => {
      switch(item.type) {
        case 'actant':
        case 'actant-number':
        case 'gender':
        case 'name':
          switch (item.actantType) {
            case 'source':
              fromClause.join('INNER JOIN bso_actants AS speakers ON (bso.id = speakers.bso_id AND speakers.type_id = 1)');
              fromClause.join('INNER JOIN actants AS speaker ON speaker.id = speakers.actant_id');
              break;

            case 'recipient':
              fromClause.join('INNER JOIN bso_actants AS listeners ON (bso.id = listeners.bso_id AND listeners.type_id = 2)');
              fromClause.join('INNER JOIN actants AS listener ON listener.id = listeners.actant_id');
              break;

            default: // Not needed by filter but needed by axis
              fromClause.join('INNER JOIN bso_actants AS everyone ON bso.id = everyone.bso_id');
              fromClause.join('INNER JOIN actants AS someone ON someone.id = everyone.actant_id');
              break;
          }
          break;

        case 'book':
        case 'book-range':
        case 'role':
          // Nothing needed as book, book-range, and role are on the bso table
          break;

        case 'chronology':
        case 'chronology-range':
          fromClause.join('INNER JOIN bso_actants AS everyone ON bso.id = everyone.bso_id');
          fromClause.join('INNER JOIN chronologies ON everyone.actant_id = chronologies.actant_id');
          break;

        case 'nature':
          switch (item.actantType) {
            case 'source':
              fromClause.join('INNER JOIN bso_actants AS speakers ON (bso.id = speakers.bso_id AND speakers.type_id = 1)');
              fromClause.join('INNER JOIN natures AS speakers_natures ON speakers.actant_id = speakers_natures.actant_id');
              break;

            case 'recipient':
              fromClause.join('INNER JOIN bso_actants AS listeners ON (bso.id = listeners.bso_id AND listeners.type_id = 2)');
              fromClause.join('INNER JOIN natures AS listeners_natures ON listeners.actant_id = listeners_natures.actant_id');
              break;

            default: // Not needed by filter but needed by axis
              fromClause.join('INNER JOIN bso_actants AS everyone ON bso.id = everyone.bso_id');
              fromClause.join('INNER JOIN natures ON everyone.actant_id = natures.actant_id');
              break;
          }
          break;

        case 'profession':
          switch (item.actantType) {
            case 'source':
              fromClause.join('INNER JOIN bso_actants AS speakers ON (bso.id = speakers.bso_id AND speakers.type_id = 1)');
              fromClause.join('INNER JOIN professions AS speakers_professions ON speakers.actant_id = speakers_professions.actant_id');
              break;

            case 'recipient':
              fromClause.join('INNER JOIN bso_actants AS listeners ON (bso.id = listeners.bso_id AND listeners.type_id = 2)');
              fromClause.join('INNER JOIN professions AS listeners_professions ON listeners.actant_id = listeners_professions.actant_id');
              break;

            default: // Not needed by filter but needed by axis
              fromClause.join('INNER JOIN bso_actants AS everyone ON bso.id = everyone.bso_id');
              fromClause.join('INNER JOIN professions ON everyone.actant_id = professions.actant_id');
              break;
          }
          break;

        case 'sphere':
          fromClause.join('INNER JOIN spheres ON bso.id = spheres.bso_id');
          break;
      }
    });

    this.fromClause = fromClause;
  }

  _buildWhereClause() {
    const whereClause = new WhereClause();

    this.filters.forEach(filter => {
      let actantType = '';
      switch (filter.actantType) {
        case 'source':
          actantType = 'speaker'
          break;

        case 'recipient':
          actantType = 'listener';
          break;
      }

      switch(filter.type) {
        case 'actant':
          whereClause.where(ComparisonPredicate.predicateWith(`${actantType}.id`, '=', filter.actant.id));
          break;

        case 'actant-number':
          whereClause.where(ComparisonPredicate.predicateWith(`${actantType}.actant_number_id`, '=', filter.actantNumber.id));
          break;

        case 'book':
          whereClause.where(ComparisonPredicate.predicateWith('bso.first', '>=', filter.book.firstMonad));
          whereClause.where(ComparisonPredicate.predicateWith('bso.last', '<=', filter.book.lastMonad));
          break;

        case 'book-range':
          whereClause.where(ComparisonPredicate.predicateWith('bso.first', '>=', filter.books.from.firstMonad));
          whereClause.where(ComparisonPredicate.predicateWith('bso.last', '<=', filter.books.to.lastMonad));
          break;

        case 'chronology':
          whereClause.where(ComparisonPredicate.predicateWith('chronologies.chronology_id', '=', filter.chronology.id));
          break;

        case 'chronology-range':
          const chronologies = Chronology.whereInRange(filter.chronologies.from, filter.chronologies.to).map(chronology => chronology.id);
          whereClause.where(ComparisonPredicate.predicateWith('chronologies.chronology_id', 'IN', chronologies));
          break;

        case 'gender':
          whereClause.where(ComparisonPredicate.predicateWith(`${actantType}.gender_id`, '=', filter.gender.id));
          break;

        case 'nature':
          whereClause.where(ComparisonPredicate.predicateWith(`${actantType}_natures.nature_id`, '=', filter.nature.id));
          break;

        case 'profession':
          whereClause.where(ComparisonPredicate.predicateWith(`${actantType}_professions.profession_id`, '=', filter.profession.id));
          break;

        case 'role':
          whereClause.where(ComparisonPredicate.predicateWith(`bso.role_id`, '=', filter.role.id));
          break;

        case 'sphere':
          const SPHERES = ["family", "economics", "government", "religion", "education", "communication", "celebration"];
          const sphereID = SPHERES.indexOf(filter.sphere.id) + 1;
          whereClause.where(ComparisonPredicate.predicateWith('spheres.sphere_id', '=', sphereID));
          break;
      }
    });

    this.whereClause = whereClause;
  }
}
