/* @flow */
'use strict';

const I18n = require('react-native-i18n');
I18n.fallbacks = true;

I18n.translations = require('../Locale/localizable')

module.exports = I18n;
