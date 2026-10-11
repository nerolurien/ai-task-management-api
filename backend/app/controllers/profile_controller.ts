import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class ProfileController {
  
  async getProfile({ response, auth }: HttpContext) {
    const user = auth.user!
    return response.json({
      message: 'Berhasil mengambil profil',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  }

  
  async updateProfile({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const { name } = request.only(['name'])

    if (!name) {
      return response.status(400).json({ message: 'Nama wajib diisi' })
    }

    user.name = name
    await user.save()

    return response.json({
      message: 'Profil berhasil diperbarui',
      data: { name: user.name, email: user.email }
    })
  }

  
  async updatePassword({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const { old_password, new_password } = request.only(['old_password', 'new_password'])

    if (!new_password) {
      return response.status(400).json({ message: 'Password baru wajib diisi' })
    }

    if (new_password.length < 6) {
      return response.status(400).json({ message: 'Password minimal 6 karakter' })
    }

    if (!user.isPasswordTemporary) {
      if (!old_password) {
        return response.status(400).json({ message: 'Password lama wajib diisi' })
      }
      const isMatched = await hash.verify(user.password, old_password)
      if (!isMatched) {
        return response.status(400).json({ message: 'Password lama salah' })
      }
    }
    user.password = new_password
    user.isPasswordTemporary = false
    await user.save()

    return response.json({ message: 'Password berhasil diubah' })
  }
}
