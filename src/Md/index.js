import React, { Component } from "react";
import ReactMarkdown from "react-markdown";

class Md extends Component {
  localData = () => {
    var data = require("../staticFiles/Payment_SAAS_integration.md");
    //console.log(data);
    return data;
  };
  render = () => {
    return (
      //https://github.com/rexxars/react-markdown
      <ReactMarkdown source={this.localData()} />
    );
  };
}

export default Md;
