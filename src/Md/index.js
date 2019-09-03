import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import file from '../staticFiles/Payment_SAAS_integration.md';
import { withStyles } from '@material-ui/styles';
import CodeBlock from './CodeBlock';
import breaks from 'remark-breaks';
import RemarkableReactRenderer from 'remarkable-react';
import TableCell from './TableCell'
import Break from './Break'
import { Remarkable } from 'remarkable';
const createElement = React.createElement;
const hljs = window.hljs;

var md = new Remarkable({
    html: true,
});
md.renderer = new RemarkableReactRenderer();


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
            <ReactMarkdown source={this.state.file}
                renderers={{
                    code: CodeBlock,
                    tableCell: TableCell,
                    break : Break,
                    }}
                plugins={[breaks]} />
        );
    };

    renderb = () => {
        return md.render(this.state.file);
    };
}

export default withStyles({ withTheme: true })(Md);
