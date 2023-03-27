
require('dotenv').config()

import config from './config'

import { Server } from '@hapi/hapi'

import { log } from './log'

import { join } from 'path'

const Joi = require('joi')

const Pack = require('../package');

import { load } from './server/handlers'

const handlers = load(join(__dirname, './server/handlers'))

export const server = new Server({
  host: config.get('host'),
  port: config.get('port'),
  routes: {
    cors: true,
    validate: {
      options: {
        stripUnknown: true
      }
    }
  }
});

if (config.get('prometheus_enabled')) {

  log.info('server.metrics.prometheus', { path: '/metrics' })

  const { register: prometheus } = require('./metrics')

  server.route({
    method: 'GET',
    path: '/metrics',
    handler: async (req, h) => {
      return h.response(await prometheus.metrics())
    },
    options: {
      description: 'Prometheus Metrics about Node.js Process & Business-Level Metrics',
      tags: ['system']
    }
  })

}

server.route({
  method: 'GET', path: '/api/v0/status',
  handler: handlers.Status.index,
  options: {
    description: 'Simply check to see that the server is online and responding',
    tags: ['api', 'system'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        status: Joi.string().valid('OK', 'ERROR').required(),
        error: Joi.string().optional()
      }).label('ServerStatus')
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/webhooks/github/pow-co',
  handler: handlers.GithubWebhooks.create,
  options: {
    description: 'Receive and log all webhooks for pow-co organization on Github',
    tags: ['api', 'webhooks', 'github']
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/webhooks/github',
  handler: handlers.GithubWebhooks.create,
  options: {
    description: 'Receive and log all webhooks for pow-co organization on Github',
    tags: ['api', 'webhooks', 'github']
  }
})

server.route({
  method: 'POST',
  path: '/api/v1/github/tokens',
  handler: handlers.GithubTokens.create
})

server.route({
  method: 'GET',
  path: '/api/v1/webhooks/github/pow-co',
  handler: handlers.GithubWebhooks.index,
  options: {
    description: 'List all webhooks for pow-co organization on Github',
    tags: ['api', 'webhooks', 'github']
  }
})

server.route({
  method: 'GET',
  path: '/auth/github/callback',
  handler: handlers.GithubAuth.callback,
  options: {
    description: 'Handle Authentication From Github Apps',
    tags: ['github', 'auth']
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/github/issues/{org}',
  handler: handlers.GithubIssues.index,
  options: {
    description: 'List all issues for github organization',
    tags: ['api', 'github', 'issues']
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/github/issues/{org}/{repo}',
  handler: handlers.GithubIssues.repo,
  options: {
    description: 'List all issues for github repo',
    tags: ['api', 'github', 'issues'],
    validate: {
      query: Joi.object({
        state: Joi.string().valid('open', 'closed', 'all').optional(),
        start_date: Joi.date().optional(),
        end_date: Joi.date().optional()
      }).optional(),
      params: Joi.object({
        org: Joi.string().optional(),
        repo: Joi.string().optional()
      }).optional()
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/boostpow/rankings/github/issues/{org}/{repo}',
  handler: handlers.Rankings.show,
  options: {
    description: 'List all issues for github repo by boostpow ranking',
    tags: ['api', 'github', 'issues', 'boostpow']
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/boostpow/rankings/github/issues/{org}',
  handler: handlers.Rankings.show,
  options: {
    description: 'List all issues for github repo by boostpow ranking',
    tags: ['api', 'github', 'issues', 'boostpow']
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/boostpow/rankings/github/issues',
  handler: handlers.Rankings.show,
  options: {
    description: 'List all issues for github repo by boostpow ranking',
    tags: ['api', 'github', 'issues', 'boostpow']
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/content/{txid}',
  handler: handlers.Content.show,
  options: {
    description: 'Show content parsed from DevIssue smart contract',
    tags: ['api', 'github', 'issues']
  }
})

var started = false

export async function start() {

  if (started) return;

  started = true

  const swaggerOptions = {
    info: {
      title: 'API Docs',
      version: Pack.version,
      description: 'Developer API Documentation \n\n *** DEVELOPERS *** \n\n Edit this file under `swaggerOptions` in `src/server.ts` to better describe your service.'
    },
    schemes: ['https'],
    host: 'powco.dev',
    documentationPath: '/api',
    grouping: 'tags'
  }

  const Inert = require('@hapi/inert');

  const Vision = require('@hapi/vision');

  const HapiSwagger = require('hapi-swagger');

  await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions
      }
  ]);

  log.info('server.api.documentation.swagger', swaggerOptions)

  await server.start();

  log.info(server.info)

  return server;

}

if (require.main === module) {

  start()

}
