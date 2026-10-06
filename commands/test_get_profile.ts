import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class TestGetProfile extends BaseCommand {
  static commandName = 'test:get_profile'
  static description = 'Test get profile'
  static options: CommandOptions = { startApp: true }

  async run() {
    const User = (await import('#models/user')).default
    const user = await User.first()
    if (!user) return this.logger.error('No user found')

    const token = await User.accessTokens.create(user)
    
    // fetch over http
    const http = await import('http')
    const options = {
      hostname: 'localhost',
      port: 3333,
      path: '/profile',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value!.release()}`
      }
    }

    const req = http.request(options, (res: any) => {
      let data = ''
      res.on('data', (chunk: string) => {
        data += chunk
      })
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`)
        console.log(`Body: ${data}`)
      })
    })

    req.on('error', (e: any) => {
      console.error(e)
    })

    req.end()
  }
}