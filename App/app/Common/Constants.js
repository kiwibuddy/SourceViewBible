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

const Links = {
  Website: 'http://sourceviewbible.com',
  Donate: 'http://sourceviewbible.com/donate',
  Twitter: 'https://twitter.com/sourceviewbible',
  Facebook: 'https://www.facebook.com/sourceviewbible',
  Contact: 'mailto:support@sourceviewbible.com',
  AppStore: 'itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=1114617271&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software',
  GooglePlay: 'http://www.google.com',
};

module.exports = {
  Links,
  SourceType,
  SphereType,
  ReaderBaseFontSize,
  ReaderBaseLineHeight,
  ReaderFontStepSize,
  ReaderWebFontConversion
};
