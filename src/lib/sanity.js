import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: '3ouodvma',
  dataset: 'production',
  apiVersion: '2025-02-08',
  useCdn: true,
  autoUpdates: true,
})