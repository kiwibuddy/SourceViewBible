/* @flow */
'use strict';

import Emdros from '../../API/Emdros';
import { Actant, Book, Chronology, Gender, Nature, Profession, Role, Sphere, SQLite, ComparisonPredicate, CompoundPredicate, Predicate, rowsWithSQL } from '../../Database';

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
    if (this.columns.length == 0) return '';
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
    if (this.columns.length == 0) return '';
    return `${this.prefix} ${this.columns.join(', ')}`;
  }
}

class EmdrosQuery {
  word: string
  monads: Array<Array<number>>;

  constructor(word: string, monads: Array<Array<number>>) {
    this.word = word;
    this.monads = monads;
  }

  async data() {
    const word = this.word.toLowerCase();
    const monads = this.monads;

    let options = null;
    if (monads && monads.length > 0) {
      options = {monads, tokenFeatureComparison: `surface_fts="${word}"`}
    } else {
      options = {tokenFeatureComparison: `surface_fts="${word}"`};
    }

    return Emdros.wordCountsForContext('Source', options);
  }
}

type Props = {
  filters: any,
  xAxis: any,
  yAxis: any,
  zAxis: any
};

export default class Query {
  prepared: boolean;
  filters: any;
  axis: Array<Object>;

  fromClause: FromClause;
  whereClause: WhereClause;

  emdrosData: any;

  constructor(props: Props) {
    this.prepared = false;
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
    await this._prepare();

    const sql = this._sql('SELECT COUNT(DISTINCT bso.id) AS count');
    const rows = await rowsWithSQL(sql);
    return rows[0]['count'];
  }

  async data() {
    await this._prepare();
    return await this._data();
  }

  async _prepare() {
    if (this.prepared) return;
    this.prepared = true;

    const wordFilter = this.filters.find(filter => filter.type === 'word');
    if (wordFilter) {
      let monads = null;

      // If we have more than just the word filter get the monads ranges
      if (this.filters.length > 1) {
        monads = await this._monads();
      }

      const query = new EmdrosQuery(wordFilter.word, monads);
      const data = await query.data();
      const identifiers = Object.keys(data).map(bsoID => parseInt(bsoID));

      if (identifiers.length > 0) {
        this.emdrosData = data;
        this.whereClause.where(ComparisonPredicate.predicateWith('bso.id', 'IN', identifiers));
      }
    }
  }

  async _monads() {
    const sql = this._sql('SELECT DISTINCT bso.id, bso.first, bso.last');
    const rows = await rowsWithSQL(sql);
    const monads = rows.map(row => [row['first'], row['last']]);
    return monads;
  }

  _sql(select: string, options: ?Object) {
    const sql = [select, this.fromClause.toSQL()];

    const whereSQL = this.whereClause.toSQL();
    if (whereSQL.length > 0) sql.push(whereSQL);

    if (options && options.groupBy) sql.push(options.groupBy);
    if (options && options.orderBy) sql.push(options.orderBy);

    return sql.join(' ');
  }

  async _data() {
    const xAxis = this.axis[0];
    const yAxis = this.axis[1];
    const zAxis = this.axis[2];
    if (!xAxis || !yAxis) return [];

    if (xAxis.type === 'words') {
      return this._words();
    } else if (zAxis && zAxis.type === 'words') {
      return [];
    }

    const selectStatement = new SelectStatement();
    const groupByStatement = new GroupByStatement();
    const orderByStatement = new OrderByStatement();

    let GroupByObjectClass = null;

    if (zAxis) {
      let zAxisActantType = null;
      switch (zAxis.actantType) {
        case 'source':
          zAxisActantType = 'speaker'
          break;

        case 'recipient':
          zAxisActantType = 'listener';
          break;

        default:
          zAxisActantType = 'someone';
          break;
      }
      switch (zAxis.type) {
        case 'book':
          selectStatement.select('bso.book_id AS zid');
          groupByStatement.groupBy('bso.book_id');
          orderByStatement.orderBy('bso.book_id');
          GroupByObjectClass = Book;
          break;

        case 'chronology':
          selectStatement.select('chronologies.chronology_id AS zid');
          groupByStatement.groupBy('chronologies.chronology_id');
          orderByStatement.orderBy('chronologies.chronology_id');
          GroupByObjectClass = Chronology;
          break;

        case 'name':
          selectStatement.select(`${zAxisActantType}.id AS zid`);
          groupByStatement.groupBy(`${zAxisActantType}.id`);
          orderByStatement.orderBy(`${zAxisActantType}.id`);
          GroupByObjectClass = Actant;
          break;

        case 'gender':
          selectStatement.select(`${zAxisActantType}.gender_id AS zid`);
          groupByStatement.groupBy(`${zAxisActantType}.gender_id`);
          orderByStatement.orderBy(`${zAxisActantType}.gender_id`);
          GroupByObjectClass = Gender;
          break;

        case 'nature':
          selectStatement.select(`${zAxisActantType}_natures.nature_id AS zid`);
          groupByStatement.groupBy(`${zAxisActantType}_natures.nature_id`);
          orderByStatement.orderBy(`${zAxisActantType}_natures.nature_id`);
          GroupByObjectClass = Nature;
          break;

        case 'profession':
          selectStatement.select(`${zAxisActantType}_professions.profession_id AS zid`);
          groupByStatement.groupBy(`${zAxisActantType}_professions.profession_id`);
          orderByStatement.orderBy(`${zAxisActantType}_professions.profession_id`);
          GroupByObjectClass = Profession;
          break;

        case 'role':
          selectStatement.select('bso.role_id AS zid');
          groupByStatement.groupBy('bso.role_id');
          orderByStatement.orderBy('bso.role_id');
          GroupByObjectClass = Role;
          break;

        case 'sphere':
          selectStatement.select('spheres.sphere_id AS zid');
          groupByStatement.groupBy('spheres.sphere_id');
          orderByStatement.orderBy('spheres.sphere_id');
          GroupByObjectClass = Sphere;
          break;
      }
    }

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

    let ObjectClass = null;
    switch (xAxis.type) {
      case 'book':
        selectStatement.select('bso.book_id AS id');
        groupByStatement.groupBy('bso.book_id');
        ObjectClass = Book;
        break;

      case 'chronology':
        selectStatement.select('chronologies.chronology_id AS id');
        groupByStatement.groupBy('chronologies.chronology_id');
        ObjectClass = Chronology;
        break;

      case 'name':
        selectStatement.select(`${xAxisActantType}.id AS id`);
        groupByStatement.groupBy(`${xAxisActantType}.id`);
        ObjectClass = Actant;
        break;

      case 'gender':
        selectStatement.select(`${xAxisActantType}.gender_id AS id`);
        groupByStatement.groupBy(`${xAxisActantType}.gender_id`);
        ObjectClass = Gender;
        break;

      case 'nature':
        selectStatement.select(`${xAxisActantType}_natures.nature_id AS id`);
        groupByStatement.groupBy(`${xAxisActantType}_natures.nature_id`);
        ObjectClass = Nature;
        break;

      case 'profession':
        selectStatement.select(`${xAxisActantType}_professions.profession_id AS id`);
        groupByStatement.groupBy(`${xAxisActantType}_professions.profession_id`);
        ObjectClass = Profession;
        break;

      case 'role':
        selectStatement.select('bso.role_id AS id');
        groupByStatement.groupBy('bso.role_id');
        ObjectClass = Role;
        break;

      case 'sphere':
        selectStatement.select('spheres.sphere_id AS id');
        groupByStatement.groupBy('spheres.sphere_id');
        ObjectClass = Sphere;
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
        selectStatement.select(`COUNT(DISTINCT ${yAxisActantType}_natures.nature_id) AS count`);
        break;

      case 'profession':
        selectStatement.select(`COUNT(DISTINCT ${yAxisActantType}_professions.profession_id) AS count`);
        break;

      case 'role':
        selectStatement.select('COUNT(DISTINCT bso.role_id) AS count');
        break;

      case 'sphere':
        selectStatement.select('COUNT(DISTINCT spheres.sphere_id) AS count');
        break;

      case 'words':
        if (this.emdrosData) {
          if (xAxis.type === 'sphere' || (zAxis && zAxis.type === 'sphere')) {
            const caseStatement = Object.keys(this.emdrosData).map(bsoID => {
              const data = this.emdrosData[bsoID];
              const spheres = ['family', 'economics', 'government', 'religion', 'education', 'communication', 'celebration'].map((sphereName, index) => {
                return `WHEN bso.id = ${bsoID} AND spheres.sphere_id = ${index + 1} THEN ${data[sphereName]}`;
              });
              return spheres.join(' ');
            });
            selectStatement.select(`SUM(CASE ${caseStatement.join(' ')} END) AS count`);
          } else {
            const caseStatement = Object.keys(this.emdrosData).map(bsoID => {
              const data = this.emdrosData[bsoID];
              return `WHEN ${bsoID} THEN ${data.wordCount}`;
            });
            selectStatement.select(`SUM(CASE bso.id ${caseStatement.join(' ')} END) AS count`);
          }
        } else if (xAxis.type === 'sphere' || (zAxis && zAxis.type === 'sphere')) {
          selectStatement.select('SUM(spheres.word_count) AS count');
        } else {
          selectStatement.select('SUM(bso.word_count) AS count');
        }
        break;
    }

    orderByStatement.orderBy('count DESC');

    const dataSQL = this._sql(selectStatement.toSQL(), {groupBy: groupByStatement.toSQL(), orderBy: orderByStatement.toSQL()});

    const rows = await rowsWithSQL(dataSQL);

    const data = [];
    const groupByData = {};

    rows.forEach(row => {
      let object = {};
      if (ObjectClass) {
        object = ObjectClass.findByID(row['id']);
      }
      const value = {label: object.name, value: row['count']};

      if (GroupByObjectClass) {
        const groupByID = row['zid'];
        const values = groupByData[groupByID] || [];
        groupByData[groupByID] = [...values, value];
      } else {
        data.push(value);
      }
    });

    Object.keys(groupByData).forEach(groupByID => {
      if (GroupByObjectClass) {
        const groupByObject = GroupByObjectClass.findByID(parseInt(groupByID));
        data.push({
          label: groupByObject.name,
          value: groupByData[groupByID]
        });
      }
    });

    return data;
  }

  async _words() {
    const monads = await this._monads();
    const words = await Emdros.words({monads, useStopWords: true, limit: 20});
    return words.map(word => ({label: word.string, value: word.count}));
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
              fromClause.join('INNER JOIN natures AS speaker_natures ON speakers.actant_id = speaker_natures.actant_id');
              break;

            case 'recipient':
              fromClause.join('INNER JOIN bso_actants AS listeners ON (bso.id = listeners.bso_id AND listeners.type_id = 2)');
              fromClause.join('INNER JOIN natures AS listener_natures ON listeners.actant_id = listener_natures.actant_id');
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
              fromClause.join('INNER JOIN professions AS speaker_professions ON speakers.actant_id = speaker_professions.actant_id');
              break;

            case 'recipient':
              fromClause.join('INNER JOIN bso_actants AS listeners ON (bso.id = listeners.bso_id AND listeners.type_id = 2)');
              fromClause.join('INNER JOIN professions AS listener_professions ON listeners.actant_id = listener_professions.actant_id');
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
          const SPHERES = ['family', 'economics', 'government', 'religion', 'education', 'communication', 'celebration'];;
          const sphereID = SPHERES.indexOf(filter.sphere.id) + 1;
          whereClause.where(ComparisonPredicate.predicateWith('spheres.sphere_id', '=', sphereID));
          break;

        case 'word':

      }
    });

    this.whereClause = whereClause;
  }

  async _updateWhereClauseWithWordFilter(wordFilter: Object) {

  }
}
