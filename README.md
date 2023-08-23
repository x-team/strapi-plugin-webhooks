# Strapi plugin webhooks

A slightly better version of strapi's built-in webhooks.

## Events

To subscribe to events you must specify the model and the event types your webhook is interested in, in the format `${model}.${event}`. Eg:

```
["company.create"]
```

A wildcard can be used to subscribe to all events of a model. Eg:

```
["company.*", "contact.*"]
```