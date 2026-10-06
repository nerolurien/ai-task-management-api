import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  /**
   * GET /users
   * Admin dashboard: List all users and their basic stats
   */
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
        totalProjects: user.$extras.totalProjects || 0,
        createdAt: user.createdAt
      }))
    })
  }

  /**
   * DELETE /users/:id
   * Admin: Hapus user
   */
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
}