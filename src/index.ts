import { OpenAPIHono as Hono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'
import info from '../package.json'
import { app as products } from './products'
import { app as users } from './users'

const app = new Hono()

app.use(csrf())
app.use(logger())
app.doc('/specification', {
  openapi: '3.0.0',
  info: {
    title: info.name,
    version: info.version,
    license: {
      name: info.license
    }
  }
})
app.get(
  '/docs',
  apiReference({
    spec: {
      url: '/specification'
    },
    defaultHttpClient: {
      targetKey: 'node',
      clientKey: 'axios'
    },
    layout: 'modern',
    hideDownloadButton: true,
    darkMode: true,
    metaData: {
      title: info.name
    },
    theme: 'bluePlanet',
    defaultOpenAllTags: false,
    tagsSorter: 'alpha'
  })
)
app.route('/users', users)
app.route('/products', products)

export default {
  port: 3000,
  fetch: app.fetch
}
