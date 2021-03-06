import React from 'react'
import {render} from '@testing-library/react'
import {Provider} from 'react-redux'
import App from './App'
import '@testing-library/jest-dom'

import configureStore from 'redux-mock-store'

const mockStore = configureStore([]);

let store
let app
let storeData = {
    "data": {
        "unique_scores": [
            {
                "score": "1"
            },
            {
                "score": "2"
            },
            {
                "score": "3"
            }
        ],
        "exchange_symbols": [
            {
                "exchange_symbol": "A"
            },
            {
                "exchange_symbol": "B"
            },
            {
                "exchange_symbol": "C"
            }
        ],
        "companies": [
            {
                "company_id": "FC7B296B-300B-4710-8F84-D68A5BFBC75B",
                "name": "Telstra",
                "score": 10,
                "min_price": 2.99,
                "max_price": 3.25,
                "volatile_score": 0.2599999999999998,
                "exchange_symbol": "ASX",
                "unique_symbol": "ASX:TLS"
            },
            {
                "company_id": "D0665877-9EC5-4568-8A29-E8FFF77DF072",
                "name": "Amazon.com",
                "score": 13,
                "min_price": 1885.84,
                "max_price": 2497.94,
                "volatile_score": 612.1000000000001,
                "exchange_symbol": "NasdaqGS",
                "unique_symbol": "NasdaqGS:AMZ"
            }
        ]
    }
}
let emptyStoreData = {}

beforeEach(() => {
    store = mockStore(emptyStoreData);
    store.dispatch = jest.fn();
    app = render(
        <Provider store={store}>
            <App />
        </Provider>
    )

});

test('Is Title Wall St.', () => {
    const { getByText } = app
    const textElement = getByText(/Wall St\./i)
    expect(textElement).toBeInTheDocument()
});

test('Is Companies Loading.', () => {
    const { getByText } = app
    const textElement = getByText(/Loading\.\.\./i)
    expect(textElement).toBeInTheDocument()
    expect(store.dispatch).toHaveBeenCalled()
});
