/* @flow */
'use strict';

import {
  Bible,
  Actant,
  Book,
  Chapter,
  Chronology,
  Gender,
  Nature,
  Occurrence,
  Profession,
  Role,
  Sphere,
  Word,
} from './Realm';

const SQLite = require('./SQLite');

import Predicate from './Predicate';
import ComparisonPredicate from './ComparisonPredicate';
import CompoundPredicate from './CompoundPredicate';
import WordPredicate from './WordPredicate';

module.exports = {
  Bible,
  Actant,
  Book,
  Chapter,
  Chronology,
  Gender,
  Nature,
  Occurrence,
  Profession,
  Role,
  Sphere,
  Word,
  ComparisonPredicate,
  CompoundPredicate,
  Predicate,
  WordPredicate,
};
