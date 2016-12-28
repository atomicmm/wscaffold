const debug = require('debug')('wscaffold')

const { readJSModule } = require('../utils')

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
    debug('schema initialed...', printSchema(schema))

    return req => {
        const startTime = Date.now()
        return {
            schema,
            rootValue,
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
