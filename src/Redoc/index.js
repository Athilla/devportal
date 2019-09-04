import React, { Component } from 'react';
import { RedocStandalone } from 'redoc';

class Redoc extends Component {
  localData = () => {
    var data = require('../staticFiles/openapi.json');
    return data;
  };

  render = () => {
    return (
      // https://github.com/Redocly/redoc#redoc-options-object
      <RedocStandalone
        spec={this.localData()}
        options={{
          nativeScrollbars: true,
          hideDownloadButton: true,
          scrollYOffset: '#Appbar',
          hideLoading: true,
          showExtensions: true,
        }}
      />
    );
  };
}

export default Redoc;
