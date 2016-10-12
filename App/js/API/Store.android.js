/* @flow */
'use strict';

import InAppBilling from 'react-native-billing';

export default class Store {
  static products(productIdentifiers) {
    return new Promise((resolve, reject) => {
      InAppBilling.open()
      .then(() => InAppBilling.getProductDetailsArray(productIdentifiers))
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
        resolve(transationDetail.purchaseState === 'PurchasedSuccessfully');
      });
    });
  }

  static restorePurchases() {
    return new Promise((resolve, reject) => {
      InAppBilling.open()
      .then(() => InAppBilling.listOwnedProducts())
      .then((productIdentifiers) => {
        InAppBilling.close();
        resolve(productIdentifiers);
      });
    });
  }
}
