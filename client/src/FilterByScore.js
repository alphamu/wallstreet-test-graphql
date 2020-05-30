import React from "react";

export default class FilterByScore extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filterByField: "total",
            filterByValues: [],
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.parentState.filterByField && this.props.parentState.filterByField !== 'total' && this.state.filterByValues.length > 0) {
            console.log("FilterByScore.componentDidUpdate", this.state, this.props.parentState)
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
            <div className={'filterScore'}>
                <h2>Filter by Score</h2>
                <div className={'filter'}>
                    {
                        this.props.filters.map(({score}) => {
                                return (
                                    <div key={score}>
                                        <input
                                            type={'checkbox'}
                                            id={score}
                                            name={'total'}
                                            value={score}
                                            onChange={this.onCheckChange.bind(this)}
                                            checked={this.state.filterByValues.indexOf(score) > -1}
                                        />
                                        <label htmlFor={score}>{score}</label>
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