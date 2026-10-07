import Project from '#models/project'
import Notification from '#models/notification'

export async function checkProjectPermission(userId: number, projectId: number, allowedRoles: ('viewer' | 'editor' | 'manager')[]) {
  const project = await Project.find(projectId)
  if (!project) return false
  
  // Creator / Owner is effectively a super-admin of their own project
  if (project.createdBy === userId) return true

  const notif = await Notification.query()
    .where('user_id', userId)
    .where('project_id', projectId)
    .where('type', 'PROJECT_INVITE')
    .where('status', 'accepted')
    .first()

  if (!notif) return false

  const userRole = notif.role || 'viewer'
  return allowedRoles.includes(userRole as any)
}
