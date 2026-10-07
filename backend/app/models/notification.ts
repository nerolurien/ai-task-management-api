import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Project from '#models/project'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'project_id' })
  declare projectId: number

  @column({ columnName: 'sender_id' })
  declare senderId: number

  @column()
  declare type: string

  @column()
  declare role: 'viewer' | 'editor' | 'manager' | null

  @column()
  declare status: 'pending' | 'accepted' | 'rejected'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'senderId' })
  declare sender: BelongsTo<typeof User>

  @belongsTo(() => Project, { foreignKey: 'projectId' })
  declare project: BelongsTo<typeof Project>
}