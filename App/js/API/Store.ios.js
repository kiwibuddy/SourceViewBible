/* @flow */
'use strict';

import { NativeModules } from 'react-native';
import { InAppUtils } from 'NativeModules';

export default class Store {
  static products(productIdentifiers) {
    return new Promise((resolve, reject) => {
      InAppUtils.loadProducts(productIdentifiers, (error, products) => {
        resolve(products);
      });
    });
  }

  static purchase(productID) {
    return new Promise((resolve, reject) => {
      InAppUtils.purchaseProduct(productID, (error, response) => {
        if (error) {
          reject(error);
        } else if (response && response.productIdentifier) {
          resolve(true);
         }
      });
    });
  }

  static restorePurchases() {
    return new Promise((resolve, reject) => {
      InAppUtils.restorePurchases((error, response)=> {
       if (error) {
         reject(error);
       } else {
         return response.map(transaction => transaction.productIdentifier);
       }
      });
    });
  }
}
