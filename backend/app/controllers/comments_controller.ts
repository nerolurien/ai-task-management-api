import type { HttpContext } from '@adonisjs/core/http'
import Comment from '#models/comment'
import Task from '#models/task'

export default class CommentsController {
  /**
   * GET /tasks/:taskId/comments
   * Mendapatkan komentar untuk task tertentu
   */
  async index({ params, response }: HttpContext) {
    const comments = await Comment.query()
      .where('task_id', params.taskId)
      .preload('user', (query) => query.select('id', 'name', 'email'))
      .orderBy('created_at', 'asc')

    return response.json({
      message: 'Berhasil mengambil komentar',
      data: comments,
    })
  }

  /**
   * POST /tasks/:taskId/comments
   * Menambahkan komentar baru ke task
   */
  async store({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const { content } = request.only(['content'])

    if (!content) {
      return response.status(400).json({ message: 'Komentar tidak boleh kosong' })
    }

    const task = await Task.find(params.taskId)
    if (!task) {
      return response.status(404).json({ message: 'Task tidak ditemukan' })
    }

    const comment = await Comment.create({
      taskId: task.id,
      userId: user.id,
      content,
    })

    await comment.load('user', (query) => query.select('id', 'name', 'email'))

    return response.status(201).json({
      message: 'Komentar berhasil ditambahkan',
      data: comment,
    })
  }
}