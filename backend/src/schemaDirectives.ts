import { SchemaDirectiveVisitor } from 'graphql-tools'
import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import formatDate from 'dateformat'
import { log4directives as log } from './logger'

class DateFormatDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field
    const { defaultFormat } = this.args

    field.args.push({
      astNode: undefined,
      defaultValue: undefined,
      description: undefined,
      extensions: undefined,
      name: 'format',
      type: GraphQLString,
    })

    field.resolve = async (source, { format, ...otherArgs }, context, info) => {
      const date = await resolve.call(this, source, otherArgs, context, info)
      return formatDate(date, format || defaultFormat)
    }

    field.type = GraphQLString
  }
}

class AllFromDatabaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    field.resolve = async (source, args, context) => {
      return context.dataSources.db.getAllFromTable(
        this.args.table,
        this.args.column,
        source.company_id || source.id,
        this.args.defaultOrderBy
      )
    }
  }
}

class LatestFromDatabaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    field.resolve = async (source, args, context) => {
      return context.dataSources.db.getLatestFromTable(
        this.args.table,
        this.args.column,
        source.company_id || source.id,
        this.args.defaultOrderBy
      )
    }
  }
}

class FilteredAndSortedDatabaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    field.resolve = async (source, params, context) => {
      log.debug(
        'FilteredAndSortedDatabaseDirective',
        this.args.sortedBy,
        this.args.sortDirection,
        this.args.filterByField,
        this.args.filterByValues
      )
      return context.dataSources.db.getCompaniesSortedAndFiltered(
        this.args.sortedBy,
        this.args.sortDirection,
        this.args.filterByField,
        this.args.filterByValues
      )
    }
  }
}

export default {
  date: DateFormatDirective,
  allFromDb: AllFromDatabaseDirective,
  latestFromDb: LatestFromDatabaseDirective,
  filteredAndSortedFromDb: FilteredAndSortedDatabaseDirective,
}
