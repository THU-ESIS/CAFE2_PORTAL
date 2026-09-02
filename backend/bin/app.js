#!/usr/bin/env node

/**
 * Module dependencies.
 */

const initApp = require('../init')
const path = require('path')
const debug = require('debug')('cafe-portal:server')
const http = require('http')
const fileConfig = require(path.join(
  __dirname,
  '../../',
  process.argv[process.argv.length - 1],
))
const envValue = (name, fallback) => process.env[name] || fallback
const config = {
  ...fileConfig,
  port: envValue('CAFE_PORTAL_PORT', fileConfig.port),
  logDir: envValue('CAFE_PORTAL_LOG_DIR', fileConfig.logDir),
  appSecret: envValue('CAFE_PORTAL_APP_SECRET', fileConfig.appSecret),
  mysql: {
    ...fileConfig.mysql,
    host: envValue('CAFE_PORTAL_DB_HOST', fileConfig.mysql.host),
    port: envValue('CAFE_PORTAL_DB_PORT', fileConfig.mysql.port),
    username: envValue('CAFE_PORTAL_DB_USERNAME', fileConfig.mysql.username),
    password: envValue('CAFE_PORTAL_DB_PASSWORD', fileConfig.mysql.password),
    database: envValue('CAFE_PORTAL_DB_DATABASE', fileConfig.mysql.database),
  },
  endpoints: {
    ...fileConfig.endpoints,
    cafeWorker: envValue(
      'CAFE_PORTAL_CAFE_WORKER_URL',
      fileConfig.endpoints.cafeWorker,
    ),
  },
}

if (
  /^REPLACE_WITH_/.test(config.appSecret) ||
  /^REPLACE_WITH_/.test(config.mysql.password)
) {
  throw new Error(
    'Set CAFE_PORTAL_APP_SECRET and CAFE_PORTAL_DB_PASSWORD before starting the Portal',
  )
}
const env = process.env.CAFE_PORTAL_ENV || 'dev'

const app = initApp(config, env)

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(config.port)
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}
