import info from '@/../package.json'
import { apiReference } from '@scalar/hono-api-reference'
import type { Env, MiddlewareHandler } from 'hono'

export const reference: MiddlewareHandler<Env> = apiReference({
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
  theme: 'default',
  defaultOpenAllTags: false,
  tagsSorter: 'alpha'
})

export const specification = {
  openapi: '3.0.0',
  info: {
    title: info.name,
    version: info.version,
    license: {
      name: info.license
    }
  }
}
