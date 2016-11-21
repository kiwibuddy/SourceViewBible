/* @flow */
"use strict";

import {NativeModules} from 'react-native';
const EmdrosBridge = NativeModules.Emdros;

var openedDatabases = {};

export default class Emdros {
  name: string;

  constructor(config: Object) {
    this.name = config.name;
  }

  static get key() {
    const KEY = EmdrosBridge.Key;
    const keyLength = KEY.length;
    const buf = new ArrayBuffer(keyLength);
    const bufView = new Int8Array(buf);

    for (let i = 0; i < keyLength; i++) {
      bufView[i] = KEY.charCodeAt(i);
    }
    return buf;
  }

  static get preferencesKey() {
    const KEY = EmdrosBridge.PreferencesKey;
    const keyLength = KEY.length;
    const buf = new ArrayBuffer(keyLength);
    const bufView = new Int8Array(buf);

    for (let i = 0; i < keyLength; i++) {
      bufView[i] = KEY.charCodeAt(i);
    }
    return buf;
  }

  static open(options: Object) {
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

  async query(query: string, options: Object) {
    return EmdrosBridge.query({...options, query: query, name: this.name});
  }

  async words(options: Object) {
    return EmdrosBridge.wordsInMonads({...options, name: this.name});
  }

  async wordCountsForContext(context: string, options?: Object) {
    return EmdrosBridge.wordCountsForContext({...options, context, name: this.name});
  }

  async wordOccurrences(word: string, options?: Object) {
    const monadSet = options && options.monadSet ? `IN {${options.monadSet.first}-${options.monadSet.last}}` : '';
    const query = `SELECT ALL OBJECTS
      ${monadSet}
      WHERE
      [Source GET source_color, source_name, source_occurrence
        [Verse
          GET djhbook, chapter, verse_start
          [Token surface_fts="${word}"]
        ]
      ]
      GO`;
    return EmdrosBridge.wordOccurrences({...options, query, name: this.name});
  }

  async string(from: number, to: number, options: Object) {
    return EmdrosBridge.string({...options, from: from, to: to, name: this.name});
  }

  async monadSet(options: Object) {
    return EmdrosBridge.monadSet({...options, name: this.name});
  }
}
