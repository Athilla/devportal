import React, { Component } from 'react';
import { RedocStandalone } from 'redoc';

class Redoc extends Component {
  localData = () => {
    var data = require('../staticFiles/openapi.json');
    console.log(data);
    return data;
  };

  render = () => {
    return (
      // https://github.com/Redocly/redoc#redoc-options-object
      <RedocStandalone spec={this.localData()} />
    );
  };
}

export default Redoc;
