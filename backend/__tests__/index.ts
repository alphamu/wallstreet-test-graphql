import {ApolloServer} from "apollo-server"
import {typeDefs} from "../src/typeDef"
import resolvers from "../src/resolvers"
import logger from "../src/logger"
import {MockDatabaseSource} from "../src/datasource/MockDatabaseDataSource"

const {createTestClient} = require("apollo-server-testing")

let server:ApolloServer

beforeAll(()=> {
    server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({db: new MockDatabaseSource()})
    })
}, 1000)

afterAll(() => {
    return server.stop()
})

it("should be 2 companies", async () => {
    const {query} = createTestClient(server)
    const res = await query({query: COMPANIES})
    expect(res.data).toBeDefined()
    expect(res.data.companies).toBeDefined()
    expect(res.data.companies.length).toBe(2)
    // validate values
    // validate ids
    expect(res.data.companies[0].company_id).toBe("1")
    expect(res.data.companies[1].company_id).toBe("2")
    // validate names
    expect(res.data.companies[0].name).toBe("CompanyA")
    expect(res.data.companies[1].name).toBe("CompanyB")

})

it("should be 3 scores", async () => {
    const {query} = createTestClient(server)
    const res = await query({query: SCORES})
    expect(res.data).toBeDefined()
    expect(res.data.unique_scores).toBeDefined()
    expect(res.data.unique_scores.length).toBe(3)
    for (const item of res.data.unique_scores) {
        expect(item).toBeDefined()
        expect(item.score).toBeDefined()
    }
})

it("should be 3 exchanges", async () => {
    const {query} = createTestClient(server)
    const res = await query({query: EXCHANGE})
    expect(res.data).toBeDefined()
    expect(res.data.exchange_symbols).toBeDefined()
    expect(res.data.exchange_symbols.length).toBe(3)
    for (const item of res.data.exchange_symbols) {
        expect(item).toBeDefined()
        expect(item.exchange_symbol).toBeDefined()
    }
})

it("combined request are all present", async () => {
    const {query} = createTestClient(server)
    const res = await query({query: ALL})
    expect(res.data).toBeDefined()
    // Are exchanges present
    expect(res.data.exchange_symbols).toBeDefined()
    expect(res.data.exchange_symbols.length).toBe(3)
    // Are Scores Present
    expect(res.data.unique_scores).toBeDefined()
    expect(res.data.unique_scores.length).toBe(3)
    // Are companies present
    expect(res.data.companies).toBeDefined()
    expect(res.data.companies.length).toBe(2)
})

const ALL = "" +
    "{" +
    "  unique_scores {" +
    "    score" +
    "  }" +
    "  exchange_symbols {" +
    "    exchange_symbol" +
    "  }" +
    "  companies {" +
    "    company_id" +
    "    name" +
    "    score" +
    "    min_price" +
    "    max_price" +
    "    volatile_score" +
    "    exchange_symbol" +
    "    unique_symbol" +
    "  }" +
    "}"

const COMPANIES = "" +
    "{" +
    "  companies {" +
    "    company_id" +
    "    name" +
    "    score" +
    "    min_price" +
    "    max_price" +
    "    volatile_score" +
    "    exchange_symbol" +
    "    unique_symbol" +
    "  }" +
    "}"

const SCORES = "" +
    "{" +
    "  unique_scores {" +
    "   score" +
    "  }" +
    "}"

const EXCHANGE = "" +
    "{" +
    "  exchange_symbols {" +
    "    exchange_symbol" +
    "   }" +
    "}"