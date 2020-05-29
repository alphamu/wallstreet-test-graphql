import {strIsEmpty, strIsNotEmpty} from './utils';
import db from './db';

export default {
    Query: {
        companies: (obj: any, args: any) => {
            const { sortBy, sortDirection, filterByField, filterByValues } = args
            if (strIsNotEmpty(sortBy) && !['volatile', 'score'].includes(sortBy)) {
                throw new Error(`Valid values for sortBy are ${['volatile', 'score']}`)
            }
            if (
                strIsNotEmpty(sortDirection) &&
                (strIsEmpty(sortBy) || !['desc', 'asc'].includes(sortDirection))
            ) {
                throw new Error(
                    `Valid values for sortDirection are ${[
                        'desc',
                        'asc',
                    ]} and sortBy must be defined`
                )
            }
            if (
                strIsNotEmpty(filterByField) &&
                !['total', 'exchange_symbol'].includes(filterByField)
            ) {
                throw new Error(
                    `Valid values for filterByField are ${[
                        'total',
                        'exchange_symbol',
                    ]} and filterByField must be defined`
                )
            }
            if (
                filterByValues &&
                (strIsEmpty(filterByField) || filterByValues.length < 1)
            ) {
                throw new Error(
                    'filterByField must be defined and filterByValues must contain at least 1 element in an array'
                )
            }
            return db.getCompaniesSortedAndFiltered(
                sortBy,
                sortDirection,
                filterByField,
                filterByValues
            )
        },
    },
}
