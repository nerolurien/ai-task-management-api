import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class TestProfile extends BaseCommand {
  static commandName = 'test:profile'
  static description = 'Test profile data'
  static options: CommandOptions = { startApp: true }

  async run() {
    const User = (await import('#models/user')).default
    const users = await User.all()
    console.log(users.map(u => ({ id: u.id, name: u.name, email: u.email })))
  }
}