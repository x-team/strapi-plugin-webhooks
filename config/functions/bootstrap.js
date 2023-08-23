const webhooksById = {}
const fetch = require('node-fetch')

async function runWebhook ({ webhook, event, info }) {
  const { url, headers } = webhook

  try {
    const res = await fetch(url, {
      method: 'post',
      body: JSON.stringify({
        event,
        created_at: new Date(),
        ...info
      }),
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })

    const { status } = res
    return res.ok ? { status } : { status, message: await res.text() }
  } catch (err) {
    const { message } = err
    return {
      status: 500,
      message
    }
  }
}

async function handleEvent (event, info) {
  const { model, entry } = info

  // Don't inform webhooks about non-existing entries
  if (!entry) {
    return
  }

  const ignoredModels = ['webhook']

  if (ignoredModels.includes(model)) {
    return
  }

  const lookup = await setupWebhookCache()
  const modelEvent = `${model}.${event}`
  const modelStar = `${model}.*`

  Object.values(lookup)
    .filter(webhook => webhook.enabled)
    .forEach(async webhook => {
      try {
        const { events } = webhook
        if (events.includes(modelStar) || events.includes(modelEvent)) {
          const res = await runWebhook({ webhook, event, info })
          strapi.log.info(
            `[webhook] [id:${webhook.id}] ${model}.${event}: ${JSON.stringify(
              res
            )}`
          )
        }
      } catch (err) {
        strapi.log.error(err)
      }
    })
}

async function setupWebhookCache () {
  // memoize
  // eslint-disable-next-line no-func-assign
  setupWebhookCache = () => webhooksById

  const plugin = 'webhooks'
  const records = await strapi
    .query('webhook', plugin)
    .find({ enabled: true }, [])

  records.forEach(r => {
    webhooksById[r.id] = r
  })

  strapi.log.info(`[webhooks] found enabled: ${records.length}`)

  return webhooksById
}

async function updateWebhookCache (event, data) {
  if (event === 'create' || event === 'update') {
    webhooksById[data.id] = data
    return
  }

  if (event === 'delete') {
    delete webhooksById[data.id]
  }
}

module.exports = async () => {
  strapi.log.info('[webhooks] started')

  const { eventHub } = strapi.webhookRunner

  const events = ['create', 'update', 'delete']

  events.forEach(event =>
    eventHub.on(`entry.${event}`, info => handleEvent(event, info))
  )

  events.forEach(event =>
    eventHub.on(`entry.${event}`, async ({ model, entry }) => {
      if (model === 'webhook') {
        await updateWebhookCache(event, entry)
      }
    })
  )
}
