import React from 'react';
import actions from "./actions";
import { connect } from 'react-redux'
import {Cell} from "@blueprintjs/table";

class Companies extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            data: undefined,
            loading: true,
            error: undefined
        };
        props.fetchCompanies()
    }

    render() {
        if (this.props.data) {
            return this.props.data.companies.map(item => <p>{item.name}</p>)
        } else {
            return <h1>Loading...</h1>;
        }
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