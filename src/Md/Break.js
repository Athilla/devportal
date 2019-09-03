import React from 'react';
import PropTypes from 'prop-types';



class Break extends React.PureComponent {
    constructor(props) {
        super(props);

    }


    render() {

        console.dir(this.props);
        return (<br />);
    }
}

Break.defaultProps = {

};

Break.propTypes = {

};

export default Break;
