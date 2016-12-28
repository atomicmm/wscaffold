const LOGGER_TRACE = require('debug')('app:TRACE')
const LOGGER_INFO = require('debug')('app:INFO')
const LOGGER_ERROR = require('debug')('app:ERROR')

//bind to stdout
LOGGER_TRACE.log = console.log.bind(console)
LOGGER_INFO.log = console.log.bind(console)

module.exports = { trace: LOGGER_TRACE, info: LOGGER_INFO, error: LOGGER_ERROR }
