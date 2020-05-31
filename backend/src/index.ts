import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './typeDef'
import schemaDirectives from './schemaDirectives'
import logger from './logger'
import resolvers from './resolvers'
import { Sqlite3DatabaseSource } from './datasource/sqlite3DatabaseDataSource'

const app = express()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  logger,
  dataSources: () => ({
    db: new Sqlite3DatabaseSource(),
  }),
})
server.applyMiddleware({
  app,
  path: '/graphql',
})

app.use('/graphql', (req, res, next) => {
  // Allow GET (Playground)
  if (req.method === 'GET') {
    return next()
  }
})

app.use(express.static('../client/build'))

app.listen(parseInt(process.env.SERVICE_PORT || '5000', 10), () =>
  logger.info(
    '🚀  Server ready at http://localhost:5000\n Query GraphQL on http://localhost:5000/graphql'
  )
)
