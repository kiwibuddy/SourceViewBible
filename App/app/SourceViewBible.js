import App from './Components/App';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './Store/configureStore';

import Emdros from './API/Emdros';

const store = configureStore();

export default class SourceViewBible extends Component {
  componentDidMount() {
    Emdros.openDatabase();
  }

  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
