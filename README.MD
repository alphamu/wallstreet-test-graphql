# Wallstreet

## Requirements

- Node12
- NPM

## Notes

- The backend uses Express, Apollo & graphQL.
the client interacts with the API using Apollo graphQL client.
There is no REST API.
Very little process is being done on the client side, as the goal is to have
pagination for large datasets, this pages sorting and filtering client side infeasible.

- The Backend uses GraphQL using Apollo with Express. Backend tests are under the `__tests__` folder.

- Frontend is a ReactJS app, no UI components library is used, CSS is done by hand. 
Frontend tests using the `*.test.js`
naming convention as is the default for react apps.


## Running

In order to run the project, you can either build the react app and run 
it through the backend express server (already configured),
or you can run the react app and the backend separately.

### To run everything under express:

```bash
cd client && npm install && npm run build
cd ../backend && npm install && npm start
```

The API will run on http://localhost:5000 (react app will be there if it's been built)
There will be a GraphQL playground on http://localhost:5000/graphql
You can validate that the sorting and filtering is working there as well.

### To run the backend and front-end separately.

```bash
# Backend code
cd backend && npm install && npm start
# Starts on http://localhost:5000
# GraphQL playground on http://localhost:5000/graphql

# Client side code (ReactJS)
cd client && npm install && npm start
# Starts on http://localhost:3000
```

The client, a ReactJS app will run on http://localhost:3000
As required you can sort and filter the data on that page.

The API will run on http://localhost:5000 (react app will be there if it's been built)
There will be a GraphQL playground on http://localhost:5000/graphql
You can validate that the sorting and filtering is working there as well.

You can try running the query used to populate the client side app there:

```graphql
{
  unique_scores {
    score
  }
  exchange_symbols {
    exchange_symbol
  }
  companies {
    company_id
    name
    score
    min_price
    max_price
    volatile_score
    exchange_symbol
    unique_symbol
  }
}
```

Have fun!
