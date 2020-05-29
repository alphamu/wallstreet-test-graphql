import {ApolloServer} from 'apollo-server';
import {typeDefs} from '../src/typeDef';
import resolvers from "../src/resolvers";

const {createTestClient} = require('apollo-server-testing');

const server = new ApolloServer({
    typeDefs,
    resolvers
})

it('should be 12 companies', async () => {
    const {query} = createTestClient(server);
    const res = await query({query: '{ companies { company_id name } }', variables: {id: 1}});
    expect(res.data).toBeDefined()
    expect(res.data.companies).toBeDefined()
    console.log(res.data.companies[0])
    expect(res.data.companies.length).toBe(12)
})
