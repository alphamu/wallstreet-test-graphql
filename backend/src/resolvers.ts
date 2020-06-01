import {CompaniesArgs} from "./args/CompaniesArgs"

export default {
  Query: {
    unique_scores: (_source: any, args: any, context: any) => {
      return context.dataSources.db.getUniqueScores()
    },
    exchange_symbols: (_source: any, args: any, context: any) => {
      return context.dataSources.db.getUniqueExchangeSymbols()
    },
    companies: (_source: any, args: any, context: any) => {
      const { sortBy, sortDirection, filterByField, filterByValues } = args
      const companyArgs = new CompaniesArgs(args)
      companyArgs.validate()
      return context.dataSources.db.getCompaniesSortedAndFiltered(
        sortBy,
        sortDirection,
        filterByField,
        filterByValues
      )
    },
  },
}
