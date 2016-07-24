/* @flow */
'use strict';

function pathToRegexp(path, keys, sensitive, strict) {
  if (path instanceof RegExp) return path;
  if (path instanceof Array) path = '(' + path.join('|') + ')';
  path = path
    .concat(strict ? '' : '/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/\+/g, '__plus__')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional) {
      keys.push({ name: key, optional: !! optional });
      slash = slash || '';
      return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/__plus__/g, '(.+)')
    .replace(/\*/g, '(.*)');

  const pattern = '^' + path + '$';
  if (sensitive) {
    return new RegExp(pattern, 'i');
  }
  return new RegExp(pattern);
}

class Route {
  path: any;
  keys: any;
  regex: any;

  constructor(path) {
    this.path = path;
    this.keys = [];
    this.regex = pathToRegexp(this.path, this.keys, false, false);
  }

  match(path) {
    const matches = this.regex.exec(path);
    if (!matches) return null;

    const params = {};
    matches.forEach((match, i) => {
      const key = this.keys[i - 1];
      const val = ('string' == typeof match) ? decodeURIComponent(match) : match;
      if (key) {
        params[key.name] = val;
      }
    });

    return params;
  }
}

class Router {
  routes: any;
  map: Object;

  constructor() {
    this.routes = [];
    this.map = {};
  }

  addPath(path: string) {
    if (!this.map[path]) {
      this.map[path] = new Route(path);
      this.routes.push(this.map[path]);
    }
  }

  addRoutes(paths: any) {
    paths.forEach(path => {
      this.addPath(path);
    })
  }

  match(path: string): Object {
    for (let route of this.routes) {
      const params = route.match(path);
      if (params) {
        return {route, params}
      }
    }

    return {route: null, params: null};
  }

  urlFor(path: string, params: any) {
    let url = path;

    Object.keys(params).forEach(param => {
      url = url.replace('/:' + param, '/' + params[param]);
    });

    url = url.replace(/\/:.*\?/g, '/').replace(/\?/g, '');

    if (url.indexOf(':') != -1) {
      throw new Error('missing parameters for url: '+path);
    }
    return url;
  }
}

module.exports = new Router();
