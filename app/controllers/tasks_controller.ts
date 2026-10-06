import type { HttpContext } from '@adonisjs/core/http'
import Task from '#models/task'
import Subtask from '#models/subtask'

export default class TasksController {
  /**
   * POST /tasks
   * Membuat task baru secara manual
   */
  async store({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const { project_id, title, description, status, priority, due_date } = request.only([
      'project_id', 'title', 'description', 'status', 'priority', 'due_date'
    ])

    if (!project_id || !title) {
      return response.status(400).json({ message: 'project_id dan title wajib diisi' })
    }

    const task = await Task.create({
      projectId: project_id,
      title,
      description: description || null,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: due_date || null,
      assigneeId: user.id,
    })

    const Activity = (await import('#models/activity')).default
    await Activity.create({
      projectId: project_id,
      userId: user.id,
      action: `membuat task baru "${title}"`
    })

    return response.status(201).json({
      message: 'Task berhasil dibuat',
      data: task,
    })
  }

  /**
   * PUT /tasks/:id
   * Memperbarui task
   */
  async update({ params, request, response, auth }: HttpContext) {
    const task = await Task.find(params.id)

    if (!task) {
      return response.status(404).json({ message: `Task dengan ID ${params.id} tidak ditemukan` })
    }

    const { title, description, status, priority, due_date, assignee_id } = request.only([
      'title', 'description', 'status', 'priority', 'due_date', 'assignee_id'
    ])

    let changes = []
    if (title !== undefined && title !== task.title) { changes.push(`judul menjadi "${title}"`); task.title = title }
    if (description !== undefined && description !== task.description) { task.description = description }
    if (status && status !== task.status) { changes.push(`status menjadi ${status}`); task.status = status }
    if (priority && priority !== task.priority) { changes.push(`prioritas menjadi ${priority}`); task.priority = priority }
    if (due_date !== undefined) task.dueDate = due_date
    if (assignee_id !== undefined) task.assigneeId = assignee_id

    await task.save()

    if (changes.length > 0) {
      const Activity = (await import('#models/activity')).default
      await Activity.create({
        projectId: task.projectId,
        userId: auth.user!.id,
        action: `mengubah ${changes.join(', ')} pada task "${task.title}"`
      })
    }

    return response.json({
      message: 'Task berhasil diperbarui',
      data: task,
    })
  }

  /**
   * DELETE /tasks/:id
   * Menghapus task
   */
  async destroy({ params, response, auth }: HttpContext) {
    const task = await Task.find(params.id)

    if (!task) {
      return response.status(404).json({ message: `Task dengan ID ${params.id} tidak ditemukan` })
    }

    const title = task.title
    const projectId = task.projectId

    await task.delete()

    const Activity = (await import('#models/activity')).default
    await Activity.create({
      projectId: projectId,
      userId: auth.user!.id,
      action: `menghapus task "${title}"`
    })

    return response.json({
      message: 'Task berhasil dihapus',
    })
  }

  /**
   * POST /tasks/:taskId/subtasks
   */
  async storeSubtask({ request, params, response }: HttpContext) {
    const task = await Task.find(params.taskId)
    if (!task) {
      return response.status(404).json({ message: 'Task tidak ditemukan' })
    }

    const { title } = request.only(['title'])
    if (!title) {
      return response.status(400).json({ message: 'Judul subtask wajib diisi' })
    }

    const subtask = await Subtask.create({
      taskId: task.id,
      title,
      isCompleted: false
    })

    return response.status(201).json({
      message: 'Subtask berhasil dibuat',
      data: subtask
    })
  }

  /**
   * PUT /subtasks/:id
   */
  async updateSubtask({ request, params, response }: HttpContext) {
    const subtask = await Subtask.find(params.id)
    if (!subtask) {
      return response.status(404).json({ message: 'Subtask tidak ditemukan' })
    }

    const payload = request.only(['title', 'isCompleted'])
    if (payload.title !== undefined) subtask.title = payload.title
    if (payload.isCompleted !== undefined) subtask.isCompleted = payload.isCompleted

    await subtask.save()

    return response.json({
      message: 'Subtask berhasil diupdate',
      data: subtask
    })
  }

  /**
   * DELETE /subtasks/:id
   */
  async destroySubtask({ params, response }: HttpContext) {
    const subtask = await Subtask.find(params.id)
    if (!subtask) {
      return response.status(404).json({ message: 'Subtask tidak ditemukan' })
    }

    await subtask.delete()

    return response.json({
      message: 'Subtask berhasil dihapus'
    })
  }
}
