import sqlite3 from 'sqlite3'
import formatDate from 'dateformat'
import { log4db as log } from '../logger'
import { DatabaseDataSource } from './databaseDataSource'
import { DataSourceConfig } from 'apollo-datasource'
import {ExchangeSymbol} from "./resp/ExchangeSymbol"
import {SnowflakeScore} from "./resp/SnowflakeScore"

const verboseSqlite3 = sqlite3.verbose()
const sqlite3DatabaseDataSource = new verboseSqlite3.Database('./sws.sqlite3')

export class Sqlite3DatabaseSource implements DatabaseDataSource {
  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    return undefined
  }

  getAllCompanies(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      sqlite3DatabaseDataSource.serialize(() => {
        sqlite3DatabaseDataSource.all(
          'SELECT * FROM swsCompany',
          (err: any, rows: any) => {
            if (err) reject(err)
            resolve(rows)
          }
        )
      })
    })
  }

  getAllFromTable(
    table: string,
    column: string,
    value: string | number,
    orderBy: string
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      sqlite3DatabaseDataSource.serialize(() => {
        const stmt = sqlite3DatabaseDataSource.prepare(
          `SELECT * FROM ${table} WHERE ${column} = ? ORDER BY ${
            orderBy || '1'
          }`
        )
        stmt.all(value, (err: any, rows: any) => {
          if (err) reject(err)
          resolve(rows)
        })
        stmt.finalize()
      })
    })
  }

  getCompaniesSortedAndFiltered(
    sortBy = '1',
    sortDirection = 'DESC',
    filterByField: string,
    filterByValues: string[]
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const ago90 = new Date()
      ago90.setDate(ago90.getDate() - 90)
      const ago90Str = formatDate(ago90, 'yyyy-mm-dd')
      sqlite3DatabaseDataSource.serialize(() => {
        const sql = `
                    SELECT
                        c.id AS company_id,
                        s.total AS score,
                        MIN(p.price) AS min_price,
                        MAX(p.price) AS max_price,
                        MAX(p.price) - MIN(p.price) volatile_score,
                        c.*
                    FROM
                        swsCompany c
                        INNER JOIN swsCompanyScore s ON c.score_id = s.id
                        LEFT OUTER JOIN swsCompanyPriceClose p ON c.id = p.company_id
                    WHERE
                        p.date_created > '${
                          sortBy === 'volatile' ? ago90Str : '1901-01-01'
                        }'
                        ${
                          filterByField
                            ? `AND ${filterByField} IN ('${filterByValues.join(
                                "','"
                              )}')`
                            : ''
                        }
                    GROUP BY
                        c.id
                    ORDER BY
                        ${
                          sortBy === 'volatile'
                            ? '5'
                            : sortBy === 'score'
                            ? '2'
                            : '1'
                        } ${sortDirection}
                `
        sqlite3DatabaseDataSource.all(sql, (err: any, rows: any) => {
          if (err) reject(err)
          resolve(rows)
        })
      })
    })
  }

  getLatestFromTable(
    table: string,
    column: string,
    value: string | number,
    orderBy: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      sqlite3DatabaseDataSource.serialize(() => {
        const stmt = sqlite3DatabaseDataSource.prepare(
          `SELECT * FROM ${table} WHERE ${column} = ? ORDER BY ${
            orderBy || '1'
          } LIMIT 0,1`
        )
        stmt.each(value, (err: any, row: any) => {
          if (err) reject(err)
          resolve(row)
        })
        stmt.finalize()
      })
    })
  }

  getUniqueExchangeSymbols(): Promise<ExchangeSymbol[]> {
    return new Promise((resolve, reject) => {
      sqlite3DatabaseDataSource.serialize(() => {
        sqlite3DatabaseDataSource.all(
          'SELECT DISTINCT(exchange_symbol) as exchange_symbol FROM swsCompany ORDER BY 1',
          (err: any, rows: ExchangeSymbol[]) => {
            if (err) reject(err)
            resolve(rows)
          }
        )
      })
    })
  }

  getUniqueScores(): Promise<SnowflakeScore[]> {
    return new Promise((resolve, reject) => {
      sqlite3DatabaseDataSource.serialize(() => {
        sqlite3DatabaseDataSource.all(
          'SELECT DISTINCT(s.total) AS score ' +
            'FROM swsCompany c ' +
            'INNER JOIN swsCompanyScore s ON c.id = s.company_id ' +
            'ORDER BY 1',
          (err: any, rows: SnowflakeScore[]) => {
            if (err) reject(err)
            resolve(rows)
          }
        )
      })
    })
  }
}
