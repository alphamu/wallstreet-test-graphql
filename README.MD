# Wallstreet

## Requirements

- Node12
- NPM

## Notes

The backend uses Express, Apollo & graphQL.
the client interacts with the API using Apollo graphQL client.
There is no REST API.
Very little process is being done on the client side, as the goal is to have
pagination for large datasets, this pages sorting and filtering client side infeasible.

## Running

In order to run the project, you will have to run and backend and client side code.

```bash
# Backend code
cd backend
npm install && npm start
# Starts on http://localhost:5000
# GraphQL playground on http://localhost:5000/graphql

# Client side code (ReactJS)
cd client
npm install && npm start
# Starts on http://localhost:3000
```

The client, a ReactJS app will run on http://localhost:3000
As required you can sort and filter the data on that page.

The API will run on http://localhost:5000 (nothing there, don't visit)
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
