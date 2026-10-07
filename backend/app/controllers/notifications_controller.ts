import type { HttpContext } from '@adonisjs/core/http'
import Notification from '#models/notification'
import { DateTime } from 'luxon'

export default class NotificationsController {
  /**
   * GET /notifications
   * Mendapatkan semua notifikasi user (terutama invite)
   */
  async index({ response, auth }: HttpContext) {
    const user = auth.user!

    // Cleanup expired invites (older than 1 hour)
    const oneHourAgo = DateTime.now().minus({ hours: 1 }).toJSDate()
    await Notification.query()
      .where('type', 'PROJECT_INVITE')
      .where('status', 'pending')
      .where('created_at', '<', oneHourAgo)
      .delete()

    // 1. Get real invite notifications
    const inviteNotifications = await Notification.query()
      .where('user_id', user.id)
      .where('status', 'pending')
      .preload('project', (query) => query.select('id', 'name'))
      .preload('sender', (query) => query.select('id', 'name', 'email'))
      .orderBy('created_at', 'desc')

    // 2. Generate dynamic deadline notifications
    const Task = (await import('#models/task')).default
    
    // Find tasks assigned to this user that are not done
    const pendingTasks = await Task.query()
      .where('assigneeId', user.id)
      .whereNot('status', 'done')
      .whereNotNull('dueDate')
      .preload('project', (query) => query.select('id', 'name'))

    const deadlineNotifications: any[] = []
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (const task of pendingTasks) {
      if (!task.dueDate) continue;
      const due = new Date(task.dueDate.toISO()!)
      due.setHours(0, 0, 0, 0)
      
      const diffTime = due.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays <= 0) { // Due today or overdue
        deadlineNotifications.push({
          id: `deadline-${task.id}`,
          type: 'DEADLINE_REMINDER',
          status: 'pending',
          task: {
            id: task.id,
            title: task.title,
            dueDate: task.dueDate,
            isOverdue: diffDays < 0
          },
          project: task.project,
          createdAt: new Date().toISOString()
        })
      }
    }

    return response.json({
      message: 'Berhasil mengambil notifikasi',
      data: [...deadlineNotifications, ...inviteNotifications],
    })
  }

  /**
   * POST /notifications/:id/respond
   * Merespon undangan (terima/tolak)
   */
  async respond({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const { status } = request.only(['status']) // 'accepted' atau 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return response.status(400).json({ message: 'Status tidak valid' })
    }

    const notification = await Notification.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!notification) {
      return response.status(404).json({ message: 'Notifikasi tidak ditemukan' })
    }

    // Check expiration if it's a project invite
    if (notification.type === 'PROJECT_INVITE') {
      const oneHourAgo = DateTime.now().minus({ hours: 1 })
      if (notification.createdAt < oneHourAgo) {
        await notification.delete()
        return response.status(400).json({ message: 'Undangan telah kedaluwarsa (lebih dari 1 jam) dan dihapus.' })
      }
    }

    notification.status = status
    await notification.save()

    return response.json({
      message: `Undangan berhasil di-${status === 'accepted' ? 'terima' : 'tolak'}`,
    })
  }
}