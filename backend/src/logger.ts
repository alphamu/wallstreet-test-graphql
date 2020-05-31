import log4js from 'log4js'

log4js.addLayout('json', (config) => {
  return (logEvent) => {
    return JSON.stringify(logEvent) + config.separator
  }
})

log4js.configure({
  appenders: {
    string: { type: 'stdout' },
    json: { type: 'stdout', layout: { type: 'json', separator: '' } },
  },
  categories: {
    default: {
      appenders: [process.env.LOG_FORMAT || 'string'],
      level: process.env.LOG_LEVEL || 'debug',
    },
    db: {
      appenders: [process.env.LOG_FORMAT || 'string'],
      level: process.env.LOG_FORMAT || 'debug',
    },
    index: {
      appenders: [process.env.LOG_FORMAT || 'string'],
      level: process.env.LOG_FORMAT || 'debug',
    },
    directives: {
      appenders: [process.env.LOG_FORMAT || 'string'],
      level: process.env.LOG_FORMAT || 'debug',
    },
    typedef: {
      appenders: [process.env.LOG_FORMAT || 'string'],
      level: process.env.LOG_FORMAT || 'debug',
    },
    resolver: {
      appenders: [process.env.LOG_FORMAT || 'string'],
      level: process.env.LOG_FORMAT || 'debug',
    },
  },
})
export default log4js.getLogger()

export const log4db = log4js.getLogger('db')
export const log4index = log4js.getLogger('index')
export const log4directives = log4js.getLogger('directives')
export const log4typedef = log4js.getLogger('typedef')
export const log4resolver = log4js.getLogger('resolver')
