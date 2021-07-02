import { Router } from 'itty-router'
import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

const router = Router()

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
  let array = new Uint32Array(1)
  let randomValues = crypto.getRandomValues(array)
  let unpadded = randomValues[0].toString(16)
  let key = '00000000'.slice(unpadded.length) + unpadded

  let parsedBody = await request.json()
  if ('url' in parsedBody) {
    await SHORTEN.put(key, parsedBody.url, { expirationTtl: 86400 })
    let responseBody = {
      message: 'Link shortened successfully',
      key,
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
