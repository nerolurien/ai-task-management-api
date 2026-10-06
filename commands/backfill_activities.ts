import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class BackfillActivities extends BaseCommand {
  static commandName = 'backfill:activities'
  static description = 'Migrate old AI commands from audit_logs to activities'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const AuditLog = (await import('#models/audit_log')).default
    const Activity = (await import('#models/activity')).default

    const logs = await AuditLog.query().where('action', 'AI_COMMAND').where('status', 'success')
    let count = 0

    for (const log of logs) {
      const results = log.responsePayload?.results
      if (Array.isArray(results)) {
        for (const res of results) {
          if (res.action === 'CREATE' && res.task) {
            await Activity.create({
              projectId: res.task.projectId,
              userId: log.userId,
              action: `[AI] membuat task baru "${res.task.title}"`,
              createdAt: log.createdAt,
              updatedAt: log.updatedAt
            })
            count++
          } else if (res.action === 'UPDATE' && res.task) {
            await Activity.create({
              projectId: res.task.projectId,
              userId: log.userId,
              action: `[AI] mengubah data pada task "${res.task.title}"`,
              createdAt: log.createdAt,
              updatedAt: log.updatedAt
            })
            count++
          }
        }
      }
    }

    this.logger.success(`Berhasil migrasi ${count} aktivitas AI lama!`)
  }
}
