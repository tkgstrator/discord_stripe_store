import { OpenAPIHono as Hono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'
import { app as products } from './products'
import { app as users } from './users'
import { reference, specification } from './utils/openapi'

const app = new Hono()

app.use(csrf())
app.use(logger())
app.doc('/specification', specification)
app.get('/docs', apiReference(reference))
app.route('/users', users)
app.route('/products', products)

export default {
  port: 3000,
  fetch: app.fetch
}
