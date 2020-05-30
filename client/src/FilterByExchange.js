import React from "react";

export default class FilterByExchange extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filterByField: "exchange_symbol",
            filterByValues: [],
        }

    }


    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.parentState.filterByField && this.props.parentState.filterByField !== 'exchange_symbol' && this.state.filterByValues.length > 0) {
            console.log("FilterByExchange.componentDidUpdate", this.state, this.props.parentState)
            this.setState({...this.state, filterByValues: []})
        }
    }

    onCheckChange(e) {
        let value = e.target.value
        let next = {...this.state}
        if (next.filterByValues.indexOf(value) > -1) {
            let index = next.filterByValues.indexOf(value);
            next.filterByValues.splice(index, 1);
        } else {
            next.filterByValues.push(value)
        }
        this.setState(next)
        this.props.update(next)
    }

    render() {
        return (
            <div className={'filterExchange'}>
                <h2>Filter by Exchange Symbol</h2>
                <div className={'filter'}>
                    {
                        this.props.filters.map(({exchange_symbol}) => {
                                return (
                                    <div key={exchange_symbol}>
                                        <input
                                            type={'checkbox'}
                                            id={exchange_symbol}
                                            name={'exchange_symbol'}
                                            value={exchange_symbol}
                                            onChange={this.onCheckChange.bind(this)}
                                            checked={this.state.filterByValues.indexOf(exchange_symbol) > -1}
                                        />
                                        <label htmlFor={exchange_symbol}>{exchange_symbol}</label>
                                    </div>
                                )
                            }
                        )
                    }
                </div>
            </div>
        )
    }
}
