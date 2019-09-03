import React, { createElement } from 'react';
import PropTypes from 'prop-types';
const xtend = require('xtend');
function getCoreProps(props) {
    return props['data-sourcepos'] ? { 'data-sourcepos': props['data-sourcepos'] } : {}
}


class TableCell extends React.PureComponent {
    constructor(props) {
        super(props);

    }


    render() {
        const style = this.props.align ? { textAlign: this.props.align } : undefined
        const coreProps = getCoreProps(this.props)
        //console.log(`CoreProps => `+ JSON.stringify(coreProps));
        //console.dir(this.props.children);
        console.log(this.props.children.length)
        if (this.props.children.length === 1) {
            if ('props' in this.props.children[0]) {
                if ('value' in this.props.children[0].props)
                    console.log(this.props.children[0].props.value);
            }
        }
        if(! this.props.isHeader)
        {
console.dir(this.props.children);
        }
        console.log(`isHeader => ` +this.props.isHeader);
        return createElement(
            this.props.isHeader ? 'th' : 'td',
            style ? xtend({ style }, coreProps) : coreProps,
            this.props.children
        );
    }
}

TableCell.defaultProps = {
    align: 'center',
    isHeader: false
};

TableCell.propTypes = {
    align: 'center',
    isHeader: PropTypes.bool,
};

export default TableCell;
