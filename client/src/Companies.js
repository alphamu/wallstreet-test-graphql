import React from 'react';
import actions from "./actions";
import {connect} from 'react-redux'
import Company from "./Company";
import FilterByExchange from "./FilterByExchange";
import FilterByScore from "./FilterByScore";

class Companies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortBy: undefined,
            sortDirection: undefined,
            filterByField: undefined,
            filterByValues: undefined
        };

        this.titles = [
            'name',
            'score',
            'min_price',
            'max_price',
            'volatile_score',
            'exchange_symbol',
            'unique_symbol']
        this.props.fetchCompanies(this.state)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.sortBy === this.state.sortBy
            && prevState.sortDirection === this.state.sortDirection
            && prevState.filterByField === this.state.sortBy
            && prevState.filterByValues === this.state.filterByValues
        ) {
            //do nothing
        } else {
            this.props.fetchCompanies(this.state)
        }

    }

    handleClickTitle(e) {
        let targetId = e.target.id
        if (targetId === 'score') {
            this.clearAndSetState({
                sortBy: 'score',
                sortDirection: this.state.sortDirection === 'desc' ? 'asc' : 'desc'
            })
        } else if (targetId === 'volatile_score') {
            this.clearAndSetState({
                sortBy: 'volatile',
                sortDirection: this.state.sortDirection === 'desc' ? 'asc' : 'desc'
            })
        }
    }

    clearAndSetState(nextState) {
        let next = {
            sortBy: undefined,
            sortDirection: undefined,
            ...nextState
        }
        this.setState(next)
    }

    childUpdateState(childState) {
        let next = {
            ...this.state,
            ...childState
        }
        if (next.filterByValues.length === 0) {
            next.filterByField = undefined
            next.filterByValues = undefined
        }
        console.log("Child update to", next)
        this.setState(next, () => this.props.fetchCompanies(next))
    }

    render() {
        if (this.props.data) {
            let companies = this.props.data.companies
            let exchange_symbols = this.props.data.exchange_symbols
            let unique_scores = this.props.data.unique_scores
            return (
                <div>
                    <div>
                        <FilterByExchange filters={exchange_symbols} update={this.childUpdateState.bind(this)} parentState={this.state}/>
                    </div>
                    <div>
                        <FilterByScore filters={unique_scores}  update={this.childUpdateState.bind(this)} parentState={this.state} />
                    </div>
                    <table className={'companyTable'}>
                        <thead>
                        <tr>
                            {this.titles.map(t => {
                                return (<th
                                    id={t}
                                    key={t}
                                    className={(t === 'score' || t === 'volatile_score') ? `sortHeader ${t}` : ''}
                                    onClick={this.handleClickTitle.bind(this)}>{t.replace('_', ' ')}
                                </th>)
                            })}
                        </tr>
                        </thead>
                        <tbody>
                            <Company companies={companies} titles={this.titles}/>
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return <h1>Loading...</h1>;
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...state
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchCompanies: ({sortBy, sortDirection, filterByField, filterByValues}) =>
        dispatch({
            type: actions.FETCH_COMPANIES,
            sortBy,
            sortDirection,
            filterByField,
            filterByValues
        }),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Companies)