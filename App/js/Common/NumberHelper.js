/* @flow */
'use strict';

const moment = require('moment');
require('moment-duration-format');

const WORDS_PER_MINUTE = 180;

function ReadingTime(words: number): string {
  const minutes = words / WORDS_PER_MINUTE;
  const time = minutes * 60 * 1000;
  const displayed = Math.ceil(minutes);
  return moment.duration(displayed, "minutes").format("h [hr] m [min]");
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
  ShuffleArray
};
