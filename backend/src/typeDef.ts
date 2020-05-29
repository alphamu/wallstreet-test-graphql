import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  directive @date(defaultFormat: String = "mmmm d, yyyy") on FIELD_DEFINITION

  directive @allFromDb(
    table: String
    column: String
    defaultOrderBy: String
  ) on FIELD_DEFINITION
  directive @latestFromDb(
    table: String
    column: String
    defaultOrderBy: String
  ) on FIELD_DEFINITION
  directive @filteredAndSortedFromDb(
    sortBy: String
    sortDirection: String
    filterByField: String
    filterByValues: [String]
  ) on FIELD_DEFINITION

  directive @mustBeOneOf(values: [String]) on FIELD_DEFINITION

  scalar Date
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type CompaniesSortedFiltered {
    company_id: ID
    score: Int
    min_price: Float
    max_price: Float
    volatile_score: Float
    name: String
    ticker_symbol: String
    exchange_symbol: String
    unique_symbol: String
    date_generated: Date @date
    security_name: String
    exchange_country_iso: String
    listing_currency_iso: String
    canonical_url: String
    unique_symbol_slug: String
    score_id: String
    company: SwsCompany
      @latestFromDb(
        table: "swsCompany"
        column: "id"
        defaultOrderBy: "date_generated DESC"
      )
    company_price_close: [SwsCompanyPriceClose]
      @allFromDb(
        table: "swsCompanyPriceClose"
        column: "company_id"
        defaultOrderBy: "date_created DESC"
      )
    company_score: SwsCompanyScore
      @latestFromDb(
        table: "swsCompanyScore"
        column: "company_id"
        defaultOrderBy: "date_generated DESC"
      )
  }

  type SwsCompany {
    id: ID
    name: String
    ticker_symbol: String
    exchange_symbol: String
    unique_symbol: String
    date_generated: Date @date
    security_name: String
    exchange_country_iso: String
    listing_currency_iso: String
    canonical_url: String
    unique_symbol_slug: String
    score_id: String
    company_price_close: [SwsCompanyPriceClose]
      @allFromDb(
        table: "swsCompanyPriceClose"
        column: "company_id"
        defaultOrderBy: "date_created DESC"
      )
    company_score: SwsCompanyScore
      @latestFromDb(
        table: "swsCompanyScore"
        column: "company_id"
        defaultOrderBy: "date_generated DESC"
      )
  }

  type SwsCompanyPriceClose {
    date: Date @date
    company_id: ID
    price: Float
    date_created: Date @date
  }

  type SwsCompanyScore {
    id: ID
    company_id: ID
    date_generated: Date @date
    dividend: Int
    future: Int
    health: Int
    management: Int
    past: Int
    value: Int
    misc: Int
    total: Int
    sentence: String
  }

  type Query {
    companies(
      sortBy: String
      sortDirection: String
      filterByField: String
      filterByValues: [String]
    ): [CompaniesSortedFiltered]
  }
`
