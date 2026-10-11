import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Project from '#models/project'
import Task from '#models/task'
import Activity from '#models/activity'
import AuditLog from '#models/audit_log'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  
  async index({ response }: HttpContext) {
    const users = await User.query()
      .withCount('projects', (query) => query.as('totalProjects'))
      .orderBy('created_at', 'desc')

    return response.json({
      message: 'Berhasil mengambil data pengguna',
      data: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPasswordTemporary: user.isPasswordTemporary,
        totalProjects: Number(user.$extras.totalProjects || 0),
        createdAt: user.createdAt
      }))
    })
  }

  
  async updateRole({ params, request, response, auth }: HttpContext) {
    const targetUser = await User.find(params.id)
    if (!targetUser) {
      return response.status(404).json({ message: 'Pengguna tidak ditemukan' })
    }

    if (targetUser.id === auth.user!.id) {
      return response.status(400).json({ message: 'Anda tidak dapat mengubah role akun sendiri' })
    }

    const { role } = request.only(['role'])
    if (!role || !['admin', 'user'].includes(role)) {
      return response.status(400).json({ message: 'Role harus berupa "admin" atau "user"' })
    }

    targetUser.role = role
    await targetUser.save()

    return response.json({
      message: `Role pengguna berhasil diubah menjadi ${role}`,
      data: {
        id: targetUser.id,
        name: targetUser.name,
        role: targetUser.role
      }
    })
  }

  
  async resetPassword({ params, request, response }: HttpContext) {
    const targetUser = await User.find(params.id)
    if (!targetUser) {
      return response.status(404).json({ message: 'Pengguna tidak ditemukan' })
    }

    const { newPassword } = request.only(['newPassword'])
    const passwordToSet = newPassword || 'Password123!'

    targetUser.password = passwordToSet
    targetUser.isPasswordTemporary = true
    await targetUser.save()

    return response.json({
      message: 'Password pengguna berhasil di-reset menjadi password sementara',
      temporaryPassword: passwordToSet
    })
  }

  
  async destroy({ params, response, auth }: HttpContext) {
    const userToDelete = await User.find(params.id)
    if (!userToDelete) {
      return response.status(404).json({ message: 'Pengguna tidak ditemukan' })
    }
    
    if (userToDelete.id === auth.user!.id) {
      return response.status(400).json({ message: 'Anda tidak dapat menghapus akun Anda sendiri' })
    }

    if (userToDelete.role === 'admin') {
      return response.status(400).json({ message: 'Tidak dapat menghapus sesama admin' })
    }

    await userToDelete.delete()
    return response.json({ message: 'Pengguna berhasil dihapus' })
  }

  
  async getOperationalStats({ response }: HttpContext) {
    const totalUsers = await User.query().count('* as total')
    const totalAdmins = await User.query().where('role', 'admin').count('* as total')
    const totalProjects = await Project.query().count('* as total')
    
    const totalTasks = await Task.query().count('* as total')
    const todoTasks = await Task.query().where('status', 'todo').count('* as total')
    const inProgressTasks = await Task.query().where('status', 'in_progress').count('* as total')
    const doneTasks = await Task.query().where('status', 'done').count('* as total')

    const highPriorityTasks = await Task.query().where('priority', 'high').count('* as total')
    const mediumPriorityTasks = await Task.query().where('priority', 'medium').count('* as total')
    const lowPriorityTasks = await Task.query().where('priority', 'low').count('* as total')

    const totalActivities = await Activity.query().count('* as total')
    const recentActivities = await Activity.query()
      .preload('user', (q) => q.select('id', 'name', 'email'))
      .preload('project', (q) => q.select('id', 'name'))
      .orderBy('created_at', 'desc')
      .limit(8)

    const auditLogsCount = await AuditLog.query().count('* as total')
    const recentAuditLogs = await AuditLog.query()
      .orderBy('created_at', 'desc')
      .limit(8)

    const totalTasksNum = Number(totalTasks[0].$extras.total || 0)
    const doneTasksNum = Number(doneTasks[0].$extras.total || 0)
    const completionRate = totalTasksNum > 0 ? Math.round((doneTasksNum / totalTasksNum) * 100) : 0

    return response.json({
      message: 'Berhasil mengambil statistik operasional sistem',
      data: {
        summary: {
          totalUsers: Number(totalUsers[0].$extras.total || 0),
          totalAdmins: Number(totalAdmins[0].$extras.total || 0),
          totalProjects: Number(totalProjects[0].$extras.total || 0),
          totalTasks: totalTasksNum,
          completionRate,
          totalActivities: Number(totalActivities[0].$extras.total || 0),
          totalAuditLogs: Number(auditLogsCount[0].$extras.total || 0)
        },
        taskDistribution: {
          todo: Number(todoTasks[0].$extras.total || 0),
          inProgress: Number(inProgressTasks[0].$extras.total || 0),
          done: doneTasksNum,
        },
        priorityDistribution: {
          high: Number(highPriorityTasks[0].$extras.total || 0),
          medium: Number(mediumPriorityTasks[0].$extras.total || 0),
          low: Number(lowPriorityTasks[0].$extras.total || 0),
        },
        recentActivities,
        recentAuditLogs
      }
    })
  }
}