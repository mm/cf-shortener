import { Router } from 'itty-router'
import { customAlphabet } from 'nanoid'
import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

const router = Router()
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6)

router.get('/:key', async request => {
  let link = await SHORTEN.get(request.params.key)

  if (link) {
    return new Response(null, {
      headers: { Location: link },
      status: 301,
    })
  } else {
    // If we couldn't find the link, request the 404 static page:
    return new Response('Key not found', {
      status: 400,
    })
  }
})

router.post('/links', async request => {
  let key = nanoid();
  let parsedBody = await request.json()
  if ('url' in parsedBody) {
    // Add key to our KV store so it can be retrieved later:
    await SHORTEN.put(key, parsedBody.url, { expirationTtl: 86400 })
    let shortenedURL = `${new URL(request.url).origin}/${key}`
    let responseBody = {
      message: 'Link shortened successfully',
      key,
      shortened: shortenedURL,
    }
    return new Response(JSON.stringify(responseBody), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    })
  }
})

async function handleEvent(event) {
  let requestUrl = new URL(event.request.url)
  if (requestUrl.pathname === '/' || requestUrl.pathname.includes('static')) {
    return await getAssetFromKV(event)
  } else {
    return await router.handle(event.request)
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})
