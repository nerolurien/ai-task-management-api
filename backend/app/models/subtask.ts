import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Task from '#models/task'

export default class Subtask extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'task_id' })
  declare taskId: number

  @column()
  declare title: string

  @column({ columnName: 'is_completed' })
  declare isCompleted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Task)
  declare task: BelongsTo<typeof Task>
}