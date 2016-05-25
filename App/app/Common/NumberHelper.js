/* @flow */
'use strict';

const moment = require('moment');
require('moment-duration-format');

const WORDS_PER_MINUTE = 180;

function ReadingTime(words: number) {
  const minutes = words / WORDS_PER_MINUTE;
  const time = minutes * 60 * 1000;
  const displayed = Math.ceil(minutes);
  return moment.duration(displayed, "minutes").format("h [hr] m [min]");
}

module.exports = {
  ReadingTime
};
