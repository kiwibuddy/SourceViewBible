/* @flow */
'use strict';

import Emdros from '../../API/Emdros';
import {
  Bible,
  Actant,
  Book,
  BookSourceOccurrence,
  Chronology,
  Gender,
  Nature,
  Profession,
  Role,
  Sphere,
  ComparisonPredicate,
  CompoundPredicate,
  RawPredicate,
  Predicate,
  rowsWithSQL,
} from '../../Database';

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
    if (this.isEmpty) return '';
    const predicate = CompoundPredicate.andPredicateWithSubpredicates(this.predicates);
    return `WHERE ${predicate.predicateFormat}`;
  }

  get isEmpty(): boolean {
    return this.predicates.length == 0;
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
  static SPHERE_FEATURE_MAP = {
    family: 'Family',
    economics: 'Economics',
    government: 'Government',
    religion: 'Religion',
    education: 'Education',
    communication: 'MediaCom',
    celebration: 'Celebration',
  };

  query: string;
  monads: ?Array<Array<number>>;

  constructor(query: string, monads: ?Array<Array<number>>) {
    this.query = query;
    this.monads = monads;
  }

  async data() {
    const tokenFeatureComparison = this.query;
    const monads = this.monads;

    let options = null;
    if (monads && monads.length > 0) {
      options = { monads, tokenFeatureComparison };
    } else {
      options = { tokenFeatureComparison };
    }

    return Emdros.wordCountsForContext('Source', options);
  }
}

type Props = {
  filters: any,
  xAxis: any,
  yAxis: any,
  zAxis: any,
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

    if (__DEV__) console.log(sql);

    const rows = await rowsWithSQL(sql);
    return rows[0]['count'];
  }

  async data() {
    await this._prepare();
    return await this._data();
  }

  async occurrences() {
    await this._prepare();

    const sql = this._sql('SELECT DISTINCT bso.id', {
      orderBy: 'ORDER BY bso.id',
      limit: `LIMIT ${BookSourceOccurrence.MAXIMUM_NUMBER_OF_DISPLAYABLE_OCCURRENCES}`,
    });
    const rows = await rowsWithSQL(sql);
    return rows.map(row => BookSourceOccurrence.findByID(row['id']));
  }

  async wordCount() {
    await this._prepare();
    if (!this.emdrosData) return null;
    return Object.keys(this.emdrosData).reduce((sum, key) => sum + this.emdrosData[key].wordCount, 0);
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

      const queryParameters = [`surface_fts="${wordFilter.word.toLowerCase()}"`];

      const sphereFilter = this.filters.find(filter => filter.type === 'sphere');
      if (sphereFilter) {
        sphereFilter.spheres.forEach(sphereID => {
          const sphere = EmdrosQuery.SPHERE_FEATURE_MAP[sphereID];
          queryParameters.push(`${sphere}=true`);
        });
      }

      const query = new EmdrosQuery(queryParameters.join(' AND '), monads);
      const data = await query.data();
      const identifiers = Object.keys(data).map(bsoID => parseInt(bsoID));

      if (identifiers.length > 0) {
        this.emdrosData = data;
        this.whereClause.where(ComparisonPredicate.predicateWith('bso.id', 'IN', identifiers));
      }
    }
  }

  async _monads() {
    if (this.whereClause.isEmpty) {
      return null;
    } else if (this.filters.length == 1) {
      const bookRangeFilter = this.filters.find(filter => filter.type === 'book-range');
      if (bookRangeFilter && bookRangeFilter.books.fromID === 'genesis' && bookRangeFilter.books.toID === 'revelation') return null;
    }

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
    if (options && options.limit) sql.push(options.limit);

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
    const whereClause = this.whereClause;
    const groupByStatement = new GroupByStatement();
    const orderByStatement = new OrderByStatement();

    let GroupByObjectClass = null;

    if (zAxis) {
      let zAxisActantType = null;
      switch (zAxis.actantType) {
        case 'source':
          zAxisActantType = 'speaker';
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
          whereClause.where(ComparisonPredicate.predicateWith(`${zAxisActantType}.gender_id`, 'IN', Gender.MALE_AND_FEMALE));
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
        xAxisActantType = 'speaker';
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
        whereClause.where(ComparisonPredicate.predicateWith(`${xAxisActantType}.gender_id`, 'IN', Gender.MALE_AND_FEMALE));
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
        yAxisActantType = 'speaker';
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

    const dataSQL = this._sql(selectStatement.toSQL(), { groupBy: groupByStatement.toSQL(), orderBy: orderByStatement.toSQL() });

    if (__DEV__) console.log(dataSQL);

    const rows = await rowsWithSQL(dataSQL);

    const data = [];
    const groupByData = {};

    rows.forEach(row => {
      let object = {};
      let color = null;
      if (ObjectClass) {
        object = ObjectClass.findByID(row['id']);
        if (object != null && typeof object.color !== 'undefined') {
          // $FlowFixMe
          color = object.color();
        }
      }

      const value = { label: object.name, color, value: row['count'] };

      if (GroupByObjectClass) {
        const groupByID = row['zid'];
        const values = groupByData[groupByID] || [];
        groupByData[groupByID] = [...values, value];
      } else {
        data.push(value);
      }
    });

    if (GroupByObjectClass === Chronology) {
      const chronologies = Chronology.whereIn(Object.keys(groupByData).map(chronologyID => parseInt(chronologyID)));
      chronologies.forEach(chronology => {
        data.push({
          label: chronology.name,
          value: groupByData[chronology.id.toString()],
        });
      });
    } else {
      Object.keys(groupByData).forEach(groupByID => {
        if (GroupByObjectClass) {
          const groupByObject = GroupByObjectClass.findByID(parseInt(groupByID));
          data.push({
            label: groupByObject.name,
            value: groupByData[groupByID],
          });
        }
      });
    }

    return data;
  }

  async _words() {
    let words = null;

    let monads = await this._monads();
    if (monads == null) {
      words = Bible.words;
    } else {
      words = await Emdros.words({ monads, useStopWords: true, limit: 20 });
    }

    return words.map(word => ({ label: word.string, value: word.count }));
  }

  _buildFromClause() {
    const fromClause = new FromClause('FROM bso');

    const items = [...this.axis, ...this.filters];
    items.forEach(item => {
      switch (item.type) {
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

            default:
              // Not needed by filter but needed by axis
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

            default:
              // Not needed by filter but needed by axis
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

            default:
              // Not needed by filter but needed by axis
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
    const xAxis = this.axis[0];
    const zAxis = this.axis[2];

    const whereClause = new WhereClause();

    this.filters.forEach(filter => {
      let actantType = '';
      switch (filter.actantType) {
        case 'source':
          actantType = 'speaker';
          break;

        case 'recipient':
          actantType = 'listener';
          break;
      }

      switch (filter.type) {
        case 'actant':
          whereClause.where(ComparisonPredicate.predicateWith(`${actantType}.id`, '=', filter.actantID));
          break;

        case 'book': {
          const book = Book.findByID(filter.bookID);
          whereClause.where(ComparisonPredicate.predicateWith('bso.first', '>=', book.firstMonad));
          whereClause.where(ComparisonPredicate.predicateWith('bso.last', '<=', book.lastMonad));
          break;
        }

        case 'book-range': {
          const fromBook = Book.findByID(filter.books.fromID);
          const toBook = Book.findByID(filter.books.toID);
          whereClause.where(ComparisonPredicate.predicateWith('bso.first', '>=', fromBook.firstMonad));
          whereClause.where(ComparisonPredicate.predicateWith('bso.last', '<=', toBook.lastMonad));
          break;
        }

        case 'chronology':
          whereClause.where(ComparisonPredicate.predicateWith('chronologies.chronology_id', '=', filter.chronologyID));
          break;

        case 'chronology-range': {
          const fromChronology = Chronology.findByID(filter.chronologies.fromID);
          const toChronology = Chronology.findByID(filter.chronologies.toID);
          const chronologies = Chronology.whereInRange(fromChronology, toChronology).map(chronology => chronology.id);
          whereClause.where(ComparisonPredicate.predicateWith('chronologies.chronology_id', 'IN', chronologies));
          break;
        }

        case 'gender':
          whereClause.where(ComparisonPredicate.predicateWith(`${actantType}.gender_id`, '=', filter.genderID));
          break;

        case 'nature':
          whereClause.where(ComparisonPredicate.predicateWith(`${actantType}_natures.nature_id`, '=', filter.natureID));
          break;

        case 'profession':
          whereClause.where(ComparisonPredicate.predicateWith(`${actantType}_professions.profession_id`, '=', filter.professionID));
          break;

        case 'role':
          whereClause.where(ComparisonPredicate.predicateWith(`bso.role_id`, '=', filter.roleID));
          break;

        case 'sphere': {
          const spheres = Sphere.whereIn(filter.spheres).map(sphere => sphere.position);
          spheres.forEach(sphere => {
            whereClause.where(
              RawPredicate.predicateWith(`EXISTS (SELECT spheres.bso_id FROM spheres WHERE bso.id = spheres.bso_id AND spheres.sphere_id = $0)`, [sphere])
            );
          });
          if (xAxis.type == 'sphere' || (zAxis && zAxis.type == 'sphere')) {
            whereClause.where(ComparisonPredicate.predicateWith('spheres.sphere_id', 'IN', spheres));
          }
          break;
        }
      }
    });

    this.whereClause = whereClause;
  }
}
