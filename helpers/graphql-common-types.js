//标准返回的对象
const ObjectType = `
    type Object {
        id: ID! obj: String
    }
`
const ResultType = `
    type Result {
        state: Int! msg: String data: String
    }
`

//分页对象
const PageType = `
    type Page {
        totalNum:Int! pageSize:Int! countPage:Int! currentPage:Int! items:[Object]
    }
`

//标准输入
const ObjectInputType = `
    input ObjectInput {
        payload: String
    }
`

//分页查询
const PageQueryInputType = `
    input PageQueryInput {
        cond: String offset: Int limit: Int
    }
`

module.exports = {
    ObjectType,
    PageType,
    ResultType,
    ObjectInputType,
    PageQueryInputType
}
