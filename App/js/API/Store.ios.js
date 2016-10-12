/* @flow */
'use strict';

import { NativeModules } from 'react-native';
import { InAppUtils } from 'NativeModules';

export default class Store {
  static products(identifiers) {
    return new Promise((resolve, reject) => {
      InAppUtils.loadProducts(identifiers, (error, products) => {
        resolve(products);
      });
    });
  }

  static purchase(productID) {

  }

  static restorePurchases() {

  }
}
