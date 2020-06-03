enum SortBy {
    volatile = "volatile",
    score = "score"
}

enum SortDirection {
    asc = "asc",
    desc = "desc"
}

enum FilterField {
    total = "total",
    exchange_symbol = "exchange_symbol"
}

export interface IArgs {
    validate(): void
}

export class CompaniesArgs implements IArgs {
    sortBy: SortBy
    sortDirection: SortDirection
    filterByField: FilterField
    filterByValues: string[]

    constructor({sortBy, sortDirection, filterByField, filterByValues}: CompaniesArgs) {
        this.sortBy = sortBy
        this.sortDirection = sortDirection
        this.filterByField = filterByField
        this.filterByValues = filterByValues
    }

    validate(): void {
        let errorMessage = ""

        if (stringDefined(this.sortBy) || stringDefined(this.sortDirection)) {
            errorMessage += this.validateSort()
        }

        if (stringDefined(this.filterByField) || this.filterByValues) {
            errorMessage += this.validateFilter()
        }

        if (errorMessage.length > 0) {
            throw new Error(errorMessage)
        }
    }

    validateSort(): string {
        if (!Object.values(SortBy).includes(this.sortBy)) {
            return `Valid values for sortBy are: ${Object.values(SortBy)}\n`
        }
        if (!Object.values(SortDirection).includes(this.sortDirection)) {
            return `Valid values for sortDirection are: ${Object.values(SortDirection)}\n`
        }
        return ""
    }

    validateFilter(): string {
        if (!Object.values(FilterField).includes(this.filterByField)) {
            return `Valid values for filterByField are: ${Object.values(FilterField)}\n`
        }

        if (!this.filterByValues || this.filterByValues.length === 0) {
            return `filterByValues cannot be empty\n`
        }

        return ""

    }
}

function stringDefined(str: string) {
    return (str !== undefined && str !== null)
}