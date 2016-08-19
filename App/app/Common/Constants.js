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

const ReaderBaseFontSize = 17;
const ReaderBaseLineHeight = 31;
const ReaderFontStepSize = 2;
const ReaderWebFontConversion = 13/17;

module.exports = {
  SourceType,
  SphereType,
  ReaderBaseFontSize,
  ReaderBaseLineHeight,
  ReaderFontStepSize,
  ReaderWebFontConversion
};
