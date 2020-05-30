import {put, takeLatest} from 'redux-saga/effects'
import {gql} from "apollo-boost";
import actions from './actions'
import client from "./apollo-proxy";

const COMPANIES = gql`
    query ($sortBy: String, $sortDirection: String, $filterByField: String, $filterByValues: [String]){
        unique_scores {
            score
        }
        exchange_symbols {
            exchange_symbol
        }
        companies(sortBy: $sortBy, sortDirection: $sortDirection, filterByField: $filterByField, filterByValues: $filterByValues) {
            company_id
            name
            score
            min_price
            max_price
            volatile_score
            exchange_symbol
            unique_symbol
            company_score {
                total
            }
            company_price_close {
                date
                price
            }
        }
    }
`;

function* fetchCompanies({sortBy, sortDirection, filterByField, filterByValues}) {
    try {
        console.log({sortBy, sortDirection, filterByField, filterByValues})
        const response = yield client.query({query: COMPANIES, variables: {sortBy, sortDirection, filterByField, filterByValues }})
        console.log("saga fetchCompanies", response)
        yield put({type: actions.FETCH_COMPANIES_SUCCESS, response: response});
    } catch (e) {
        yield put({type: actions.FETCH_COMPANIES_FAIL, message: e.message});
    }
}

function* mySaga() {
    yield takeLatest(actions.FETCH_COMPANIES, fetchCompanies);
}

export default mySaga;