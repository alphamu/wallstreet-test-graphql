import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {gql} from "apollo-boost";
import actions from './actions'
import {useApolloClient} from "@apollo/react-hooks";
import client from "./apollo-proxy";
const COMPANIES = gql`
    {
        companies {
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

function* fetchCompanies(params) {
    try {
        //useQuery(COMPANIES)
        // const res = yield useQuery(COMPANIES)
        const response = yield client.query({query: COMPANIES})
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