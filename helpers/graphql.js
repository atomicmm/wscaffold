const debug = require('debug')('wscaffold')

const { readJSModule } = require('../utils')
const defaultTypes = require('../helpers/graphql-common-types')

/**
 * @param schemaPath graphql模块描述文件，相对于process.cwd()的路径
 *
 * 需求格式{
 *   type,
 *   query,
 *   mutation,
 *   resolver
 * }
 */
function buildGraphQLSchema(schemaPath) {
    const { buildSchema, printSchema } = require('graphql')

    const modules = readJSModule(schemaPath)
    debug(`find ${Object.keys(modules).length} type-modules in ${schemaPath}`)

    let rootValue = {}
    let types = []
    let queriers = ['_:String']
    let mutations = ['_:String']

    types.push(defaultTypes.ObjectType, defaultTypes.ResultType, defaultTypes.PageType, defaultTypes.ObjectInputType, defaultTypes.PageQueryInputType)

    modules.forEach(i => {
        const { type, query, mutation, resolver } = require(i)
        if (type) types.push(type)
        if (query) queriers.push(...query)
        if (mutation) mutations.push(...mutation)
        if (resolver) Object.assign(rootValue, resolver)
    })

    const finalSchema = `
    ${types.join(' ')}

    type Query {
    ${queriers.join(' ')}
    }

    type Mutation {
    ${mutations.join(' ')}
    }
    `
    const schema = buildSchema(finalSchema)
    debug('schema initialed...\n ', printSchema(schema))
    const isDebugMode = process.env.NODE_ENV !== 'production'

    return req => {
        const startTime = Date.now()
        return {
            schema,
            rootValue,
            graphiql: isDebugMode,
            pretty: true,
            extensions() {
                return { runTime: Date.now() - startTime }
            },
            formatError(error) {
                return {
                    message: error.message,
                    locations: error.locations,
                    stack: error.stack
                }
            }
        }

    }
}

module.exports = { buildGraphQLSchema }
