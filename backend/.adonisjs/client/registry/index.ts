/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.register': {
    methods: ["POST"],
    pattern: '/register',
    tokens: [{"old":"/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['auth.register']['types'],
  },
  'auth.login': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.invite': {
    methods: ["POST"],
    pattern: '/invite',
    tokens: [{"old":"/invite","type":0,"val":"invite","end":""}],
    types: placeholder as Registry['auth.invite']['types'],
  },
  'projects.index': {
    methods: ["GET","HEAD"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.index']['types'],
  },
  'projects.get_tasks': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:id/tasks',
    tokens: [{"old":"/projects/:id/tasks","type":0,"val":"projects","end":""},{"old":"/projects/:id/tasks","type":1,"val":"id","end":""},{"old":"/projects/:id/tasks","type":0,"val":"tasks","end":""}],
    types: placeholder as Registry['projects.get_tasks']['types'],
  },
  'projects.get_activities': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:id/activities',
    tokens: [{"old":"/projects/:id/activities","type":0,"val":"projects","end":""},{"old":"/projects/:id/activities","type":1,"val":"id","end":""},{"old":"/projects/:id/activities","type":0,"val":"activities","end":""}],
    types: placeholder as Registry['projects.get_activities']['types'],
  },
  'projects.get_members': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:id/members',
    tokens: [{"old":"/projects/:id/members","type":0,"val":"projects","end":""},{"old":"/projects/:id/members","type":1,"val":"id","end":""},{"old":"/projects/:id/members","type":0,"val":"members","end":""}],
    types: placeholder as Registry['projects.get_members']['types'],
  },
  'projects.update_member_role': {
    methods: ["PUT"],
    pattern: '/projects/:id/members/:userId/role',
    tokens: [{"old":"/projects/:id/members/:userId/role","type":0,"val":"projects","end":""},{"old":"/projects/:id/members/:userId/role","type":1,"val":"id","end":""},{"old":"/projects/:id/members/:userId/role","type":0,"val":"members","end":""},{"old":"/projects/:id/members/:userId/role","type":1,"val":"userId","end":""},{"old":"/projects/:id/members/:userId/role","type":0,"val":"role","end":""}],
    types: placeholder as Registry['projects.update_member_role']['types'],
  },
  'projects.kick_member': {
    methods: ["DELETE"],
    pattern: '/projects/:id/members/:userId',
    tokens: [{"old":"/projects/:id/members/:userId","type":0,"val":"projects","end":""},{"old":"/projects/:id/members/:userId","type":1,"val":"id","end":""},{"old":"/projects/:id/members/:userId","type":0,"val":"members","end":""},{"old":"/projects/:id/members/:userId","type":1,"val":"userId","end":""}],
    types: placeholder as Registry['projects.kick_member']['types'],
  },
  'projects.store': {
    methods: ["POST"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.store']['types'],
  },
  'ai.handle_command': {
    methods: ["POST"],
    pattern: '/ai/command',
    tokens: [{"old":"/ai/command","type":0,"val":"ai","end":""},{"old":"/ai/command","type":0,"val":"command","end":""}],
    types: placeholder as Registry['ai.handle_command']['types'],
  },
  'tasks.store': {
    methods: ["POST"],
    pattern: '/tasks',
    tokens: [{"old":"/tasks","type":0,"val":"tasks","end":""}],
    types: placeholder as Registry['tasks.store']['types'],
  },
  'tasks.update': {
    methods: ["PUT"],
    pattern: '/tasks/:id',
    tokens: [{"old":"/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.update']['types'],
  },
  'tasks.destroy': {
    methods: ["DELETE"],
    pattern: '/tasks/:id',
    tokens: [{"old":"/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.destroy']['types'],
  },
  'tasks.store_subtask': {
    methods: ["POST"],
    pattern: '/tasks/:taskId/subtasks',
    tokens: [{"old":"/tasks/:taskId/subtasks","type":0,"val":"tasks","end":""},{"old":"/tasks/:taskId/subtasks","type":1,"val":"taskId","end":""},{"old":"/tasks/:taskId/subtasks","type":0,"val":"subtasks","end":""}],
    types: placeholder as Registry['tasks.store_subtask']['types'],
  },
  'tasks.update_subtask': {
    methods: ["PUT"],
    pattern: '/subtasks/:id',
    tokens: [{"old":"/subtasks/:id","type":0,"val":"subtasks","end":""},{"old":"/subtasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.update_subtask']['types'],
  },
  'tasks.destroy_subtask': {
    methods: ["DELETE"],
    pattern: '/subtasks/:id',
    tokens: [{"old":"/subtasks/:id","type":0,"val":"subtasks","end":""},{"old":"/subtasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.destroy_subtask']['types'],
  },
  'comments.index': {
    methods: ["GET","HEAD"],
    pattern: '/tasks/:taskId/comments',
    tokens: [{"old":"/tasks/:taskId/comments","type":0,"val":"tasks","end":""},{"old":"/tasks/:taskId/comments","type":1,"val":"taskId","end":""},{"old":"/tasks/:taskId/comments","type":0,"val":"comments","end":""}],
    types: placeholder as Registry['comments.index']['types'],
  },
  'comments.store': {
    methods: ["POST"],
    pattern: '/tasks/:taskId/comments',
    tokens: [{"old":"/tasks/:taskId/comments","type":0,"val":"tasks","end":""},{"old":"/tasks/:taskId/comments","type":1,"val":"taskId","end":""},{"old":"/tasks/:taskId/comments","type":0,"val":"comments","end":""}],
    types: placeholder as Registry['comments.store']['types'],
  },
  'notifications.index': {
    methods: ["GET","HEAD"],
    pattern: '/notifications',
    tokens: [{"old":"/notifications","type":0,"val":"notifications","end":""}],
    types: placeholder as Registry['notifications.index']['types'],
  },
  'notifications.respond': {
    methods: ["POST"],
    pattern: '/notifications/:id/respond',
    tokens: [{"old":"/notifications/:id/respond","type":0,"val":"notifications","end":""},{"old":"/notifications/:id/respond","type":1,"val":"id","end":""},{"old":"/notifications/:id/respond","type":0,"val":"respond","end":""}],
    types: placeholder as Registry['notifications.respond']['types'],
  },
  'profile.get_profile': {
    methods: ["GET","HEAD"],
    pattern: '/profile',
    tokens: [{"old":"/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.get_profile']['types'],
  },
  'profile.update_profile': {
    methods: ["PUT"],
    pattern: '/profile',
    tokens: [{"old":"/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.update_profile']['types'],
  },
  'profile.update_password': {
    methods: ["PUT"],
    pattern: '/profile/password',
    tokens: [{"old":"/profile/password","type":0,"val":"profile","end":""},{"old":"/profile/password","type":0,"val":"password","end":""}],
    types: placeholder as Registry['profile.update_password']['types'],
  },
  'users.index': {
    methods: ["GET","HEAD"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.index']['types'],
  },
  'users.destroy': {
    methods: ["DELETE"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.destroy']['types'],
  },
  'projects.show': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.show']['types'],
  },
  'projects.update': {
    methods: ["PUT"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.update']['types'],
  },
  'projects.destroy': {
    methods: ["DELETE"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
