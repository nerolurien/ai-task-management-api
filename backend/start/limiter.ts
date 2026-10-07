/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'

export const throttle = limiter.define('global', () => {
  return limiter.allowRequests(100).every('1 minute')
})

export const authThrottle = limiter.define('auth', () => {
  return limiter.allowRequests(5).every('5 minutes') // max 5 attempts per 5 mins
})
export const aiThrottle = limiter.define('ai', (ctx) => {
  const userId = ctx.auth.user?.id || ctx.request.ip()
  return limiter.allowRequests(15).every('10 minutes').usingKey("ai_$userId")
})
