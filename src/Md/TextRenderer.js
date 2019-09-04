import React, { createElement } from 'react';

const supportsStringRender = parseInt((React.version || '16').slice(0, 2), 10) >= 16;

export default class TextRenderer extends React.PureComponent {
  render() {
    if (this.props.children.toLowerCase() === '<br/>') {
      return <br />;
    } else {
      return supportsStringRender ? this.props.children : createElement('span', null, this.props.children);
    }
  }
}
