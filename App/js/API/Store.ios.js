/* @flow */
'use strict';

import { NativeModules } from 'react-native';
import { InAppUtils } from 'NativeModules';

export default class Store {
  static products() {
    InAppUtils.loadProducts(['com.sourceviewbible.products.spheres'], (error, products) => {
      if (error) {
        console.log('error loading products:', error);
      } else {
        console.log('Products', products);
      }
    });
  }
}
