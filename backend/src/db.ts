import sqlite3 from 'sqlite3'
import formatDate from 'dateformat'
import { log4db as log } from './logger'

const verboseSqlite3 = sqlite3.verbose()
const db = new verboseSqlite3.Database('./sws.sqlite3')

export default {
  getAllCompanies: () => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all('SELECT * FROM swsCompany', (err: any, rows: any) => {
          if (err) reject(err)
          resolve(rows)
        })
      })
    })
  },

  getAllFromTable: (
    table: string,
    column: string,
    value: string | number,
    orderBy: string
  ) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        const stmt = db.prepare(
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
  },

  getLatestFromTable: (
    table: string,
    column: string,
    value: string | number,
    orderBy: string
  ) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        const stmt = db.prepare(
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
  },

  getCompaniesSortedAndFiltered: (
    sortBy = '1',
    sortDirection = 'DESC',
    filterByField: string,
    filterByValues: string[]
  ) => {
    return new Promise((resolve, reject) => {
      const ago90 = new Date()
      ago90.setDate(ago90.getDate() - 90)
      const ago90Str = formatDate(ago90, 'yyyy-mm-dd')
      db.serialize(() => {
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
        console.debug(sql)
        db.all(sql, (err: any, rows: any) => {
          if (err) reject(err)
          resolve(rows)
        })
      })
    })
  },
}
