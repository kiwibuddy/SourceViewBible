import React, { Component } from 'react';

import App from './Components/App';

import Emdros from './API/Emdros';

export default class SourceViewBible extends Component {
  componentDidMount() {
    Emdros.openDatabase();
  }

  render() {
    return <App />;
  }
}
