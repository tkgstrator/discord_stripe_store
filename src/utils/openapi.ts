import info from '@/../package.json'
import type { ApiReferenceOptions } from '@scalar/hono-api-reference'

export const reference: ApiReferenceOptions = {
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
}

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
