import React from 'react';
import actions from "./actions";
import { connect } from 'react-redux'

class Companies extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            data: undefined,
            loading: undefined,
            error: undefined
        };
        props.fetchCompanies()
    }

    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

const mapStateToProps = (state , ownProps) => {
    console.log("mapStateToProps", state, ownProps)
    return {
        ...state
    }
}

const mapDispatchToProps = (dispatch, { id, isSelected }) => ({
    fetchCompanies: () =>
        dispatch({
            type: actions.FETCH_COMPANIES
        }),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Companies)