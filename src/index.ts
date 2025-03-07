import { WorkersKVStore } from '@hono-rate-limiter/cloudflare'
import { OpenAPIHono as Hono } from '@hono/zod-openapi'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import type { Context, Next } from 'hono'
import { rateLimiter } from 'hono-rate-limiter'
import { cache } from 'hono/cache'
import { compress } from 'hono/compress'
import { csrf } from 'hono/csrf'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { timeout } from 'hono/timeout'
import { ZodError } from 'zod'
import { app as products } from './products'
import { app as users } from './users'
import type { Bindings } from './utils/bindings'
import { scheduled } from './utils/handler'
import { reference, specification } from './utils/openapi'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.tz.setDefault('Asia/Tokyo')

const app = new Hono()

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  in: 'header',
  description: 'Bearer Token'
})

app.use('*', timeout(5000))
app.use(logger())
app.use(compress({ encoding: 'deflate' }))
app.use(csrf())
app.use('*', (c, next) => {
  if (new URL(c.req.url).hostname !== 'localhost') {
    cache({ cacheName: 'discord_stripe_store', cacheControl: 'public, max-age=3600' })
  }
  return next()
})
if (!process.env.DEV) {
  app.doc('/specification', specification)
  app.get('/docs', reference)
  app.notFound((c) => c.redirect('/docs'))
}
if (process.env.DEV) {
  app.use((c: Context, next: Next) =>
    rateLimiter<{ Bindings: Bindings }>({
      windowMs: 5 * 60 * 1000,
      limit: 100,
      standardHeaders: 'draft-7',
      keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.header('cf-connecting-ip') || c.req.header('x-real-ip') || 'unknown',
      store: new WorkersKVStore({ namespace: c.env.CACHE })
    })(c, next)
  )
}
app.onError(async (error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ message: error.message }, error.status)
  }
  if (error instanceof ZodError) {
    return c.json({ message: JSON.parse(error.message), description: error.cause }, 400)
  }
  console.error(error)
  return c.json({ message: error.message }, 500)
})
app.route('/users', users)
app.route('/products', products)

export default {
  fetch: app.fetch,
  scheduled: scheduled
}
