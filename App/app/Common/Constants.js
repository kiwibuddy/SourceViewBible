/* @flow */
'use strict';

const SourceType = {
  NARRATOR: 'narrator',
  GOD: 'god',
  LEAD: 'lead',
  SUPPORT: 'support'
};

const SphereType = {
  FAMILY: 'family',
  ECONOMICS: 'economics',
  GOVERNMENT: 'government',
  RELIGION: 'religion',
  EDUCATION: 'education',
  COMMUNICATION: 'communication',
  CELEBRATION: 'celebration'
};

const Preferences = {
  Books: {
    Sort: 'com.sourceviewbible.preferences.books.sort'
  }
};

module.exports = {
  SourceType,
  SphereType,
  Preferences
};
