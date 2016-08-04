"use strict";

import {NativeModules} from 'react-native';
const EmdrosBridge = NativeModules.Emdros;

var openedDatabases = {};

export default class Emdros {
  constructor(config) {
    this.name = config.name;
  }

  static get key() {
    const KEY = EmdrosBridge.KEY;
    const keyLength = KEY.length;
    const buf = new ArrayBuffer(keyLength);
    const bufView = new Int8Array(buf);

    for (let i = 0; i < keyLength; i++) {
      bufView[i] = KEY.charCodeAt(i);
    }
    return buf;
  }

  static open(options) {
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

  async query(query, options) {
    return EmdrosBridge.query({...options, query: query, name: this.name});
  }

  async words(options) {
    return EmdrosBridge.wordsInMonads({...options, name: this.name});
  }

  async wordCountsForContext(context: string, options) {
    return EmdrosBridge.wordCountsForContext({...options, context, name: this.name});
  }

  async string(from, to, options) {
    return EmdrosBridge.string({...options, from: from, to: to, name: this.name});
  }

  async monadSet(options) {
    return EmdrosBridge.monadSet({...options, name: this.name});
  }
}
