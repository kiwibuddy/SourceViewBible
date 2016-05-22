/* @flow */
'use strict';

function readingTime(words) {
  const minutes = words / 200;
  const time = minutes * 60 * 1000;
  const displayed = Math.ceil(minutes);
  return displayed;
}

module.exports = {
  ReadingTime: readingTime,
};
