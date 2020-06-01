# Wallstreet

## Requirements

- Node12
- npm
- Docker (optional)

## Notes

- The backend uses Express, Apollo & GraphQL.
the client interacts with the API using Apollo GraphQL client.

- There is no REST API.

- Very little processing is being done on the client side, this is mostly because if you have 
large datasets with lots of pages, client side sorting and pagination can be problematic.

- The backend uses GraphQL using Apollo with Express. Backend tests are under the `__tests__` folder.

- Frontend is a ReactJS app, no UI components library are being used. CSS is done by hand. 

- Frontend tests using the `*.test.js` naming convention as is the default for react apps.


## Running

In order to run the project, you can either:
- Build and run the docker container (Recommended)
- Build the React app and run it through the backend express server
- Or, you can run the React app and the backend separately.

### To build and run in docker

```bash
docker build -t <your username>/wallstreet-test .
docker run -p 5000:5000 -d <your username>/wallstreet-test

# Ensure docker container is running, if it is, you'll need the CONTAINER ID
docker ps

# Check docker logs to make sure service is ready on http://localhost:5000
docker logs <container id>
```

If you see output like the one shown, you should be able to visit http://localhost:5000 and see everything work:
```
[0000-00-00T00:00:00.000] [INFO] default - 🚀  Server ready at http://localhost:5000
 Query GraphQL on http://localhost:5000/graphql
```

When you're done, you probably want to stop the docker container:
```bash
docker stop <container id>
```

### To run everything under express:

```bash
cd client && npm install && npm run build
cd ../backend && npm install && npm start
```

The server will run on http://localhost:5000 (react app will at root there **if it's been built**)
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

## Why is the solution flexible (Playing around in the GraphQL Playground)

The DB colums are mapped to the GraphQL types, this allows me to write simple `SELECT *` 
type queries and server up the data quickly. These are in the `Sqlite3DatabaseDataSource`.
However, in order to make client side rendering easier for the front-end client, I wrote a fancy
query to try to server up the required data as flatly as possible, however the GraphQL structure is still there.

This means that if you want more details, you can probably just type in the db column name under
the graphql object and the column will likely show up. 

You can try running the query used to populate the client side app there. You'll need to specify the 
variables as JSON, click "QUERY VARIABLES" buttom left of the screen.

```graphql
query($sortBy:String, $sortDirection:String, $filterByField:String, $filterByValues:[String]) {
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
  }
}
```

Since `companies` is a result of a JOIN query of all three tables to make client side rendering easier, you may wish 
to get data in each table specifically. You can view this data by requesting `company` or `company_score` or `company_price_close`
note as `company`, `company_score` and `company_price_close` each represent a table, you'll need to specify the 
columns you want to return. `company_price_close` returns a list of all closing prices, ordered by `date desc`.

Try something like this:

```graphql
{
  companies {
    company_id
    company {
      id
      name
      ticker_symbol
      score_id
    }
    company_score {
      id
      company_id
      date_generated
      dividend
      future
      health
      management
      past
      value
      misc
      total
      sentence
    }
    company_price_close {
      date
      company_id
      price
    }
  }
}
```

ID's are repeated everywhere so you can verify that the data is correct.

Have fun!

# Why the code is simple

As mentioned, the types defined the GraphQL work off a simple DB query.

For example:

I define an Object of type `SwsCompany` (`typeDef.json`) and tell GraphQL that when someone asks for `companies`,
simply call the method `getAllCompanies()` on our `db` DataSource. The DataSource returns a List<SwsCompany>.
As `SwsCompany` type fields match column names in `swsCompany` table, I simply execute a `SELECT * from swsCompany` query 
and GraphQL automatically maps each row to `SwsCompany` type and creates the list.

I also define `SwsCompanyScore` where fields match all the columns in the `swsCompanyScore`.
I add `sws_comapny_score` as a field under `SwsCompany` and tell GraphQL to resolve that field by calling a `getLatestFromTable`
method on the `db` DataSource. `getLatestFromTable` basically runs `SELECT * FROM swsCompanyScore WHERE company_id = ?`, 
the `company_id` is passed to the method as an argument from the parent (`SwsCompany`). 
This way, without complex joins I can serve up data from tables with in any format we like.

In reality, I used a more complex query, as it allowed me to get the min and max prices for the last 90 days and it 
allows me to get figure out how volatile a stock is (simply the difference between max and min price). However, there already
is a lot of flexibility in the API where you can request only the columns you want (from the front-end) and you can customize 
how data is fetched in the backend depending on the query sent to the backend (this allows us to avoid slow queries).

From the front-end, we are also able to request a list of all exchanges and snowflake score in one query, something that 
would otherwise require multiple queries.

`DataSource` provides an abstraction layer for us, in unit tests, we can point this to a hard coded JSON object as I have, 
in the `MockDatabaseDataSource` or you can point it to really any data source you like.

Code is already Kibana ready, the logger can print out in JSON format with an environment variable change. It's also simple 
to configure this to send the logs over UDP or TCP if we want.

## What could be improved

### Backend

- More GraphQL security measures should be added such as
    - Query depth
    - Payload size
- GraphQL code could be abstracted better which would allow for better testing.
- Use of `any` in the code could be removed and replaced with Typescript interfaces.
- The query could accept more optional arguments to cater for more scenarios such as:
    - Fetching company by id
    - Sorting, filtering, and limits on closing price of companies (note these are straight forward to implement, the code is flexible enough)
    
### Frontend

- Better break down of components in ReactJS.
    - `Companies` and `Company` do too much. 
- Explicit declaration of properties for components using `PropTypes`
- Instead of having filters pass state to the parents, handle this through Redux.
- Use react-hooks instead of passing state to parent
- Better structure for CSS (right now everything was shoved into `App.css`)
- Use Storybook to test and maintain for low level components.


