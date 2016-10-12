/* @flow */
'use strict';

import InAppBilling from 'react-native-billing';

export default class Store {
  static products(identifiers) {
    return new Promise((resolve, reject) => {
      InAppBilling.open()
      .then(() => InAppBilling.getProductDetailsArray())
      .then((products) => {
        InAppBilling.close();
        resolve(products);
      });
    });
  }

  static purchase(productID) {
    return new Promise((resolve, reject) => {
      InAppBilling.open()
      .then(() => InAppBilling.purchase('android.test.purchased'))
      .then((transationDetail) => {
        InAppBilling.close();
        resolve(transationDetail);
      });
    });
  }

  static restorePurchases() {
    
  }
}
