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
      keys.push({ name: key, optional: !!optional });
      slash = slash || '';
      return (
        '' +
        (optional ? '' : slash) +
        '(?:' +
        (optional ? slash : '') +
        (format || '') +
        (capture || ((format && '([^/.]+?)') || '([^/]+?)')) +
        ')' +
        (optional || '')
      );
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

function urlFor(path: string, params: any) {
  let url = path;

  const extraParams = {};
  if (params) {
    Object.keys(params).forEach(param => {
      const paramKey = '/:' + param;
      if (url.indexOf(paramKey) != -1) {
        url = url.replace(paramKey, '/' + params[param]);
      } else {
        extraParams[param] = params[param];
      }
    });
  }

  url = url.replace(/\/:.*\?/g, '/').replace(/\?/g, '');

  if (url.indexOf(':') != -1) {
    throw new Error('missing parameters for url: ' + path);
  }
  return { ...extraParams, path: url };
}

class Route {
  key: any;
  params: any;
  scene: any;
  regex: any;

  constructor(key, scene: ?Function) {
    this.key = key;
    this.params = [];
    this.scene = scene;
    this.regex = pathToRegexp(this.key, this.params, false, false);
  }

  match(path) {
    const matches = this.regex.exec(path);
    if (!matches) return null;

    const params = {};
    matches.forEach((match, i) => {
      const param = this.params[i - 1];
      const val = 'string' == typeof match ? decodeURIComponent(match) : match;
      if (param) {
        params[param.name] = val;
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

  addRoute(key: string, scene: ?Function): Function {
    let route = this.map[key];
    if (!route) {
      route = new Route(key, scene);
      this.map[key] = route;
      this.routes.push(this.map[key]);
    }
    return params => urlFor(key, params);
  }

  addRoutes(routes: any) {
    Object.keys(routes).forEach(key => {
      const scene = routes[key];
      this.addRoute(key, scene);
    });
  }

  match(path: string): Object {
    for (let route of this.routes) {
      const params = route.match(path);
      if (params) {
        return { route, params };
      }
    }

    return { route: null, params: null };
  }
}

module.exports = new Router();
