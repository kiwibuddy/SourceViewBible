/* @flow */
'use strict';

import { Chronology, SQLite, ComparisonPredicate, CompoundPredicate, Predicate, rowsWithSQL } from '../../Database';

class SelectStatement {
  prefix: string;
  columns: Array<string>;

  constructor(prefix: ?string) {
    this.prefix = prefix || 'SELECT';
    this.columns = [];
  }

  select(column: string) {
    this.columns = [...this.columns, column].filter((elem, pos, arr) => arr.indexOf(elem) == pos);
  }

  toSQL() {
    return `${this.prefix} ${this.columns.join(', ')}`;
  }
}

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

class GroupByStatement {
  prefix: string;
  columns: Array<string>;

  constructor(prefix: ?string) {
    this.prefix = prefix || 'GROUP BY';
    this.columns = [];
  }

  groupBy(column: string) {
    this.columns = [...this.columns, column].filter((elem, pos, arr) => arr.indexOf(elem) == pos);
  }

  toSQL() {
    return `${this.prefix} ${this.columns.join(', ')}`;
  }
}

class OrderByStatement {
  prefix: string;
  columns: Array<string>;

  constructor(prefix: ?string) {
    this.prefix = prefix || 'ORDER BY';
    this.columns = [];
  }

  orderBy(column: string) {
    this.columns = [...this.columns, column].filter((elem, pos, arr) => arr.indexOf(elem) == pos);
  }

  toSQL() {
    return `${this.prefix} ${this.columns.join(', ')}`;
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

  async data() {
    const dataSQL = this._dataSQL();
    console.log(dataSQL);

    // const rows = await rowsWithSQL(sql);
    // console.log(rows);
    return []
  }

  _sql(select: string, options: ?Object) {
    const sql = [select, this.fromClause.toSQL()];

    const whereSQL = this.whereClause.toSQL();
    if (whereSQL.length > 0) sql.push(whereSQL);

    if (options && options.groupBy) sql.push(options.groupBy);
    if (options && options.orderBy) sql.push(options.orderBy);

    return sql.join(' ');
  }

  _dataSQL() {
    const xAxis = this.axis[0];
    const yAxis = this.axis[1];
    const zAxis = this.axis[2];

    const selectStatement = new SelectStatement();
    const groupByStatement = new GroupByStatement();
    const orderByStatement = new OrderByStatement();

    let xAxisActantType = null;
    switch (xAxis.actantType) {
      case 'source':
        xAxisActantType = 'speaker'
        break;

      case 'recipient':
        xAxisActantType = 'listener';
        break;

      default:
        xAxisActantType = 'someone';
        break;
    }

    switch (xAxis.type) {
      case 'book':
        selectStatement.select('bso.book_id AS id');
        groupByStatement.groupBy('bso.book_id');
        break;

      case 'chronology':
        selectStatement.select('chronologies.chronology_id AS id');
        groupByStatement.groupBy('chronologies.chronology_id');
        break;

      case 'name':
        selectStatement.select(`${xAxisActantType}.id AS id`);
        groupByStatement.groupBy(`${xAxisActantType}.id`);
        break;

      case 'gender':
        selectStatement.select(`${xAxisActantType}.gender_id AS id`);
        groupByStatement.groupBy(`${xAxisActantType}.gender_id`);
        break;

      case 'nature':
        selectStatement.select(`${xAxisActantType}_natures.id AS id`);
        groupByStatement.groupBy(`${xAxisActantType}_natures.id`);
        break;

      case 'profession':
        selectStatement.select(`${xAxisActantType}_professions.id AS id`);
        groupByStatement.groupBy(`${xAxisActantType}_professions.id`);
        break;

      case 'role':
        selectStatement.select('bso.role_id AS id');
        groupByStatement.groupBy('bso.role_id');
        break;

      case 'sphere':
        selectStatement.select('spheres.sphere_id AS id');
        groupByStatement.groupBy('spheres.sphere_id');
        break;
    }

    let yAxisActantType = null;
    switch (yAxis.actantType) {
      case 'source':
        yAxisActantType = 'speaker'
        break;

      case 'recipient':
        yAxisActantType = 'listener';
        break;

      default:
        yAxisActantType = 'someone';
        break;
    }
    switch (yAxis.type) {
      case 'book':
        selectStatement.select('COUNT(DISTINCT bso.book_id) AS count');
        break;

      case 'chronology':
        selectStatement.select('COUNT(DISTINCT chronologies.chronology_id) AS count');
        break;

      case 'name':
        selectStatement.select(`COUNT(DISTINCT ${yAxisActantType}.id) AS count`);
        break;

      case 'gender':
        selectStatement.select(`COUNT(DISTINCT ${yAxisActantType}.gender_id) AS count`);
        break;

      case 'nature':
        selectStatement.select(`COUNT(DISTINCT ${yAxisActantType}_natures.id) AS count`);
        break;

      case 'profession':
        selectStatement.select(`COUNT(DISTINCT ${yAxisActantType}_professions.id) AS count`);
        break;

      case 'role':
        selectStatement.select('COUNT(DISTINCT bso.role_id) AS count');
        break;

      case 'sphere':
        selectStatement.select('COUNT(DISTINCT spheres.sphere_id) AS count');
        break;

      case 'words':
        if (xAxis.type === 'sphere') {
          selectStatement.select('SUM(spheres.word_count) AS count');
        } else {
          selectStatement.select('SUM(bso.word_count) AS count');
        }
    }




    orderByStatement.orderBy('count DESC');

    return this._sql(selectStatement.toSQL(), {groupBy: groupByStatement.toSQL(), orderBy: orderByStatement.toSQL()});
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
              fromClause.join('INNER JOIN natures AS someone_natures ON everyone.actant_id = someone_natures.actant_id');
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
              fromClause.join('INNER JOIN professions AS someone_professions ON everyone.actant_id = someone_professions.actant_id');
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
