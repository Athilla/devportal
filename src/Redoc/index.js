import React, { Component } from "react";
import { RedocStandalone } from "redoc";

class Redoc extends Component {
  JsonFile = () => {
    var data = fetch("../staticFiles/openapi.json")
      .then(r => r.json())
      .then(r => console.log(r));

    return data;
  };

  localData = () => {
    var data = require("../staticFiles/openapi.json");
    console.log(data);
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
          scrollYOffset: "#Appbar",
          hideLoading: true,
          showExtensions: true
        }}
        onLoaded={error => {
          if (!error) {
            console.log("Yay!");
          }
        }}
      />
    );
  };
}

export default Redoc;
