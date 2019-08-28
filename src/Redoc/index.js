import React, { Component } from 'react';
import { RedocStandalone } from 'redoc';

class Redoc extends Component {
  JsonFile = () => {
    var data = fetch('../staticFiles/openapi.json')
      .then(r => r.json())
      .then(r => console.log(r));

    return data;
  };

  localData = () => {
    var data = require('../staticFiles/openapi.json');
    console.log(data);
    return data;
  };
  render = () => {
    return (
      <RedocStandalone
        spec={this.localData()}
        onLoaded={error => {
          if (!error) {
            console.log('Yay!');
          }
        }}
      />
    );
  };
}

export default Redoc;
