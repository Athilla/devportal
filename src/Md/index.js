import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import file from '../staticFiles/Payment_SAAS_integration.md';
import { withStyles } from '@material-ui/styles';
import CodeBlock from './CodeBlock';
import breaks from 'remark-breaks';
import TableCell from './TableCell';
import Break from './Break';
import TextRenderer from './TextRenderer';

class Md extends Component {
  constructor(props) {
    super(props);

    this.state = { file: null };
  }

  componentDidMount() {
    fetch(file)
      .then(response => response.text())
      .then(text => {
        this.setState({ file: text });
      });
  }

  render = () => {
    return (
      //https://github.com/rexxars/react-markdown
      <ReactMarkdown
        source={this.state.file}
        renderers={{
          code: CodeBlock,
          tableCell: TableCell,
          break: Break,
          text: TextRenderer,
        }}
        plugins={[breaks]}
      />
    );
  };
}

export default withStyles({ withTheme: true })(Md);
