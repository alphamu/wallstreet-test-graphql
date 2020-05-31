import sqlite3 from 'sqlite3'
import formatDate from 'dateformat'
import {DatabaseDataSource} from './databaseDataSource'
import {DataSourceConfig} from 'apollo-datasource'

const verboseSqlite3 = sqlite3.verbose()
const sqlite3DatabaseDataSource = new verboseSqlite3.Database('./sws.sqlite3')

export class MockDatabaseSource implements DatabaseDataSource {
  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    return undefined
  }

  getAllCompanies(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // not really used, so not mocked
      resolve([])
    })
  }

  getAllFromTable(
    table: string,
    column: string,
    value: string | number,
    orderBy: string
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      resolve([]) // not really used, so not mocked
    })
  }

  getCompaniesSortedAndFiltered(
    sortBy = '1',
    sortDirection = 'DESC',
    filterByField: string,
    filterByValues: string[]
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      resolve([
        {
          "company_id": "1",
          "name": "CompanyA",
          "score": 1,
          "min_price": 2.0,
          "max_price": 3.1,
          "volatile_score": 1.1,
          "exchange_symbol": "A",
          "unique_symbol": "A:A"
        },
        {
          "company_id": "2",
          "name": "CompanyB",
          "score": 2,
          "min_price": 3.1,
          "max_price": 4.0,
          "volatile_score": 0.9,
          "exchange_symbol": "NasdaqGS",
          "unique_symbol": "NasdaqGS:AMZ"
        }
      ])
    })
  }

  getLatestFromTable(
    table: string,
    column: string,
    value: string | number,
    orderBy: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({}) // not really used, so not mocked
    })
  }

  getUniqueExchangeSymbols(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      resolve([
        {
          "exchange_symbol": "A"
        },
        {
          "exchange_symbol": "B"
        },
        {
          "exchange_symbol": "C"
        }
      ])
    })
  }

  getUniqueScores(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      resolve([
          {
            "score": "1"
          },
          {
            "score": "2"
          },
          {
            "score": "3"
          }
      ])
    })
  }
}
