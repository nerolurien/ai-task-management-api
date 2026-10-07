/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    register: typeof routes['auth.register']
    login: typeof routes['auth.login']
    invite: typeof routes['auth.invite']
  }
  projects: {
    index: typeof routes['projects.index']
    store: typeof routes['projects.store']
    show: typeof routes['projects.show']
    update: typeof routes['projects.update']
    destroy: typeof routes['projects.destroy']
    getTasks: typeof routes['projects.get_tasks']
    getActivities: typeof routes['projects.get_activities']
    getMembers: typeof routes['projects.get_members']
    updateMemberRole: typeof routes['projects.update_member_role']
    kickMember: typeof routes['projects.kick_member']
  }
  ai: {
    handleCommand: typeof routes['ai.handle_command']
  }
  tasks: {
    store: typeof routes['tasks.store']
    update: typeof routes['tasks.update']
    destroy: typeof routes['tasks.destroy']
    storeSubtask: typeof routes['tasks.store_subtask']
    updateSubtask: typeof routes['tasks.update_subtask']
    destroySubtask: typeof routes['tasks.destroy_subtask']
  }
  comments: {
    index: typeof routes['comments.index']
    store: typeof routes['comments.store']
  }
  notifications: {
    index: typeof routes['notifications.index']
    respond: typeof routes['notifications.respond']
  }
  profile: {
    getProfile: typeof routes['profile.get_profile']
    updateProfile: typeof routes['profile.update_profile']
    updatePassword: typeof routes['profile.update_password']
  }
  users: {
    index: typeof routes['users.index']
    destroy: typeof routes['users.destroy']
  }
}
