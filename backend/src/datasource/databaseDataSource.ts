import { DataSource, DataSourceConfig } from 'apollo-datasource'

export interface DatabaseDataSource extends DataSource {
  getAllCompanies(): Promise<any[]>

  getAllFromTable(
    table: string,
    column: string,
    value: string | number,
    orderBy: string
  ): Promise<any[]>

  getLatestFromTable(
    table: string,
    column: string,
    value: string | number,
    orderBy: string
  ): Promise<any>

  getCompaniesSortedAndFiltered(
    sortBy: string,
    sortDirection: string,
    filterByField: string,
    filterByValues: string[]
  ): Promise<any[]>
  getUniqueExchangeSymbols(): Promise<any[]>

  getUniqueScores(): Promise<any[]>
}
