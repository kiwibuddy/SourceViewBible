/* @flow */
'use strict';

// $FlowFixMe - Silence warning
import { InAppUtils } from 'NativeModules';

export default class Store {
  static products(productIdentifiers) {
    return new Promise(resolve => {
      InAppUtils.loadProducts(productIdentifiers, (error, products) => {
        resolve(
          products.map(product => {
            return {
              productID: product.identifier,
              localizedPrice: product.priceString,
            };
          })
        );
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
      InAppUtils.restorePurchases((error, response) => {
        if (error) {
          reject(error);
        } else {
          const purchases = response.map(transaction => {
            return {
              productID: transaction.productIdentifier,
            };
          });
          resolve(purchases);
        }
      });
    });
  }
}
