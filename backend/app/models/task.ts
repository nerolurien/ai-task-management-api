import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'
import User from '#models/user'
import Comment from '#models/comment'
import Subtask from '#models/subtask'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'project_id' })
  declare projectId: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare status: 'todo' | 'in_progress' | 'done'

  @column()
  declare priority: 'low' | 'medium' | 'high'

  @column.date()
  declare dueDate: DateTime | null

  @column({ columnName: 'assignee_id' })
  declare assigneeId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Project, { foreignKey: 'projectId' })
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => User, { foreignKey: 'assigneeId' })
  declare assignee: BelongsTo<typeof User>

  @hasMany(() => Comment, { foreignKey: 'taskId' })
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Subtask, { foreignKey: 'taskId' })
  declare subtasks: HasMany<typeof Subtask>
}