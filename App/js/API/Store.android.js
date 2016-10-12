/* @flow */
'use strict';

import InAppBilling from 'react-native-billing';

export default class Store {
  static products() {
    InAppBilling.open()
    .then(() => InAppBilling.getProductDetailsArray(['com.sourceviewbible.products.spheres']))
    .then((details) => {
      console.log('Products', details);
      return InAppBilling.close();
    });
  }
}
