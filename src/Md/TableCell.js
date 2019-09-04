import React, { createElement } from 'react';
import PropTypes from 'prop-types';
const xtend = require('xtend');
function getCoreProps(props) {
  return props['data-sourcepos'] ? { 'data-sourcepos': props['data-sourcepos'] } : {};
}

class TableCell extends React.PureComponent {
  render() {
    const style = this.props.align ? { textAlign: this.props.align } : undefined;
    const coreProps = getCoreProps(this.props);
    return createElement(
      this.props.isHeader ? 'th' : 'td',
      style ? xtend({ style }, coreProps) : coreProps,
      this.props.children,
    );
  }
}

TableCell.defaultProps = {
  align: 'center',
  isHeader: false,
};

TableCell.propTypes = {
  align: PropTypes.string,
  isHeader: PropTypes.bool,
};

export default TableCell;
