import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class TestMember extends BaseCommand {
  static commandName = 'test:member'
  static description = 'Test get members'
  static options: CommandOptions = { startApp: true }

  async run() {
    const Project = (await import('#models/project')).default
    const project = await Project.first()
    if (!project) return this.logger.error('No project')

    try {
      await project.load('creator', (query) => query.select('id', 'name', 'email'))
      this.logger.info(`Creator: ${project.creator.name}`)

      const Notification = (await import('#models/notification')).default
      const invites = await Notification.query()
        .where('project_id', project.id)
        .where('type', 'PROJECT_INVITE')
        .preload('user', (query) => query.select('id', 'name', 'email'))
      const members = invites.filter(inv => inv.status === 'accepted').map(inv => inv.user)
      const pending = invites.filter(inv => inv.status === 'pending')

      console.log(JSON.stringify({
        creator: project.creator,
        members,
        pending
      }, null, 2))
    } catch(e: any) {
      this.logger.error(e.message)
    }
  }
}