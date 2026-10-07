import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import Task from '#models/task'

export default class ProjectsController {
  /**
   * GET /projects
   * User & Admin bisa melihat daftar semua proyek
   */
  async index({ response, auth }: HttpContext) {
    const user = auth.user!

    let query = Project.query().preload('creator', (query) => {
      query.select('id', 'name', 'email')
    })

    if (user.role === 'user') {
      query = query.where((builder) => {
        builder
          .where('created_by', user.id)
          .orWhereHas('notifications', (notifQuery) => {
            notifQuery.where('user_id', user.id)
                      .where('type', 'PROJECT_INVITE')
                      .where('status', 'accepted')
          })
      })
    }

    const projects = await query

    return response.json({
      message: 'Berhasil mengambil daftar proyek',
      data: projects,
    })
  }

  /**
   * GET /projects/:id
   * Admin melihat detail 1 proyek
   */
  async show({ params, response }: HttpContext) {
    const project = await Project.find(params.id)

    if (!project) {
      return response.status(404).json({
        message: `Project dengan ID ${params.id} tidak ditemukan`,
      })
    }

    await project.load('creator', (query) => {
      query.select('id', 'name', 'email')
    })

    return response.json({
      message: 'Berhasil mengambil detail proyek',
      data: project,
    })
  }

  /**
   * POST /projects
   * Admin membuat proyek baru
   */
  async store({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const { name, description } = request.only(['name', 'description'])

    if (!name) {
      return response.status(400).json({
        message: 'Nama proyek wajib diisi',
      })
    }

    const project = await Project.create({
      name,
      description: description || null,
      createdBy: user.id,
    })

    return response.status(201).json({
      message: 'Proyek berhasil dibuat',
      data: project,
    })
  }

  /**
   * PUT /projects/:id
   * Admin memperbarui proyek
   */
  async update({ params, request, response }: HttpContext) {
    const project = await Project.find(params.id)

    if (!project) {
      return response.status(404).json({
        message: `Project dengan ID ${params.id} tidak ditemukan`,
      })
    }

    const { name, description, editors_can_invite } = request.only(['name', 'description', 'editors_can_invite'])

    if (name) project.name = name
    if (description !== undefined) project.description = description
    if (editors_can_invite !== undefined) project.editorsCanInvite = editors_can_invite

    await project.save()

    return response.json({
      message: 'Proyek berhasil diperbarui',
      data: project,
    })
  }

  /**
   * DELETE /projects/:id
   * Admin menghapus proyek
   */
  async destroy({ params, response }: HttpContext) {
    const project = await Project.find(params.id)

    if (!project) {
      return response.status(404).json({
        message: `Project dengan ID ${params.id} tidak ditemukan`,
      })
    }

    await project.delete()

    return response.json({
      message: 'Proyek berhasil dihapus',
    })
  }

  /**
   * GET /projects/:id/tasks
   * User & Admin melihat semua tugas di dalam proyek tertentu
   */
  async getTasks({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const project = await Project.find(params.id)

    if (!project) {
      return response.status(404).json({
        message: `Project dengan ID ${params.id} tidak ditemukan`,
      })
    }

    let tasksQuery = Task.query()
      .where('projectId', params.id)
      .preload('assignee', (query) => {
        query.select('id', 'name', 'email')
      })
      .preload('subtasks', (query) => {
        query.orderBy('created_at', 'asc')
      })

    if (user.role === 'user') {
      const isCreator = project.createdBy === user.id
      
      const isMember = await (await import('#models/notification')).default.query()
        .where('user_id', user.id)
        .where('project_id', project.id)
        .where('status', 'accepted')
        .first()

      if (!isCreator && !isMember) {
        return response.status(403).json({
          message: 'Anda bukan anggota dari project ini'
        })
      }
    }

    const tasks = await tasksQuery

    return response.json({
      message: `Daftar task untuk project ID ${params.id}`,
      data: tasks,
    })
  }

  /**
   * GET /projects/:id/activities
   * Melihat riwayat aktivitas project
   */
  async getActivities({ params, response }: HttpContext) {
    const Activity = (await import('#models/activity')).default
    const activities = await Activity.query()
      .where('project_id', params.id)
      .preload('user', (query) => query.select('id', 'name'))
      .orderBy('created_at', 'desc')
      .limit(50)

    return response.json({
      message: 'Berhasil mengambil aktivitas proyek',
      data: activities
    })
  }

  /**
   * GET /projects/:id/members
   * Mendapatkan daftar member dan undangan pending
   */
  async getMembers({ params, response, auth }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) return response.status(404).json({ message: 'Project tidak ditemukan' })

    await project.load('creator', (query) => query.select('id', 'name', 'email'))

    const Notification = (await import('#models/notification')).default
    const invites = await Notification.query()
      .where('project_id', params.id)
      .where('type', 'PROJECT_INVITE')
      .preload('user', (query) => query.select('id', 'name', 'email'))

    const rawMembers = invites
      .filter(inv => inv.status === 'accepted')
      .map(inv => ({ ...inv.user.serialize(), role: inv.role }))
      .filter(u => u.id !== project.creator.id)

    // Hapus duplikat jika ada
    const members = Array.from(new Map(rawMembers.map(item => [item.id, item])).values())
      
    const pending = invites.filter(inv => inv.status === 'pending')

    return response.json({
      message: 'Berhasil mengambil data member',
      data: {
        creator: project.creator,
        members,
        pending,
        isOwner: auth.user!.id === project.createdBy
      }
    })
  }

  /**
   * DELETE /projects/:id/members/:userId
   * Mengeluarkan member dari project (hanya owner)
   */
    /**
   * PUT /projects/:id/members/:userId/role
   * Mengubah role member (hanya bisa dilakukan oleh Owner)
   */
  async updateMemberRole({ params, request, response, auth }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) return response.status(404).json({ message: 'Project tidak ditemukan' })

    if (project.createdBy !== auth.user!.id) {
      return response.status(403).json({ message: 'Hanya Owner yang dapat mengubah role member' })
    }

    const { role } = request.only(['role'])
    if (!['viewer', 'editor', 'manager'].includes(role)) {
      return response.status(400).json({ message: 'Role tidak valid' })
    }

    const Notification = (await import('#models/notification')).default
    const invite = await Notification.query()
      .where('project_id', params.id)
      .where('user_id', params.userId)
      .where('type', 'PROJECT_INVITE')
      .where('status', 'accepted')
      .first()

    if (!invite) {
      return response.status(404).json({ message: 'Member tidak ditemukan' })
    }

    invite.role = role
    await invite.save()

    return response.json({ message: 'Role berhasil diperbarui' })
  }

  async kickMember({ params, response, auth }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) return response.status(404).json({ message: 'Project tidak ditemukan' })

    // Hanya owner yang bisa kick
    if (project.createdBy !== auth.user!.id) {
      return response.status(403).json({ message: 'Akses ditolak. Hanya pemilik project yang bisa mengeluarkan anggota.' })
    }

    const targetUserId = params.userId
    if (project.createdBy === Number(targetUserId)) {
      return response.status(400).json({ message: 'Pemilik project tidak bisa dikeluarkan.' })
    }

    const Notification = (await import('#models/notification')).default
    const deletedCount = await Notification.query()
      .where('project_id', project.id)
      .where('user_id', targetUserId)
      .where('type', 'PROJECT_INVITE')
      .delete()

    if (deletedCount[0] === 0) {
      return response.status(404).json({ message: 'Member tidak ditemukan di project ini' })
    }

    // Catat ke Activity Log
    const targetUser = await (await import('#models/user')).default.find(targetUserId)
    const targetName = targetUser ? targetUser.name : 'Seorang member'
    
    const Activity = (await import('#models/activity')).default
    await Activity.create({
      projectId: project.id,
      userId: auth.user!.id,
      action: `mengeluarkan ${targetName} dari project`
    })

    return response.json({ message: 'Member berhasil dikeluarkan' })
  }
}