import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  /**
   * POST /register
   * Mendaftar sebagai admin / user
   */
  async register({ request, response }: HttpContext) {
    const payload = request.only(['name', 'email', 'password', 'role'])

    if (!payload.name || !payload.email || !payload.password) {
      return response.status(400).json({
        message: 'Name, email, dan password wajib diisi',
      })
    }

    if (payload.password.length < 6) {
      return response.status(400).json({
        message: 'Password minimal 6 karakter',
      })
    }

    const existingUser = await User.findBy('email', payload.email)
    if (existingUser) {
      return response.status(400).json({
        message: 'Email sudah terdaftar',
      })
    }

    // Role hanya boleh 'admin' atau 'user', default: 'user'
    const role = payload.role === 'admin' ? 'admin' : 'user'

    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: role,
    })

    return response.status(201).json({
      message: 'Registrasi berhasil',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  }

  /**
   * POST /login
   * Login untuk mendapatkan token JWT / Access Token
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    if (!email || !password) {
      return response.status(400).json({
        message: 'Email dan password wajib diisi',
      })
    }

    const user = await User.verifyCredentials(email, password)
    if (!user) {
      return response.status(401).json({
        message: 'Email atau password salah',
      })
    }

    const token = await User.accessTokens.create(user)

    return response.json({
      message: 'Login berhasil',
      token: token.value!.release(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPasswordTemporary: user.isPasswordTemporary,
      },
    })
  }

  /**
   * POST /invite
   * Mengundang user (membuat akun via email) & mengirim notifikasi project
   */
  async invite({ request, response, auth }: HttpContext) {
    const sender = auth.user!
    const { email, project_id, forceCreate, role } = request.only(['email', 'project_id', 'forceCreate', 'role'])

    if (!email || !project_id) {
      return response.status(400).json({
        message: 'Email dan project_id wajib diisi',
      })
    }

    let user = await User.findBy('email', email)
    let tempPassword = null

    if (!user) {
      if (!forceCreate) {
        return response.status(404).json({
          code: 'USER_NOT_FOUND',
          message: 'Akun belum terdaftar. Buat akun baru?'
        })
      }

      tempPassword = Math.random().toString(36).slice(-8)
      user = await User.create({
        name: email.split('@')[0],
        email: email,
        password: tempPassword,
        role: 'user',
        isPasswordTemporary: true
      })
    }

    // Cek apakah user adalah owner project
    const Project = (await import('#models/project')).default
    const project = await Project.find(project_id)
    if (project && project.createdBy === user.id) {
      return response.status(400).json({ message: 'User adalah pemilik project ini (sudah menjadi anggota)' })
    }

    // Cek apakah sudah diundang sebelumnya
    const existingInvite = await (await import('#models/notification')).default.query()
      .where('user_id', user.id)
      .where('project_id', project_id)
      .where('type', 'PROJECT_INVITE')
      .first()

    if (existingInvite && existingInvite.status === 'pending') {
      return response.status(400).json({ message: 'User sudah diundang ke project ini dan menunggu konfirmasi' })
    }

    if (existingInvite && existingInvite.status === 'accepted') {
      return response.status(400).json({ message: 'User sudah bergabung ke project ini' })
    }

    const Notification = (await import('#models/notification')).default
    await Notification.create({
      userId: user.id,
      projectId: project_id,
      senderId: sender.id,
      type: 'PROJECT_INVITE',
      role: role || 'editor',
      status: 'pending',
    })

    return response.status(201).json({
      message: 'Undangan berhasil dikirim',
      data: {
        email: user.email,
        tempPassword,
        isNewUser: !!tempPassword
      },
    })
  }
}