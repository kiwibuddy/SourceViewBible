"use strict";

import {NativeModules} from 'react-native';
const EmdrosBridge = NativeModules.Emdros;

var openedDatabases = {};

export default class Emdros {
  constructor(config) {
    this.name = config.name;
  }

  static open(options) {
    console.log(options);
    let name = options.name;

    var promise = new Promise((resolve, reject) => {
      let emdros = openedDatabases[name];
      if (emdros) {
        return resolve(emdros);
      } else {
        EmdrosBridge.open(options).then(() => {
          let emdros = new Emdros({name: name});
          openedDatabases[name] = emdros;
          return resolve(emdros);
        }).catch((error) => {
          reject(error);
        });
      }
    });

    return promise;
  }

  close() {
    EmdrosBridge.close(this.name);
  }

  query(query, options) {
    return EmdrosBridge.query({...options, query: query, name: this.name});
  }

  string(from, to, options) {
    return EmdrosBridge.string({...options, from: from, to: to, name: this.name})
  }
}
