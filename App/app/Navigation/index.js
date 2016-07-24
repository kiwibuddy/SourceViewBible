/* @flow */
'use strict';

const router = require('./router');

router.addRoutes([
  '/Books/:bookID/Chapters',
]);

const {route, params} = router.match('/Books/123/Chapters');

console.log('route: ' + route.path);
console.log(params);

module.exports = router;
