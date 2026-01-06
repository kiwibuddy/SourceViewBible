/* @flow */
'use strict';

const moment = require('moment');
require('moment-duration-format');

import Localizable from './Localizable';

const WORDS_PER_MINUTE = 180;

function ReadingTime(words: number): string {
  const minutes = words / WORDS_PER_MINUTE;
  const displayed = Math.ceil(minutes);
  return moment.duration(displayed, 'minutes').format('h [hr] m [min]');
}

function RelativeDate(date: Object): string {
  const today = moment();
  const dateDiff = today.diff(date, 'days');

  switch (dateDiff) {
    case 0:
      return Localizable.t('today');

    case 1:
      return Localizable.t('yesterday');

    default:
      return Localizable.strftime(date, '%m/%d/%-y');
  }
}

function ShuffleArray(array: any): any {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffledArray[i];
    shuffledArray[i] = shuffledArray[j];
    shuffledArray[j] = temp;
  }
  return shuffledArray;
}

module.exports = {
  ReadingTime,
  RelativeDate,
  ShuffleArray,
};
